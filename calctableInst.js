<script src="https://rawcdn.githack.com/raedshorrosh/calc/8146613d0a409575be7514c420a69d6e67416f4b/jexcel.js"></script>
<link rel="stylesheet" href="https://rawcdn.githack.com/raedshorrosh/calc/3070ff0e73239c4e5cef044d4cb3a84dd4925fa2/jexcel.css" type="text/css" />
<script src="https://rawcdn.githack.com/raedshorrosh/calc/e2314623eb24ac6307538026626463d67c90e562/jsuites.js"></script>
<link rel="stylesheet" href="https://rawcdn.githack.com/raedshorrosh/calc/e2314623eb24ac6307538026626463d67c90e562/jsuites.css" />

 <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Material+Icons" />

 <div style="display:none;">\(x^2\)</div>
 <div style="display: flex; justify-content: center;" width="100%">
   <div id="spreadsheet" dir="ltr" ><div style="display:none;">\(x^2\)</div></div>
 </div>
 <div id="myView" style="display:none;" ></div>
                                 
<script type="text/javascript">
 var checkAnswer=[];
 var prepareGrade=[];
 var S=function(value,n){
     var m=value.toExponential(n);
  return m;   
};
</script>


  <style>
    .jexcel {
    font-size:14 px;
}
 </style>
  

  
   
  <div style="display:none;">\(x^2\)
 [[jsxgraph input-ref-ans2='ans2Ref' input-ref-ans3='ans3Ref' width="0px" height="0px"]]
var rqm={#rqm#};
var last=false;
var board = JXG.JSXGraph.initBoard(divid, {});
var uid_table=board.generateId();
var uid_hint="hint"+board.generateId();
var uid_feedback="feedback"+board.generateId();

var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
     tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);
//try {tmp= document.getElementById("feedback"); tmp.setAttribute("id",uid_feedback);}catch(err) {};

var readonly=false;
//hide or show the fields for design
if ({#design#} == 1) { document.getElementById("data{#rqm#}" ).style.display = "block" }

 var dataInput = document.getElementById(ans2Ref);
 var gradeInput = document.getElementById(ans3Ref);



var data={#hintdata#};

var cellsToGrade = [];

var nested;
const nst={#nested#};
if (nst=== undefined) {nested=[]} else  {nested=JSON.parse(nst.replace(/'/g, '"'))};

// Iterate through each row in the data
for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
  const rowData = data[rowIndex];

  // Iterate through each element in the row
  for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
    // Check if the current element starts with "?"
    if (rowData[colIndex].startsWith("?")) {
      // Extract the grade value
      const agrade = rowData[colIndex].substring(2);

      // Replace the current element with "?"
      if ({#design#}!==1) { data[rowIndex][colIndex] = "?"};

      // Store the position and grade in the new array
      cellsToGrade.push({ row: rowIndex, col: colIndex, theGrade: agrade });
    }
  }
};
if (dataInput.value!=( dataInput.value != '')) {data = JSON.parse(dataInput.value)} else {dataInput.value=JSON.stringify(data)};
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

var table=jspreadsheet(document.getElementById(uid_table), {
  data:data,
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
        { type: 'dropdown',   source:{#units#},readOnly:{#design#}==1?0:1,stripHTML:false  },
        { type: 'text',   wordWrap:true,readOnly:0,stripHTML:false},                                      
     
     ],
nestedHeaders:nested,                                     
                 
  toolbar:toolbar,
  updateTable: function (instance, cell, col, row, val, label, cellName) {
   var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
   if (isAttemptMode && readonly) cell.classList.add('readonly');                                    
   dataInput.value=JSON.stringify(instance.jspreadsheet.getData());
    },    
  columnSorting:false,
});

table.onbeforechange= function(instance, cell, x, y, value){if (readonly) {cell.classList.add('readonly')}; prepareGrade[{#rqm#}]();};
  
      var btn = document.createElement("BUTTON");  //<button> element
      var t = document.createTextNode("finish"); // Create a text node
      btn.appendChild(t);   
      
   var hint_el= document.getElementById(uid_hint);
       hint_el.appendChild(btn);
       hint_el.style.display = "block";    
 
         btn.onclick = function(e){
         e.preventDefault(); 
         prepareGrade[{#rqm#}]();
   //    hint_el.style.display = "none";
      };  
 
    
prepareGrade[rqm]=function(){
 var studentsGrade=0, totalGrades=0; 
 var container = document.createElement('div');
container.style.position = 'absolute';
container.style.left = '-9999px';

// Attach the container to the document body
document.body.appendChild(container);

// Initialize the jspreadsheet table in the container
var teacherTable = jspreadsheet(container, {
  data: ({#data#})
});
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
        const mark =
  Math.abs(parseFloat(studentValue) - parseFloat(teacherValue)) /
  Math.abs(parseFloat(teacherValue)) <= {#relativeErr#}    ? true: false;
  if (mark){studentsGrade= studentsGrade+parseFloat(theGrade)};
    }
});
   studentsGrade= studentsGrade/totalGrades;
   const tt=[studentsGrade];
    gradeInput.value=JSON.stringify(tt);
    gradeInput.dispatchEvent(new Event('change'));
   
  
};
                
checkAnswer[rqm] = function(hint,islast) {
// Get the data as a nested array
const data = table.getData();
const columnLength = data[0].length;  // Assuming the first row has all columns
var columnIndex=3;
// Insert columns between existing columns
for (let i = 0; i < columnLength-3; i++) {
    table.insertColumn(1, columnIndex, false,[{title:" ",stripHTML:false}]);  // Insert 1 empty column after the current column
    table.options.columns[columnIndex+1].align ='left';
 columnIndex=columnIndex+2;
 
}
 

var container = document.createElement('div');
container.style.position = 'absolute';
container.style.left = '-9999px';

// Attach the container to the document body
document.body.appendChild(container);

// Initialize the jspreadsheet table in the container
var teacherTable = jspreadsheet(container, {
  data: ({#data#})
});
const studentData = table.getData();
const teacherData = teacherTable.getData();
const correct='<span style="font-size: 1em; color:green;"><i class="fa fa-check"></i></span>';
const wrong='<span style="font-size: 1em; color:red;"><i class="fa fa-times"></i></span>';   

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
        const mark =
  Math.abs(parseFloat(studentValue) - parseFloat(teacherValue)) /
  Math.abs(parseFloat(teacherValue)) <= {#relativeErr#}    ? correct  : wrong;
        // Set the grade value in the grading column of the same row
        const gradeCellIdent = jspreadsheet.getColumnName(2*col-2) + (row+1);
        table.setValue(gradeCellIdent, mark, false);
    }
});
  
    readonly=true;
    table.insertRow();
     table.refresh();
    if (hint) localStorage.setItem("showhint",{#rqm#});
    if (islast)  localStorage.setItem("final",{#rqm#}); 
    if (localStorage.getItem("final")=={#rqm#}) try {
     tmp= document.getElementById("feedback{#rqm#}"); tmp.setAttribute("id",uid_feedback);
    var table2=jspreadsheet(document.getElementById(uid_feedback), {
     data:({#data#}),
     colHeaders:{#Titles#},
     colWidths: widths,
     allowManualInsertColumn:0,             
     allowInsertColumn:0,
     allowDeleteColumn:0,
     allowManualInsertRow:0,             
     allowInsertRow:0,
     allowDeleteRow:0,
          
     columns: [
         { type: 'dropdown',   source:{#items#}},
        { type: 'dropdown',   source:{#units#} },
        { type: 'text',   wordWrap:true  },
          
     ],
     nestedHeaders:nested,                                     
         toolbar:toolbar,
    updateTable: function (instance, cell, col, row, val, label, cellName) {
        cell.classList.add('readonly')
    }, 
    columnSorting:false,
});
  
}        
  catch(err) {};
table.deleteRow();
   
  };

                                   
[[/jsxgraph]]

</div>


  
