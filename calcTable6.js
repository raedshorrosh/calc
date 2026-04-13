[[iframe]]
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
[[comment]] ver 1.13 show hint button works now [[/comment]]
  
 <div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
   <div id="spreadsheet" dir="ltr" ></div>
   <div id="myView" style="display:none;" ></div>
 </div>
   
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

// Default initial resize 
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
  var uid_hint="hint{#rqm#}";
  var uid_feedback="feedback{#rqm#}";
  var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
  tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

  //try {tmp= document.getElementById("feedback"); tmp.setAttribute("id",uid_feedback);}catch(err) {};

  var readonly=false,showHint=(localStorage.getItem("showhint")=={#rqm#}) ;

  var zData=["","","","","","","","","","","","","","",""];

  var data = [zData.slice(0,{#Titles#}.length)];
  if (dataInput.value!=( dataInput.value != '')) {
      data = JSON.parse(dataInput.value);
  } else {
      dataInput.value=JSON.stringify(data);
      dataInput.dispatchEvent(new Event('change'));
  };

  var nested;
  const nst={#nested#};
  if (nst=== undefined) {nested=[]} else  {nested=JSON.parse(nst.replace(/'/g, '"'))};
  
  // =========================================================================
  // CHANGE 1: Set columns 4 and onward to auto-size width AND define them
  // =========================================================================
  var widths=[180,120,120];
  var colsConfig = [
      { type: 'dropdown',   source:{#items#} },
      { type: 'dropdown',   source:{#units#}  },
      { type: 'text',   wordWrap:true  }
  ];

  for (let i=3; i<{#Titles#}.length; i++){
      // jSpreadsheet requires numerical pixel values, not the word 'auto'.
      // Dynamically calculate width based on Title length (approx 10px per character, min 120px)
      var titleLength = {#Titles#}[i] ? String({#Titles#}[i]).length : 12;
      widths[i] = Math.max(120, (titleLength * 10) + 40); 
      
      colsConfig.push({ type: 'text', wordWrap:true }); // Ensure the column exists!
  };
  // =========================================================================

  var toolbar=[
        { type: 'i', content: 'undo', onclick: function() { table.undo(); } },
        { type: 'i', content: 'redo', onclick: function() { table.redo(); } },
        { type: 'select', k: 'font-family', v: ['Arial','Verdana'] },
        { type: 'select', k: 'font-size', v: ['9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px','21px','22px','23px','24px','25px'] },
        { type: 'i', content: 'format_align_left', k: 'text-align', v: 'left' },
        { type: 'i', content: 'format_align_center', k: 'text-align', v: 'center' },
        { type: 'i', content: 'format_align_right', k: 'text-align', v: 'right' },
        { type: 'i', content: 'format_bold', k: 'font-weight', v: 'bold' },
        { type: 'color', content: 'format_color_text', k: 'color' },
        { type: 'color', content: 'format_color_fill', k: 'background-color' },
  ];

  var table=jspreadsheet(document.getElementById(uid_table), {
    data: data,
    colHeaders:{#Titles#},
    colWidths: widths,
    columnResize: true, // Enables double-click column auto-resize and dragging
    allowManualInsertColumn:0,             
    allowInsertColumn:0,
    allowDeleteColumn:0,
    columns: colsConfig,                                     
    nestedHeaders:nested,                                     
    toolbar:toolbar,
    updateTable: function (instance, cell, col, row, val, label, cellName) {
      var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
      if (isAttemptMode && readonly) {cell.classList.add('readonly');}                                    
      dataInput.value=JSON.stringify(instance.jspreadsheet.getData());
      dataInput.dispatchEvent(new Event('change'));
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    },    
    columnSorting:false,
  });
  
  table.refresh();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  
  table.onbeforechange= function(instance, cell, x, y, value){
      if (readonly) {cell.classList.add('readonly')}
  };
  
  var btn = document.createElement("button");  
  var t = document.createTextNode("hint"); 
  btn.appendChild(t);   
  btn.onclick = function(e){
    e.preventDefault(); 
    table.setData({#hintdata#});
  };  
  
  var hint_el= document.getElementById(uid_hint);
  hint_el.appendChild(btn);
  btn.disabled=true; 
            
  if ( ({#hint_enable#}==1) || showHint) {
      hint_el.style.display = "block";
      btn.disabled = false;
  }        

  var answered=false;
  stack_js.get_content("contentCT{#rqm#}").then((content) => {
    if (content !== null) {
      if (!answered) {
        answered=true;
        localStorage.setItem("showhint",{#rqm#});
      }
    }
  });   

  // =========================================================================
  // CHANGE 2: Auto-resize iframe width and height using STACK's native API
  // =========================================================================
  function autoResize() {
      try {
          const tableContainer = document.getElementById(uid_table);
          if (tableContainer && typeof stack_js !== 'undefined') {
              // Get actual DOM content sizes + padding to prevent scrollbars
              const newHeight = document.body.scrollHeight + 20;
              // Ensure we don't shrink smaller than the initial {#width#} provided by STACK
              const newWidth = Math.max({#width#}, tableContainer.scrollWidth + 20);

              // Use STACK's secure API to resize both Width and Height safely!
              stack_js.resize_containing_frame(newWidth, newHeight);
          }
      } catch (e) { 
          console.error("Resize failed: ", e);
      }
  }

  // Initial trigger for resize
  setTimeout(autoResize, 200); // Slight delay ensures jspreadsheet is fully rendered

  // Set up the ResizeObserver to catch ongoing layout changes
  const resizeObserver = new ResizeObserver(() => { autoResize(); });

  // Observe the document body for overall height changes (e.g. dropdowns)
  resizeObserver.observe(document.body);

  // Observe the table container for horizontal width changes
  const tableEl = document.getElementById(uid_table);
  if (tableEl) {
      resizeObserver.observe(tableEl);
  }
  // =========================================================================

});

[[/script]]
</div>
