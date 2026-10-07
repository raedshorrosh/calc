<!--*Bridge outside [[iframe]]: Bypasses TinyMCE, hides Moodle Submit, and listens for Custom Submit -->
<span id="hintBridge_{#rqm#}" style="display:none;"></span>
<div id="qtext{#rqm#}" style="display:none;"></div>
<span id="roBridge_{#rqm#}" style="display:none;"></span>
<script>
(function() {
  function syncParentPageState() {
    var marker = document.getElementById("hintBridge_{#rqm#}");
    if (!marker) return;
    var qBox = marker.closest(".que");
    if (!qBox) return;

    // 1. Capture Question Text
    var qtextEl = document.getElementById("qtext{#rqm#}");
    if (qtextEl) {
      var thead = qBox.querySelector("thead");
      qtextEl.textContent = (thead ? thead.textContent : qBox.textContent).replace(/\s+/g, " ").trim();
    }

    // 2. Check readonly state
    var roEl = document.getElementById("roBridge_{#rqm#}");
    var ansInput = qBox.querySelector("input[name$='_ans1'], input[name$='_ans2']");
    if (roEl && ansInput && (ansInput.readOnly || ansInput.disabled || ansInput.hasAttribute("readonly"))) {
      roEl.textContent = "true";
    }

    // 3. Restore Hint 2 ID
    var outcomeBox = qBox.querySelector(".outcome");
    if (outcomeBox) {
      var html = outcomeBox.innerHTML;
      if (html.indexOf("כפתור" + " hint") !== -1 || html.indexOf("[" + "false]") !== -1) {
        marker.id = "contentCT{#rqm#}";
        marker.textContent = "[false]";
      }
    }

// 4. Hide Moodle's default "Check" (בדוק) button box
    var imcontrols = qBox.querySelector(".imcontrols, .im-controls");
    if (imcontrols) {
      imcontrols.style.display = "none";
    }
  }

  // 5. Listen for the iframe's command to submit the question to Moodle
  window.addEventListener("message", function(e) {
    if (e.data && e.data.action === "triggerSubmit{#rqm#}") {
      var marker = document.getElementById("hintBridge_{#rqm#}");
      if (marker) {
        var qBox = marker.closest(".que");
        if (qBox) {
          // Find the hidden Moodle submit button and click it
          var submitBtn = qBox.querySelector(".imcontrols input[type='submit'], .imcontrols button[type='submit'], .im-controls input[type='submit'], .im-controls button[type='submit']");
          if (submitBtn) submitBtn.click();
        }
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncParentPageState);
  } else {
    syncParentPageState();
  }
})();
</script>

 [[iframe]]
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
[[comment]] ver 1.15 Manual AI Submit Button + Save to ans3 STACK Database [[/comment]]
  
 <div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
   <div id="spreadsheet" dir="ltr" ></div>
   <div id="myView" style="display:none;" ></div>
 </div>

 <!-- Custom Submit Button Panel (Visible only when editing) -->
 <div id="aiControlPanel" style="text-align: center; margin-top: 15px; width: 100%;">
   <button id="aiSubmitBtn" style="padding: 8px 16px; font-size: 16px; font-family: Arial, sans-serif; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px; display: none;">בדוק את הטבלה</button>
 </div>

 <!-- Container for AI feedback -->
 <div id="aiView" dir="rtl" style="display:none; margin-top: 10px; font-family: Arial, sans-serif; width: 100%; text-align: right;"></div>
   
[[script type="module"]]

MathJax.Hub.Config({
  jax: ['input/AsciiMath'],
  extensions: ['asciimath2jax.js'],
  asciimath2jax: { delimiters: [['`', '`']] }
});
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
stack_js.resize_containing_frame({#width#}, parseInt({#height#}, 10) + 200 + "px"); 

var promises = [
 stack_js.request_access_to_input("ans2", true),
 stack_js.request_access_to_input("ans3", true) // The new STACK input for AI feedback
];

Promise.all(promises).then(([idForAns2, idForAns3]) => {
  var dataInput = document.getElementById(idForAns2);
  var aiInput   = document.getElementById(idForAns3); // Access the hidden ans3
  
  var S=function(value,n){return value.toExponential(n)};
  var uid_table={#rqm#};
  var uid_hint="hint{#rqm#}";
  
  var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
  tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

  var readonly=false, showHint=(localStorage.getItem("showhint")=={#rqm#});
  var zData=["","","","","","","","","","","","","","",""];

  var data = [zData.slice(0,{#Titles#}.length)];
  if (dataInput.value && dataInput.value !== '') {
    data = JSON.parse(dataInput.value);
  } else {
    dataInput.value = JSON.stringify(data);
    dataInput.dispatchEvent(new Event('change'));
  }

  var nested;
  const nst={#nested#};
  if (nst === undefined) {nested=[]} else {nested=JSON.parse(nst.replace(/'/g, '"'))};
  
  var widths=[180,120,120];
  for (let i=3; i<{#Titles#}.length; i++){widths[i]=120};

  var table = jspreadsheet(document.getElementById(uid_table), {
    data: data,
    colHeaders: {#Titles#},
    colWidths: widths,
    allowManualInsertColumn: 0,             
    allowInsertColumn: 0,
    allowDeleteColumn: 0,
    columns: [
        { type: 'dropdown', source:{#items#} },
        { type: 'dropdown', source:{#units#} },
        { type: 'text', wordWrap:true }
    ],
    nestedHeaders: nested,                                     
      updateTable: function (instance, cell, col, row, val, label, cellName) {
      var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
      if (isAttemptMode && readonly) {cell.classList.add('readonly');}                                    
      
      // Protect ans2: Only save the original columns to STACK so Maxima grading doesn't crash!
      var originalCols = {#Titles#}.length;
      var currentData = instance.jspreadsheet.getData();
      var cleanData = currentData.map(function(r) { return r.slice(0, originalCols); });
      
      dataInput.value=JSON.stringify(cleanData);
      dataInput.dispatchEvent(new Event('change'));
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 
    columnSorting: false,
  });
  
  table.refresh();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  table.onbeforechange = function(instance, cell, x, y, value) { if (readonly) cell.classList.add('readonly'); };

  var btn = document.createElement("button");
  var t = document.createTextNode("hint");
  btn.appendChild(t);   
  btn.onclick = function(e){
     e.preventDefault(); 
     table.setData({#hintdata#});
  };  
  var hint_el = document.getElementById(uid_hint);
  hint_el.appendChild(btn);
  btn.disabled = true; 
            
  if ( ({#hint_enable#}==1) || showHint) {
      hint_el.style.display = "block";
      btn.disabled = false;
  }        

  var answered=false;
  stack_js.get_content("contentCT{#rqm#}").then((content) => {
    if (content !== null && !answered) {
      answered = true;
      localStorage.setItem("showhint",{#rqm#});
    }
  });

// ── AI SUBMISSION AND DISPLAY LOGIC ────────────────
  (async function setupAiLogic() {
    let isInputReadOnly = Boolean(dataInput.readOnly || dataInput.disabled || dataInput.hasAttribute('readonly'));
    if (!isInputReadOnly) {
      const parentRo = await stack_js.get_content("roBridge_{#rqm#}");
      if (parentRo && parentRo.trim() === "true") isInputReadOnly = true;
    }

    const aiOutput = document.getElementById('aiView');
    const customSubmitBtn = document.getElementById('aiSubmitBtn');
    const backupCacheKey = 'ai_eval_backup_' + uid_table;

   // 1. If question is already submitted (readonly), display the saved AI HTML and insert Grade column
    if (isInputReadOnly) {
      let savedReply = (aiInput && aiInput.value) ? aiInput.value : '';
      
      if (!savedReply || savedReply.trim() === '') {
        savedReply = localStorage.getItem(backupCacheKey) || '';
      }

      if (savedReply.startsWith('"') && savedReply.endsWith('"')) {
        try { savedReply = JSON.parse(savedReply); } catch(e) { savedReply = savedReply.slice(1, -1); }
      }

  // --- EXTRACT JSON ROW MARKS ---
      let rowMarks = [];
      let parts = savedReply.split('@@@ROW_MARKS@@@');
      if (parts.length > 1) {
        savedReply = parts[0]; // Keep only the HTML for the bottom summary
        
        let jsonStr = parts[1].trim();
        // Clean up markdown code blocks if the AI accidentally added them
        jsonStr = jsonStr.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        
        try { 
          rowMarks = JSON.parse(jsonStr); 
        } catch(e) { 
          console.warn("Could not parse row marks JSON:", jsonStr, e); 
        }
      }

      // --- DISPLAY HTML SUMMARY ---
      if (savedReply && savedReply.trim() !== '') {
        aiOutput.style.cssText = 'display: block; margin-top: 10px; max-height: 180px; overflow-y: auto; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 15px; font-family: Arial, sans-serif; text-align: right;';
        aiOutput.innerHTML = savedReply;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, aiOutput]);
      }

      // --- DYNAMICALLY INSERT "ציון" (GRADE) COLUMN BY UPDATING DATA ARRAY ---
      if (rowMarks.length > 0) {
        let originalCols = {#Titles#}.length;
        let headersStr = table.getHeaders();
        let currentColCount = headersStr ? headersStr.split(',').length : originalCols;
        
        // Only insert if we haven't already inserted the grade column
        if (currentColCount === originalCols) {
          
          let settings = table.getConfig();
          
          // 1. Get current clean data and append the new AI grades directly to each row
          let currentData = table.getData();
          for (let i = 0; i < currentData.length; i++) {
            let mark = (rowMarks[i] !== undefined && rowMarks[i] !== null) ? String(rowMarks[i]) : '';
            currentData[i].push(mark);
          }
          // Force the table settings to use our updated data array
          settings.data = currentData; 
          
          // 2. Add the new column definition
          settings.columns.push({ type: 'text', readOnly: true, stripHTML: false });
          settings.colHeaders.push('ציון');
          settings.colWidths.push(160);
          
          // 3. Balance the nested headers so the table doesn't crash
          if (settings.nestedHeaders && settings.nestedHeaders.length > 0) {
            for (let i = 0; i < settings.nestedHeaders.length; i++) {
              settings.nestedHeaders[i].push({ title: 'משוב AI', colspan: 1 });
            }
          }
          
          // 4. Destroy and recreate the table with the data already baked in
          table.destroy();
          table = jspreadsheet(document.getElementById(uid_table), settings);
          
          // 5. Apply visual styling to the new column
          for (let i = 0; i < currentData.length; i++) {
            if (currentData[i][originalCols] !== '') {
              let cellIdent = jspreadsheet.getColumnName(originalCols) + (i + 1);
              let cell = table.getCell(cellIdent);
              if (cell) {
                cell.style.backgroundColor = '#f8fafc';
                cell.style.fontWeight = 'bold';
                cell.style.color = '#334155';
              }
            }
          }
          
          // Trigger MathJax for any formulas inside the new column
          MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
      }
      return; // Stop execution
    }

    // 2. If editing, show our custom submit button
    customSubmitBtn.style.display = 'inline-block';

    customSubmitBtn.onclick = async function(e) {
      e.preventDefault();
      
      // Disable UI to prevent double-clicking
      customSubmitBtn.disabled = true;
      customSubmitBtn.style.backgroundColor = '#6c757d';
      customSubmitBtn.textContent = 'בודק את הטבלה ומגיש תשובה... נא להמתין';

      const studentFormulas = table.getData();
      const hasAnyContent = studentFormulas.some(row => row.some(cell => String(cell).trim() !== ''));

      // If table is completely empty, submit directly to Moodle without calling AI
      if (!hasAnyContent) {
        window.parent.postMessage({ action: "triggerSubmit{#rqm#}" }, "*");
        return;
      }

      const studentEvaluated = studentFormulas.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          try {
            const td = table.getCellFromCoords(cIdx, rIdx);
            return td ? td.textContent.trim() : cell;
          } catch (e) {
            return cell;
          }
        })
      );

      var something   = '';
      var ai_models   = ['gemini-3.8-flash', 'gemini-3.8-pro'];
      var ai_thinking = 'medium';
      var ai_prompt   = '';

      const GEMINI_API_KEY = {#something#};
      if (!GEMINI_API_KEY) {
        window.parent.postMessage({ action: "triggerSubmit{#rqm#}" }, "*");
        return;
      }

      const rawModels      = {#ai_models#};
      const GEMINI_MODELS  = Array.isArray(rawModels) ? rawModels : [String(rawModels)];
      const THINKING_LEVEL = String({#ai_thinking#} || '').trim().toLowerCase();
      const SYSTEM_PROMPT  = {#ai_prompt#};

      let questionText = '';
      try {
        const content = await stack_js.get_content("qtext{#rqm#}");
        if (content) questionText = content.trim();
      } catch (err) {}

      const userPrompt =
        '=== QUESTION TEXT ===\n' + (questionText || 'Not captured') + '\n\n' +
        '=== TABLE STRUCTURE ===\n' +
        'Nested Group Headers: ' + JSON.stringify(nested) + '\n' +
        'Column Headers: ' + JSON.stringify({#Titles#}) + '\n\n' +
        '=== TEACHER REFERENCE SOLUTION ===\n' +
        JSON.stringify({#data#}) + '\n' +
        'Final Teacher Answer (`ta`): ' + JSON.stringify("{#ta#}") + '\n\n' +
        '=== STUDENT TABLE (Formulas) ===\n' +
        JSON.stringify(studentFormulas) + '\n\n' +
        '=== STUDENT TABLE (Calculated) ===\n' +
        JSON.stringify(studentEvaluated);

      const genConfig = { temperature: 0.2, maxOutputTokens: 2048 };
      if (THINKING_LEVEL && THINKING_LEVEL !== 'default' && THINKING_LEVEL !== 'none') {
        genConfig.thinkingConfig = { thinkingLevel: THINKING_LEVEL };
      }

      const payload = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: genConfig
      };

      let finalReply = '';

      for (let m = 0; m < GEMINI_MODELS.length; m++) {
        const modelName = GEMINI_MODELS[m];
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
                    modelName + ':generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);

        const maxRetries = 2;
        let success = false;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const resp = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const resData = await resp.json();

            if (!resp.ok) {
              const errMsg = (resData.error && resData.error.message) ? resData.error.message : ('HTTP ' + resp.status);
              const isBusy = resp.status === 503 || resp.status === 429 || /busy|overloaded|unavailable/i.test(errMsg);
              
              if (isBusy && attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1200));
                continue;
              }
              break; // Try next model
            }

            const parts = (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts) || [];
            const textPart = parts.find(p => !p.thought && p.text) || parts[0];
            finalReply = textPart ? textPart.text : 'לא התקבלה תשובה מה-AI.';
            success = true;
            break;

          } catch (err) {
            console.warn("API Error:", err);
          }
        }
        if (success) break;
      }

      if (!finalReply) {
        finalReply = 'מערכת ה-AI עמוסה כרגע. התשובה הוגשה ללא משוב אוטומטי.';
      }

      // 3. Save the AI feedback into the hidden ans3 STACK input
      if (aiInput) {
        aiInput.value = finalReply;
        aiInput.dispatchEvent(new Event('change'));
      }
      
      // Save a backup in case Moodle drops the string
      localStorage.setItem(backupCacheKey, finalReply);

      // 4. WAIT 500ms for STACK to sync the input to Moodle before submitting!
      setTimeout(function() {
        window.parent.postMessage({ action: "triggerSubmit{#rqm#}" }, "*");
      }, 500);
    };
  })();
  // ── AI SUBMISSION END ───────────────────────────────────

});
[[/script]]
</div>
    
[[/iframe]]
