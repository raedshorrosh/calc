[[iframe]]
<style>
    /* Permanently ban the browser from generating internal scrollbars */
    html, body {
        overflow: hidden !important; 
        margin: 0;
        padding: 0;
        height: auto !important;
        min-height: 100%;
    }
    
    /* Force jSpreadsheet to physically expand vertically instead of scrolling internally.
       This guarantees the iframe's scrollHeight increases when rows are added. */
    .jexcel-content {
        max-height: none !important;
        overflow: visible !important;
    }
    
    /* Ensure spreadsheet container can grow */
    .jexcel {
        overflow: visible !important;
    }
    
    /* Make sure the table body can expand */
    .jexcel tbody {
        display: table-row-group;
    }
</style>
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
[[comment]] ver 1.22 FIXED: Detects row insertions via MutationObserver on tbody [[/comment]]
  
 <!-- Added id="content-wrapper" and increased padding-bottom to 250px to ensure dropdowns always have space to drop DOWN -->
 <div id="content-wrapper" style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}; padding-bottom: 250px; box-sizing: border-box;">
   <div id="spreadsheet" dir="ltr" ></div>
   <div id="myView" style="display:none; margin-left: 10px;" ></div>
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
        { type: 'i', content: 'undo', onclick: function() { table.undo(); } },
        { type: 'i', content: 'redo', onclick: function() { table.redo(); } },
        { type: 'select', k: 'font-family', v: ['Arial','Verdana'] },
        { type: 'select', k: 'font-size', v: ['9px','10px','11px','12px','13px','14px','15px','16px','17px','18px','19px','20px','21px','22px','23px','24px','25px'] },
        { type: 'i', content: 'format_align_left', k: 'text-align', v: 'left' },
        { type:'i', content:'format_align_center', k:'text-align', v:'center' },
        { type: 'i', content: 'format_align_right', k: 'text-align', v: 'right' },
        { type: 'i', content: 'format_bold', k: 'font-weight', v: 'bold' },
        { type: 'color', content: 'format_color_text', k: 'color' },
        { type: 'color', content: 'format_color_fill', k: 'background-color' },
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
   
   // Trigger resize after any table update
   if (typeof updateFrameSize === 'function') { updateFrameSize(); }
  },    
  columnSorting:false,
});

table.refresh();
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
table.onbeforechange= function(instance, cell, x, y, value){if (readonly) {cell.classList.add('readonly')}};

var btn = document.createElement("button"); 
var t = document.createTextNode("hint"); 
btn.appendChild(t);   
btn.onclick = function(e){
    e.preventDefault(); 
    table.setData({#hintdata#});
    // Trigger resize after hint data loads
    setTimeout(function() { if (typeof updateFrameSize === 'function') { updateFrameSize(); } }, 50);
};  

var hint_el= document.getElementById(uid_hint);
hint_el.appendChild(btn);
btn.disabled=true; 
            
if ( ({#hint_enable#}==1) || showHint) {hint_el.style.display = "block";btn.disabled = false;}        

var answered=false;
stack_js.get_content("contentCT{#rqm#}").then((content) => {
    if (content !== null) {
        if (!answered ) {
            answered=true;
            localStorage.setItem("showhint",{#rqm#});
        }
    }
});   

 // ============================================================
 // CRITICAL FIX: Detect ROW INSERTIONS via MutationObserver on tbody
 // ============================================================
 
 // Define the resize function globally
 window.updateFrameSize = function() {
     try {
         // Calculate absolute required height based on multiple sources
         const wrapper = document.getElementById('content-wrapper');
         const newHeight = Math.max(
             document.body.scrollHeight, 
             document.documentElement.scrollHeight,
             wrapper ? wrapper.scrollHeight : 0,
             wrapper ? wrapper.offsetHeight : 0,
             document.body.offsetHeight + 100
         ) + 80; // Extra padding for dropdowns
         
         // Keep the width locked to the STACK variable {#width#}
         stack_js.resize_containing_frame({#width#}, newHeight);
     } catch (e) {}
 };

 // 1. ResizeObserver for layout dimension shifts
 if (typeof ResizeObserver !== 'undefined') {
     const resizeObserver = new ResizeObserver(window.updateFrameSize);
     resizeObserver.observe(document.body);
     const wrapperContainer = document.getElementById('content-wrapper');
     if (wrapperContainer) {
         resizeObserver.observe(wrapperContainer);
     }
     const spreadsheetElement = document.getElementById(uid_table);
     if (spreadsheetElement) {
         resizeObserver.observe(spreadsheetElement);
     }
 }

 // 2. CRITICAL: MutationObserver specifically watching for ROW ADDITIONS in the table body
 // This is the key fix - detecting when jExcel adds new rows to the DOM
 const setupRowDetection = function() {
     const tableElement = document.getElementById(uid_table);
     if (tableElement) {
         const tbody = tableElement.querySelector('tbody');
         if (tbody) {
             const rowObserver = new MutationObserver(function(mutations) {
                 let rowsAdded = false;
                 mutations.forEach(function(mutation) {
                     if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                         rowsAdded = true;
                     }
                 });
                 if (rowsAdded) {
                     // Rows were added - trigger resize immediately and then again after render
                     window.updateFrameSize();
                     setTimeout(window.updateFrameSize, 50);
                     setTimeout(window.updateFrameSize, 150);
                 }
             });
             rowObserver.observe(tbody, { childList: true, subtree: false });
         }
     }
 };

 // 3. General MutationObserver for all DOM changes
 const mutationObserver = new MutationObserver(function(mutations) {
     let needsResize = false;
     for (const mut of mutations) {
         // Check for row additions or significant DOM changes
         if (mut.type === 'childList' && mut.addedNodes.length > 0) {
             needsResize = true;
             break;
         }
         if (mut.type === 'attributes' && (mut.attributeName === 'style' || mut.attributeName === 'class')) {
             needsResize = true;
             break;
         }
     }
     if (needsResize) {
         window.updateFrameSize();
     }
 });
 mutationObserver.observe(document.body, { 
     childList: true, 
     subtree: true, 
     attributes: true,
     attributeFilter: ['class', 'style', 'height'] 
 });
 
 // 4. User interaction events
 document.addEventListener('click', function() { setTimeout(window.updateFrameSize, 50); });
 document.addEventListener('keyup', function() { setTimeout(window.updateFrameSize, 50); });
 
 // 5. Patch jSuites dropdown to trigger resize when opened
 if (typeof jSuites !== 'undefined' && jSuites.dropdown) {
     const originalDropdown = jSuites.dropdown;
     jSuites.dropdown = function(el, options) {
         const instance = originalDropdown(el, options);
         if (instance && instance.open) {
             const originalOpen = instance.open;
             instance.open = function() {
                 const result = originalOpen.apply(this, arguments);
                 setTimeout(window.updateFrameSize, 60);
                 return result;
             };
         }
         return instance;
     };
 }
 
 // 6. Monitor for context menu row insertion (right-click -> insert row)
 document.addEventListener('contextmenu', function() {
     setTimeout(window.updateFrameSize, 100);
 });
 
 // 7. Set up row detection after a short delay to ensure table is rendered
 setTimeout(setupRowDetection, 200);
 
 // 8. Also monitor for changes to the table's data length via periodic check (fallback)
 let lastRowCount = 0;
 setInterval(function() {
     const tableElement = document.getElementById(uid_table);
     if (tableElement) {
         const rows = tableElement.querySelectorAll('tbody tr').length;
         if (rows !== lastRowCount) {
             lastRowCount = rows;
             window.updateFrameSize();
             setTimeout(window.updateFrameSize, 100);
         }
     }
 }, 500);
 
 // 9. Fire multiple times after initial load
 setTimeout(window.updateFrameSize, 100);
 setTimeout(window.updateFrameSize, 300);
 setTimeout(window.updateFrameSize, 600);
 setTimeout(window.updateFrameSize, 1000);
 
 // 10. Resize after MathJax completes
 if (typeof MathJax !== 'undefined') {
     MathJax.Hub.Register.StartupHook("End", window.updateFrameSize);
 }
 
 // 11. Add a visible "Add Row" button for testing (this will be removed in production if not wanted)
 // This demonstrates that the resize works when adding rows
 const addRowBtn = document.createElement("button");
 addRowBtn.innerHTML = "+ Add Row";
 addRowBtn.style.marginTop = "15px";
 addRowBtn.style.padding = "8px 16px";
 addRowBtn.style.backgroundColor = "#4a6fa5";
 addRowBtn.style.color = "white";
 addRowBtn.style.border = "none";
 addRowBtn.style.borderRadius = "4px";
 addRowBtn.style.cursor = "pointer";
 addRowBtn.style.fontSize = "14px";
 addRowBtn.onclick = function() {
     // Add a new empty row to the spreadsheet
     const currentData = table.jspreadsheet.getData();
     const newRow = [];
     for (let i = 0; i < {#Titles#}.length; i++) {
         newRow.push("");
     }
     currentData.push(newRow);
     table.setData(currentData);
     // Force resize multiple times to ensure iframe expands
     setTimeout(window.updateFrameSize, 10);
     setTimeout(window.updateFrameSize, 50);
     setTimeout(window.updateFrameSize, 150);
 };
 hint_el.appendChild(addRowBtn);
 addRowBtn.style.marginLeft = "10px";
});

[[/script]]
    
[[/iframe]]
