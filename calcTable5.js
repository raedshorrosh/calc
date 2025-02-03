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
 });

[[/script]]
</div>
    
[[/iframe]]
    
