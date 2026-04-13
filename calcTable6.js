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
</style>
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
[[comment]] ver 1.21 FIXED: Aggressive resize with multiple observers & dropdown patching [[/comment]]
  
 <!-- Added id="content-wrapper" and increased padding-bottom to 220px to ensure dropdowns always have space to drop DOWN -->
 <div id="content-wrapper" style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}; padding-bottom: 220px; box-sizing: border-box;">
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
   
   // CRITICAL FIX: Trigger resize after any table update (row add, cell edit, etc.)
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
    // CRITICAL FIX: Resize after hint data loads
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
 // CRITICAL FIX: Enhanced iframe resizing with multiple observers
 // ============================================================
 
 // Define the resize function globally so updateTable can call it
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
         ) + 50; // Extra padding for dropdowns
         
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
     // Also observe the spreadsheet element
     const spreadsheetElement = document.getElementById(uid_table);
     if (spreadsheetElement) {
         resizeObserver.observe(spreadsheetElement);
     }
 }

 // 2. MutationObserver on the ENTIRE document.body to catch jSuites/dropdown events 
 // and row injections that ResizeObserver often misses.
 const mutationObserver = new MutationObserver(window.updateFrameSize);
 mutationObserver.observe(document.body, { 
     childList: true, 
     subtree: true, 
     attributes: true,
     attributeFilter: ['class', 'style', 'height', 'display'] 
 });
 
 // 3. Aggressively catch user interactions just in case DOM observers lag
 document.addEventListener('click', function() { setTimeout(window.updateFrameSize, 50); });
 document.addEventListener('keyup', function() { setTimeout(window.updateFrameSize, 50); });
 
 // 4. Patch jSuites dropdown to trigger resize when opened (critical for dropdown visibility)
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
 
 // 5. Fire multiple times after initial load to ensure proper sizing
 setTimeout(window.updateFrameSize, 100);
 setTimeout(window.updateFrameSize, 300);
 setTimeout(window.updateFrameSize, 600);
 
 // Also resize after MathJax completes
 if (typeof MathJax !== 'undefined') {
     MathJax.Hub.Register.StartupHook("End", window.updateFrameSize);
 }
});

[[/script]]
    
[[/iframe]]
