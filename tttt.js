 [[iframe]]
[[script src="https://rawcdn.githack.com/raedshorrosh/calc/8146613d0a409575be7514c420a69d6e67416f4b/jexcel.js"/]]
[[script src="https://rawcdn.githack.com/raedshorrosh/calc/e2314623eb24ac6307538026626463d67c90e562/jsuites.js"/]]
[[style href="https://rawcdn.githack.com/raedshorrosh/calc/e2314623eb24ac6307538026626463d67c90e562/jsuites.css" type="text/css" /]]
[[style href="https://rawcdn.githack.com/raedshorrosh/calc/3070ff0e73239c4e5cef044d4cb3a84dd4925fa2/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
 <p> ver 1.13</p>
  <p style=display:none>`x^2`,`x/y`, \(\small C_6H_{12}O_{6(s)}\)</p>
 
 <div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
  <div id="myView" style="display:none;" ></div>
  <p></p>
  <div id="spreadsheet" dir="ltr" ></div>
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
 stack_js.request_access_to_input("ans2", true),
 stack_js.request_access_to_input("counter", true)
 
];
Promise.all(promises).then(([idForAns2,idForCounter]) => {
  /* This block only executes once those inputs are ready. */
  var dataInput = document.getElementById(idForAns2);
  var count=document.getElementById(idForCounter);
 count.type='input'; 
  console.log('the counter variable',count);

 //function for the table 
 var S=function(value,n){return value.toExponential(n)};
    

var last=false;
var uid_table={#rqm#};
var uid_hint="hint{#rqm#}"
var uid_feedback="feedback{#rqm#}";
var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
     tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

//try {tmp= document.getElementById("feedback"); tmp.setAttribute("id",uid_feedback);}catch(err) {};

var readonly=false,showHint=false;
//hide or show the fields for design

var zData=["","","","","","","","","","","","","","",""];

var data = [zData.slice(0,{#Titles#}.length)];
if (dataInput.value!=( dataInput.value != '')) {data = JSON.parse(dataInput.value)} else {dataInput.value=JSON.stringify(data);dataInput.dispatchEvent(new Event('change'));};
var nested;
const nst={#nested#};
if (nst=== undefined) {nested=[]} else  {nested=JSON.parse(nst.replace(/'/g, '"'))};
var widths=[180,120,120];


for (let i=3;i!={#Titles#}.length;i++){widths[i]=120};
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
   if (isAttemptMode && readonly) cell.classList.add('readonly');                                    
   dataInput.value=JSON.stringify(instance.jspreadsheet.getData());dataInput.dispatchEvent(new Event('change'));
    },    
  columnSorting:false,
});
   table.refresh();
   MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
table.onbeforechange= function(instance, cell, x, y, value){if (readonly) {cell.classList.add('readonly')}};
/*              
stack_js.get_content("contentCT{#rqm#}").then((content) => {
 console.log(' the content in the span is ',content);
if (content !== null) {
   console.log('count.value before',count.value);
   count.value=JSON.srtingify([3]); count.dispatchEvent(new Event('change'));
     console.log('counter value is now ',count.value);
  
}});  
*/
  //create the hint button
      var btn = document.createElement("button");  //<button> element
      var t = document.createTextNode("hint"); // Create a text node
      btn.appendChild(t);   
      btn.onclick = function(e){
         e.preventDefault(); 
         table.setData({#hintdata#});
      };  

              
   var hint_el = document.getElementById(uid_hint);
   hint_el.appendChild(btn);
   btn.disabled = true;
   try {
     let value = JSON.parse(count.value);
     showHint = (value[0] == 3);
     if (({#hint_enable #} == 1) || showHint) {
       hint_el.style.display = "block";
       btn.disabled = false;
     }
   } catch (err) {
     console.log("nothing in yet");
   }
 });
[[/script]]
</div>
    
[[/iframe]]
