[[iframe]]
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]

<div style="display: flex; justify-content: center; width:100%; font-size:{@fontsize@}">
    <div id="feedback{#rqm#}" dir="ltr">
    </div>
</div>
<script>
  //function for the table 
   var S=function(value,n){return value.toExponential(n)};
</script>

[[script type="module"]]
import {stack_js} from '[[cors src="stackjsiframe.js"/]]';
stack_js.resize_containing_frame("100%", {#height#});
var nested;
const nst={#nested#};
if (nst=== undefined) {nested=[]} else {nested=JSON.parse(nst.replace(/'/g, '"'))};
var widths=[180,120,120];
for (let i=3;i!={#Titles#}.length;i++){widths[i]=120};

var table2=jspreadsheet(document.getElementById("feedback{#rqm#}"), {
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
{ type: 'dropdown', source:{#items#},stripHTML:false},
{ type: 'dropdown', source:{#units#},stripHTML:false },
{ type: 'text', wordWrap:true,stripHTML:false },

],
nestedHeaders:nested,
updateTable: function (instance, cell, col, row, val, label, cellName) {
cell.classList.add('readonly')
},
columnSorting:false,
});

[[/script]]
[[/iframe]]
