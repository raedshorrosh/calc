[[iframe]]
 <script src="https://bossanova.uk/jspreadsheet/v5/jspreadsheet.js"></script>
<script src="https://jsuites.net/v5/jsuites.js"></script>
<link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v5/jspreadsheet.css" type="text/css" />
<link rel="stylesheet" href="https://jsuites.net/v5/jsuites.css" type="text/css" />
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]

 <p style=display:none>`x^2`,`x/y`, \(\small C_6H_{12}O_{6(s)}\)</p>
  <div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
   <div id="spreadsheet" dir="ltr" >
    <div id="myView" style="display:none;" ></div>
 </div>
 <script>
  //function for the table 
   var S=function(value,n){return value.toExponential(n)};
</script>
 
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
 stack_js.request_access_to_input("ans3", true)
];
Promise.all(promises).then(([idForAns2, idForAns3]) => {
  /* This block only executes once those inputs are ready. */
  var dataInput = document.getElementById(idForAns2);
  var gradeInput = document.getElementById(idForAns3);

 //function for the table 
// var S=function(value,n){return value.toExponential(n)};
  
   
var rqm={#rqm#};
var last=false;
// var board = JXG.JSXGraph.initBoard(divid, {});
var uid_table="table{#rqm#}"
var uid_hint="hint{#rqm#}"
var uid_feedback="feedback{#rqm#}"
var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
     tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);
//try {tmp= document.getElementById("feedback"); tmp.setAttribute("id",uid_feedback);}catch(err) {};

var readonly=false;

var container = document.createElement('div');
//container.style.position = 'absolute';
//container.style.left = '-9999px';
container.style.display='none';
// Attach the container to the document body
document.body.appendChild(container);

// Initialize the jspreadsheet table in the container
var teacherTable = jspreadsheet(container, {
  data: ({#data#})
});

var data={#hintdata#};

var cellsToGrade = [];

const mrgd={#merged#};
var merged;
 if (mrgd === undefined) {
      merged = {}
    } else {
      merged = JSON.parse(mrgd.replace(/'/g, '"'))
    };

var nested, nested2,nested3;
const nst = {#nested#};
    if (nst === undefined) {
      nested = [];
      nested2 = [];
    } else {
      nested = JSON.parse(nst.replace(/'/g, '"'));
      nested2 = JSON.parse(nst.replace(/'/g, '"'));
      nested3 = JSON.parse(nst.replace(/'/g, '"'));
      // Double the colspan values, excluding the first object
      for (let i = 1; i < nested2.length; i++) { if (nested2[i].colspan) {  nested2[i].colspan *= 2};  }
         };

// Iterate through each row in the data
for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
  const rowData = data[rowIndex];

  // Iterate through each element in the row
  for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
    // Check if the current element starts with "?,"
    if (rowData[colIndex].startsWith("?,")) {
      // Extract the grade value
      const agrade = rowData[colIndex].substring(2);

      // Replace the current element with "?"
      if ({#design#}!==1) { data[rowIndex][colIndex] = "?"};

      // Store the position and grade in the new array
      cellsToGrade.push({ row: rowIndex, col: colIndex, theGrade: agrade });
    }
  }
};
dataInput.dispatchEvent(new Event('change'));
if (dataInput.value!='') {data = JSON.parse(dataInput.value);dataInput.dispatchEvent(new Event('change'));}   
                    else {dataInput.value=JSON.stringify(data);dataInput.dispatchEvent(new Event('change')); };
  
//gradeInput.value='';
var widths=[150,100,100];
for (let i=3;i<{#Titles#}.length;i++){widths[i]=100};
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
var observer;
var table=jspreadsheet(document.getElementById(uid_table), {
  data:data,
  wordWrap:true,
  colHeaders:{#Titles#},
  colWidths: widths,
  allowManualInsertColumn:0,             
  allowInsertColumn:1,
  allowDeleteColumn:0,
  allowManualInsertRow:{#design#}==1?1:0,             
  allowInsertRow:{#design#}==1?1:0,
  allowDeleteRow:{#design#}==1?1:0,              
            
    columns: [
        { type: 'dropdown',   source:{#items#},readOnly:{#design#}==1?0:1,stripHTML:false },
        { type: 'dropdown',   source:{#units#},readOnly:0,stripHTML:false  },
        { type: 'text',   wordWrap:true,readOnly:0,stripHTML:false},                                      
     
     ],
nestedHeaders:nested, 
 mergeCells:merged,
                 
  toolbar:toolbar,
  updateTable: function (instance, cell, col, row, val, label, cellName) {
   var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
   if (isAttemptMode && readonly) cell.classList.add('readonly');                                    
  dataInput.value=JSON.stringify(instance.jspreadsheet.getData());dataInput.dispatchEvent(new Event('change'));
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    },    
  columnSorting:false,
});
 table.refresh();
// Trigger MathJax to process the page again
//MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 
table.onafterchange = function (instance, cell, x, y, value) {
  if (readonly) {
    cell.classList.add('readonly');
  }
};
   
 
// Define a function to observe changes in the table container
function observeTableChanges() {
  var targetNode = document.getElementById(uid_table);

  // Callback function to be executed when changes are observed
  var callback = function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // The DOM structure changed, trigger prepareGrade function
        prepareGrade();
      }
    }
  };

  // Create an observer instance linked to the callback function
  observer = new MutationObserver(callback);

  // Options for the observer (attributes, childList, subtree)
  var config = { childList: true, subtree: true };

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

// Call the function to start observing changes
observeTableChanges();
                  
var prepareGrade=function(){
 var mark;
 var studentsGrade=0, totalGrades=0; 
 const studentData = table.getData();
 const teacherData = teacherTable.getData();
cellsToGrade.forEach(({ row, col,theGrade }) => {
    totalGrades=totalGrades+parseFloat(theGrade);
    const studentCellIdent = jspreadsheet.getColumnName(col) + (row+1);
    const studentCell = table.getCell(studentCellIdent);
    const studentValue = studentCell ? studentCell.innerHTML.trim() : '';

    const teacherCellIdent = jspreadsheet.getColumnName(col) + (row+1); // No adjustment needed here
    const teacherCell = teacherTable.getCell(teacherCellIdent);
    const teacherValue = teacherCell ? teacherCell.innerHTML.trim() : '';

    // Check if either student or teacher cells are not empty
   if (studentValue !== '' || teacherValue !== '') {
   if (studentValue == 0 && teacherValue == 0) {mark=true}
  else {
  const absoluteDifference = Math.abs(parseFloat(studentValue) - parseFloat(teacherValue));
  const ratio = absoluteDifference / Math.abs(parseFloat(teacherValue));
  mark = ratio <= {#relativeErr#} ? true: false;
}

    if (mark){studentsGrade= studentsGrade+parseFloat(theGrade)};
    }
});
   studentsGrade= studentsGrade/totalGrades;
   const tt=[studentsGrade];
    gradeInput.value=JSON.stringify(tt);
    gradeInput.dispatchEvent(new Event('change'));
   
  
};
                
var checkAnswer= function() {
 observer.disconnect();
// Get the data as a nested array
 var mark;
const data = table.getData();
const columnLength = data[0].length;  // Assuming the first row has all columns
var columnIndex=3;

   table.refresh();
// Insert columns between existing columns
for (let i = 0; i < columnLength-3; i++) {
    table.insertColumn(1, columnIndex, false,[{title:" ",stripHTML:false}]);  // Insert 1 empty column after the current column
    table.options.columns[columnIndex+1].align ='left';
     table.options.columns[columnIndex+1].width =30;
 columnIndex=columnIndex+2;
 
};
 
 var settings = table.getConfig();

// Manipulate the nestedHeaders property in the settings
settings.nestedHeaders = nested2;

// Destroy the table
table.destroy();

// Recreate the table with the updated settings
table = jspreadsheet(document.getElementById(uid_table), settings);

const studentData = table.getData();
const teacherData = teacherTable.getData();
const correct='<span style="font-size: 1em; color:green;">✔</span>';
const wrong='<span style="font-size: 1em; color:red;">❌</span>';   

// Use stored positions for grading
cellsToGrade.forEach(({ row, col,theGrade }) => {
    const studentCellIdent = jspreadsheet.getColumnName(2*col-3) + (row+1);
    const studentCell = table.getCell(studentCellIdent);
    const studentValue = studentCell ? studentCell.innerHTML.trim() : '';

    const teacherCellIdent = jspreadsheet.getColumnName(col) + (row+1); // No adjustment needed here
    const teacherCell = teacherTable.getCell(teacherCellIdent);
    const teacherValue = teacherCell ? teacherCell.innerHTML.trim() : '';

    // Check if either student or teacher cells are not empty
   if (studentValue !== '' || teacherValue !== '') {
    if (studentValue == 0 && teacherValue == 0) {mark=correct}
  else {
  const absoluteDifference = Math.abs(parseFloat(studentValue) - parseFloat(teacherValue));
  const ratio = absoluteDifference / Math.abs(parseFloat(teacherValue));
  mark = ratio <= {#relativeErr#} ? correct: wrong;
}
        // Set the grade value in the grading column of the same row
        const gradeCellIdent = jspreadsheet.getColumnName(2*col-2) + (row+1);
        table.setValue(gradeCellIdent, mark, false);
    }
});
  
    readonly=true;
    table.insertRow();
    table.refresh();
    table.deleteRow();
  };
var answered=false;
stack_js.get_content("content{#rqm#}").then((content) => {
if (content !== null) {
if  (!answered ) 
{
   answered=true;
   checkAnswer();
}}});   
 });
[[/script]]
</div>
    
[[/iframe]]
