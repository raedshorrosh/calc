<!-- Bridge outside [[iframe]]: Bypasses TinyMCE to (1) restore Hint 2 ID, (2) capture Question Text, (3) check readonly state -->
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

    // 1. Capture Question Text from <thead>
    var qtextEl = document.getElementById("qtext{#rqm#}");
    if (qtextEl) {
      var thead = qBox.querySelector("thead");
      qtextEl.textContent = (thead ? thead.textContent : qBox.textContent).replace(/\s+/g, " ").trim();
    }

    // 2. Check if Moodle locked the question inputs (ans1 / ans2) after submission
    var roEl = document.getElementById("roBridge_{#rqm#}");
    var ansInput = qBox.querySelector("input[name$='_ans1'], input[name$='_ans2']");
    if (roEl && ansInput && (ansInput.readOnly || ansInput.disabled || ansInput.hasAttribute("readonly"))) {
      roEl.textContent = "true";
    }

    // 3. Restore Hint 2 ID if the orange .outcome box contains Hint 2 text
    var outcomeBox = qBox.querySelector(".outcome");
    if (outcomeBox) {
      var html = outcomeBox.innerHTML;
      if (html.indexOf("כפתור" + " hint") !== -1 || html.indexOf("[" + "false]") !== -1) {
        marker.id = "contentCT{#rqm#}";
        marker.textContent = "[false]";
      }
    }
  }

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
[[comment]] ver 1.13 show hint button works now + Auto Gemini on Readonly [[/comment]]
  
 <div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
   <div id="spreadsheet" dir="ltr" ></div>
   <div id="myView" style="display:none;" ></div>
 </div>

 <!-- Container for automatic Gemini AI feedback (hidden while student is editing) -->
 <div id="aiView" dir="rtl" style="display:none; margin-top: 10px; font-family: Arial, sans-serif; width: 100%; text-align: right;"></div>
   
[[script type="module"]]


// Assuming MathJax is already loaded
MathJax.Hub.Config({
  jax: ['input/AsciiMath'],
  extensions: ['asciimath2jax.js']
});

// Optional: Configure delimiters for AsciiMath
MathJax.Hub.Config({
  asciimath2jax: {
    delimiters: [['`', '`']] // Example delimiters
   
  }
});

// Trigger MathJax to process the page again
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

  import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
 stack_js.resize_containing_frame({#width#}, {#height#}); 
var promises = [
 /* These will resolve to identifiers of the input elements once they have been fully built and populated. */
 stack_js.request_access_to_input("ans2", true)
 
];
Promise.all(promises).then(([idForAns2]) => {
  /* This block only executes once those inputs are ready. */
  var dataInput = document.getElementById(idForAns2);
  
 
 //function for the table 
 var S=function(value,n){return value.toExponential(n)};
    

var last=false;
var uid_table={#rqm#};
var uid_hint="hint{#rqm#}"
var uid_feedback="feedback{#rqm#}"
var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
     tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

//try {tmp= document.getElementById("feedback"); tmp.setAttribute("id",uid_feedback);}catch(err) {};

var readonly=false,showHint=(localStorage.getItem("showhint")=={#rqm#}) ;
//hide or show the fields for design

var zData=["","","","","","","","","","","","","","",""];

var data = [zData.slice(0,{#Titles#}.length)];
if (dataInput.value!=( dataInput.value != '')) {data = JSON.parse(dataInput.value)} else {dataInput.value=JSON.stringify(data);dataInput.dispatchEvent(new Event('change'));};

var nested;
const nst={#nested#};
if (nst=== undefined) {nested=[]} else  {nested=JSON.parse(nst.replace(/'/g, '"'))};
var widths=[180,120,120];


for (let i=3;i<{#Titles#}.length;i++){widths[i]=120};
var toolbar=[
        {
            type: 'i',
            content: 'undo',
            onclick: function() {
                table.undo();
            }
        },
        {
            type: 'i',
            content: 'redo',
            onclick: function() {
                table.redo();
            }
        },
       
        {
            type: 'select',
            k: 'font-family',
            v: ['Arial','Verdana']
        },
        {
            type: 'select',
            k: 'font-size',
            v: ['9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px','21px','22px','23px','24px','25px']
        },
        {
            type: 'i',
            content: 'format_align_left',
            k: 'text-align',
            v: 'left'
        },
        {
            type:'i',
            content:'format_align_center',
            k:'text-align',
            v:'center'
        },
        {
            type: 'i',
            content: 'format_align_right', 
            k: 'text-align',
            v: 'right'
        },
        {
            type: 'i',
            content: 'format_bold',
            k: 'font-weight',
            v: 'bold'
        },
        {
            type: 'color',
            content: 'format_color_text',
            k: 'color'
        },
        {
            type: 'color',
            content: 'format_color_fill',
            k: 'background-color'
        },
    ];

var table=jspreadsheet(document.getElementById(uid_table), {
  data: data,
  colHeaders:{#Titles#},
  colWidths: widths,
  allowManualInsertColumn:0,             
  allowInsertColumn:0,
  allowDeleteColumn:0,
            
    columns: [
        { type: 'dropdown',   source:{#items#} },
        { type: 'dropdown',   source:{#units#}  },
        { type: 'text',   wordWrap:true  },                                      
     
     ],
nestedHeaders:nested,                                     
         toolbar:toolbar,
  updateTable: function (instance, cell, col, row, val, label, cellName) {
   var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
   
   if (isAttemptMode && readonly) {cell.classList.add('readonly');}                                    
   dataInput.value=JSON.stringify(instance.jspreadsheet.getData());dataInput.dispatchEvent(new Event('change'));
   MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    },    
  columnSorting:false,
});
   table.refresh();
   MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
table.onbeforechange= function(instance, cell, x, y, value){if (readonly) {cell.classList.add('readonly')}};
      var btn = document.createElement("button");  //<button> element
      var t = document.createTextNode("hint"); // Create a text node
      btn.appendChild(t);   
      btn.onclick = function(e){
         e.preventDefault(); 
         table.setData({#hintdata#});
       
      };  
   var hint_el= document.getElementById(uid_hint);
       hint_el.appendChild(btn);
     btn.disabled=true; 
            
 if ( ({#hint_enable#}==1) || showHint) {hint_el.style.display = "block";btn.disabled = false;}        



 var answered=false;
stack_js.get_content("contentCT{#rqm#}").then((content) => {
if (content !== null) {
if  (!answered ) 
{
 answered=true;
 localStorage.setItem("showhint",{#rqm#});

}}});

  // ── AUTO GEMINI EVALUATION WHEN INPUT IS READONLY ────────────────
  (async function autoRunGeminiOnReadOnly() {
    // 1. Check if dataInput in iframe OR ans1/ans2 on parent page is readonly/disabled
    let isInputReadOnly = Boolean(
      dataInput.readOnly ||
      dataInput.disabled ||
      dataInput.hasAttribute('readonly') ||
      dataInput.hasAttribute('disabled')
    );

    if (!isInputReadOnly) {
      const parentRo = await stack_js.get_content("roBridge_{#rqm#}");
      if (parentRo && parentRo.trim() === "true") {
        isInputReadOnly = true;
      }
    }

    // Only run AI if the student has submitted (input is locked/readonly)
    if (!isInputReadOnly) return;

    const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
    const GEMINI_MODEL   = 'gemini-2.5-flash';
    const GEMINI_URL     = 'https://generativelanguage.googleapis.com/v1beta/models/' +
                           GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(GEMINI_API_KEY);

    const SYSTEM_PROMPT =
      'You are an experienced chemistry teacher evaluating a student stoichiometry calculation table in Hebrew. ' +
      'Notice the spreadsheet columns start at A (A=גודל, B=יחידות, C=הערות, D=4th col, E=5th col, F=6th col, G=7th col, etc.) and rows start at 1. ' +
      'The Teacher Reference Table contains the given numbers and spreadsheet formulas (e.g. =D2*D3). ' +
      'Important: The student does NOT have to include all rows or put rows in the exact same order as the reference table, and may write calculated numbers or formulas. ' +
      'Compare the Student Table against the Teacher Reference Table and Question Text. ' +
      'Reply briefly and constructively in Hebrew: point out any wrong units, wrong mole ratios, or calculation errors without giving away the final numerical answer.';

    // 2. Show the feedback box below the table
    const aiOutput = document.getElementById('aiView');
    aiOutput.id = 'aiView_' + uid_table;
    aiOutput.style.cssText = 'display: block; margin-top: 10px; max-height: 180px; overflow-y: auto; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; white-space: pre-wrap; font-size: 15px; font-family: Arial, sans-serif; text-align: right;';
    aiOutput.textContent = 'בודק את טבלת החישובים באמצעות AI…';

    // Expand iframe height slightly so the AI feedback is visible
    stack_js.resize_containing_frame({#width#}, parseInt({#height#}, 10) + 180 + "px");

    // 3. Get captured Question Text from the parent bridge
    let questionText = '';
    try {
      const content = await stack_js.get_content("qtext{#rqm#}");
      if (content) questionText = content.trim();
    } catch (err) {
      console.warn('Could not read qtext bridge:', err);
    }

    const userPrompt =
      '=== QUESTION TEXT ===\n' + (questionText || 'Not captured') + '\n\n' +
      '=== TABLE STRUCTURE ===\n' +
      'Nested Group Headers: ' + JSON.stringify(nested) + '\n' +
      'Column Headers (Cols A, B, C, D...): ' + JSON.stringify({#Titles#}) + '\n\n' +
      '=== TEACHER REFERENCE SOLUTION (from Maxima `data`) ===\n' +
      JSON.stringify({#data#}) + '\n' +
      'Final Teacher Answer (`ta`): ' + JSON.stringify("{#ta#}") + '\n\n' +
      '=== STUDENT TABLE ===\n' +
      JSON.stringify(table.getData());

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600
      }
    };

    try {
      const resp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await resp.json();

      if (!resp.ok) {
        const errMsg = (resData.error && resData.error.message) ? resData.error.message : ('HTTP ' + resp.status);
        throw new Error(errMsg);
      }

      const replyText =
        resData.candidates &&
        resData.candidates[0] &&
        resData.candidates[0].content &&
        resData.candidates[0].content.parts &&
        resData.candidates[0].content.parts[0]
          ? resData.candidates[0].content.parts[0].text
          : 'לא התקבלה תשובה מה-AI.';

      aiOutput.textContent = replyText;
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, aiOutput]);
    } catch (err) {
      aiOutput.textContent = '⚠ שגיאה בבדיקת ה-AI: ' + err.message;
      console.error('[Gemini Table Eval]', err);
    }
  })();
  // ── AUTO GEMINI EVALUATION END ───────────────────────────────────

 });

[[/script]]
</div>
    
[[/iframe]]