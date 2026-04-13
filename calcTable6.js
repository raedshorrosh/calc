[[iframe]]
<style>
    html, body {
        overflow: hidden !important; 
        margin: 0;
        padding: 0;
        height: auto !important;
        min-height: 100%;
    }
    
    .jexcel-content {
        max-height: none !important;
        overflow: visible !important;
    }
    
    .jexcel {
        overflow: visible !important;
    }
    
    .control-buttons {
        margin: 10px 0;
        padding: 10px;
        background: #f0f0f0;
        border-radius: 5px;
        text-align: center;
    }
    
    .add-row-btn {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin: 0 5px;
    }
    
    .add-row-btn:hover {
        background-color: #218838;
    }
    
    .hint-btn {
        background-color: #4a6fa5;
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin: 0 5px;
    }
    
    .hint-btn:hover {
        background-color: #2c4c7c;
    }
</style>
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]

<div id="content-wrapper" style="display: flex; flex-direction: column; align-items: center; width:100%; font-size:{@fontsize@}; padding-bottom: 300px; box-sizing: border-box;">
   <!-- Visible control buttons at the top -->
   <div class="control-buttons">
       <button id="addRowButton" class="add-row-btn">➕ Add New Row</button>
       <button id="hintButton" class="hint-btn">📘 Show Hint</button>
   </div>
   <div id="spreadsheet" dir="ltr" style="width: 100%;"></div>
   <div id="myView" style="display:none;"></div>
</div>
   
[[script type="module"]]

MathJax.Hub.Config({
  jax: ['input/AsciiMath'],
  extensions: ['asciimath2jax.js']
});

MathJax.Hub.Config({
  asciimath2jax: {
    delimiters: [['`', '`']]
  }
});

import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
stack_js.resize_containing_frame({#width#}, {#height#}); 

var promises = [
 stack_js.request_access_to_input("ans2", true)
];

Promise.all(promises).then(([idForAns2]) => {
  var dataInput = document.getElementById(idForAns2);
  
var uid_table={#rqm#};
var uid_hint="hint{#rqm#}"
var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

var readonly=false,showHint=(localStorage.getItem("showhint")=={#rqm#}) ;

var zData=["","","","","","","","","","","","","","",""];

var data = [zData.slice(0,{#Titles#}.length)];
if (dataInput.value && dataInput.value != '[]') {data = JSON.parse(dataInput.value)} else {dataInput.value=JSON.stringify(data);dataInput.dispatchEvent(new Event('change'));};

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

// Simple resize function
function resizeIframe() {
    setTimeout(function() {
        try {
            var wrapper = document.getElementById('content-wrapper');
            var newHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                wrapper ? wrapper.scrollHeight : 0,
                document.body.offsetHeight + 100
            ) + 100;
            stack_js.resize_containing_frame({#width#}, newHeight);
        } catch(e) {}
    }, 20);
}

var table=jspreadsheet(document.getElementById(uid_table), {
  data: data,
  colHeaders:{#Titles#},
  colWidths: widths,
  allowManualInsertColumn:1,  // Allow users to insert columns manually
  allowInsertColumn:0,
  allowDeleteColumn:0,
  allowManualInsertRow:1,      // Allow users to insert rows manually
  allowInsertRow:1,            // Enable row insertion
  allowDeleteRow:1,
            
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
   dataInput.value=JSON.stringify(instance.jspreadsheet.getData());
   dataInput.dispatchEvent(new Event('change'));
   MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
   resizeIframe();  // Resize on every table update
  },    
  columnSorting:false,
  oninsertrow: function() {
      resizeIframe();  // Direct row insertion callback
      setTimeout(resizeIframe, 100);
  },
  ondeleterow: function() {
      resizeIframe();
  }
});

table.refresh();
MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

// Add Row button functionality - VISIBLE at top
var addRowBtn = document.getElementById('addRowButton');
if (addRowBtn) {
    addRowBtn.onclick = function() {
        var currentData = table.jspreadsheet.getData();
        var newRow = [];
        for (var i = 0; i < {#Titles#}.length; i++) {
            newRow.push("");
        }
        currentData.push(newRow);
        table.jspreadsheet.setData(currentData);
        resizeIframe();
        setTimeout(resizeIframe, 50);
        setTimeout(resizeIframe, 150);
    };
}

// Hint button functionality
var hintBtn = document.getElementById('hintButton');
if (hintBtn) {
    hintBtn.onclick = function(e) {
        e.preventDefault();
        try {
            var hintData = {#hintdata#};
            table.setData(hintData);
            setTimeout(resizeIframe, 50);
            setTimeout(resizeIframe, 200);
        } catch(err) {}
    };
    
    if (({#hint_enable#}==1) || showHint) {
        hintBtn.style.display = "inline-block";
    } else {
        hintBtn.style.display = "none";
    }
}

// Monitor for any height changes
var lastHeight = 0;
setInterval(function() {
    var currentHeight = document.getElementById(uid_table) ? document.getElementById(uid_table).offsetHeight : 0;
    if (currentHeight !== lastHeight) {
        lastHeight = currentHeight;
        resizeIframe();
    }
}, 300);

// Initial resize calls
resizeIframe();
setTimeout(resizeIframe, 200);
setTimeout(resizeIframe, 500);
setTimeout(resizeIframe, 1000);

});

[[/script]]
    
[[/iframe]]
