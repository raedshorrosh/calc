[[iframe]]
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.5/lz-string.min.js" /]]

 <p style=display:none>`x^2`,`x/y`, \(\small C_6H_{12}O_{6(s)}\)</p>
 <div id="styleExportBar" style="display:none; direction:ltr; text-align:center; margin-bottom:8px; font-family:Arial, sans-serif; font-size:14px;">
   <label for="tableStyleOutput"><b>tableStyle for Maxima: </b></label>
   <input type="text" id="tableStyleOutput" readonly style="width:450px; padding:3px 6px; font-family:monospace; direction:ltr;" />
   <button type="button" id="btnCopyStyle" style="padding:3px 10px; margin-left:5px; cursor:pointer;">Copy tableStyle</button>
   <span id="copyStyleMsg" style="color:green; font-weight:bold; margin-left:6px; display:none;">✔ Copied!</span>
 </div>
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

// MathJax rendering for the spreadsheet is managed per cell below.
// Avoid repeatedly typesetting the entire page while a cell is being edited.

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

var rqm={#rqm#};
var last=false;
var uid_table="table{#rqm#}"
var uid_hint="hint{#rqm#}"
var uid_feedback="feedback{#rqm#}"
var tmp=document.getElementById("spreadsheet"); tmp.setAttribute("id",uid_table);
     tmp= document.getElementById("myView"); tmp.setAttribute("id",uid_hint);

var readonly=false;

// Visual grading marks live in the same cell, not in spreadsheet data.
// CSS pseudo-elements keep the cell's numeric/text content, MathJax, styles,
// and saved column widths untouched. Limit these rules to this question's table.
var gradingStyleElement = document.createElement('style');
gradingStyleElement.textContent =
    '#' + uid_table + ' td.stack-grade-correct, ' +
    '#' + uid_table + ' td.stack-grade-incorrect {' +
        'position:relative !important;' +
        'padding-right:20px !important;' +
    '}' +
    '#' + uid_table + ' td.stack-grade-correct::after, ' +
    '#' + uid_table + ' td.stack-grade-incorrect::after {' +
        'position:absolute;' +
        'right:3px;' +
        'top:50%;' +
        'transform:translateY(-50%);' +
        'font-size:13px;' +
        'font-weight:bold;' +
        'line-height:1;' +
        'pointer-events:none;' +
        'z-index:1;' +
    '}' +
    '#' + uid_table + ' td.stack-grade-correct::after {' +
        'content:"✔";' +
        'color:green;' +
    '}' +
    '#' + uid_table + ' td.stack-grade-incorrect::after {' +
        'content:"✖";' +
        'color:#c62828;' +
    '}';
document.head.appendChild(gradingStyleElement);

var container = document.createElement('div');
container.style.display='none';
document.body.appendChild(container);

// Initialize the jspreadsheet table in the container
var teacherTable = jspreadsheet(container, {
  data: ({#data#})
});

var data={#hintdata#};

// Special metadata in the existing Maxima tableStyle variable.
// A width belongs to a whole column (not to an individual cell).
var COLUMN_WIDTH_KEY = '__COLWIDTHS__';
var initialColumnWidths = null;
var widthSyncEnabled = false;
var suppressPersistence = false;

// Extract widths before giving the remaining style map to jspreadsheet.setStyle().
function removeWidthMetadata(styleMap) {
    if (!styleMap || !Object.prototype.hasOwnProperty.call(styleMap, COLUMN_WIDTH_KEY)) {
        return null;
    }
    var rawWidths = styleMap[COLUMN_WIDTH_KEY];
    delete styleMap[COLUMN_WIDTH_KEY];
    var values = Array.isArray(rawWidths) ? rawWidths : String(rawWidths).split(',');
    var result = values.map(function(value) { return Math.round(Number(value)); });
    return result.length && result.every(function(w) { return Number.isFinite(w) && w >= 30 && w <= 3000; })
        ? result : null;
}

// Compression is used ONLY for the exported/imported Maxima tableStyle.
// Old plain tableStyle values remain valid, and ans2 stays uncompressed.
var TABLE_STYLE_ENCODING_PREFIX = 'LZ1:';
function encodeTableStyleForMaxima(rawStyle) {
    if (typeof LZString === 'undefined' ||
        typeof LZString.compressToEncodedURIComponent !== 'function') {
        console.error('LZ-String did not load; exporting tableStyle uncompressed.');
        return rawStyle;
    }
    var encoded = LZString.compressToEncodedURIComponent(rawStyle);
    if (!encoded || LZString.decompressFromEncodedURIComponent(encoded) !== rawStyle) {
        console.error('tableStyle compression verification failed; exporting uncompressed.');
        return rawStyle;
    }
    return TABLE_STYLE_ENCODING_PREFIX + encoded;
}

function decodeTableStyleFromMaxima(value) {
    if (typeof value !== 'string' || !value.startsWith(TABLE_STYLE_ENCODING_PREFIX)) {
        return value; // Backward-compatible uncompressed tableStyle.
    }
    if (typeof LZString === 'undefined' ||
        typeof LZString.decompressFromEncodedURIComponent !== 'function') {
        throw new Error('Cannot load compressed tableStyle: LZ-String did not load.');
    }
    var decoded = LZString.decompressFromEncodedURIComponent(
        value.slice(TABLE_STYLE_ENCODING_PREFIX.length)
    );
    if (!decoded) throw new Error('Compressed tableStyle is invalid or empty.');
    return decoded;
}

// Load separate tableStyle variable from Maxima (backward-compatible if undefined in old questions)
var tableStyle;
const tblStl = {#tableStyle#};
var initialStyle = {};
if (tblStl !== undefined && tblStl !== null && tblStl !== '') {
    try {
        initialStyle = (typeof tblStl === 'string')
            ? JSON.parse(decodeTableStyleFromMaxima(tblStl).replace(/'/g, '"'))
            : tblStl;
    } catch (e) {
        console.warn("Could not parse tableStyle:", e);
    }
}
initialColumnWidths = removeWidthMetadata(initialStyle);

var cellsToGrade = [];
var unitCellsToGrade = [];

// Unit grading: column B only. A plain "?" is worth 1 point;
// "?,0.5" or "?,2" can be used for a different weight per unit cell.
var defaultUnitGradeWeight = 1;
function normalizeUnit(value) {
    return value === null || value === undefined ? '' : String(value).trim();
}
function unitsMatch(studentValue, teacherValue) {
    var expected = normalizeUnit(teacherValue);
    return expected !== '' && normalizeUnit(studentValue) === expected;
}

var merged;
const mrgd={#merged#};
 if (mrgd === undefined) {
      merged = {}
    } else {
      merged = JSON.parse(mrgd.replace(/'/g, '"'))
    };

var nested;
const nst = {#nested#};
if (nst === undefined || nst === null || nst === '') {
    nested = [];
} else {
    nested = JSON.parse(nst.replace(/'/g, '"'));
}

// Add Excel-style column letters above the existing column titles.
// These are presentation headers only, not spreadsheet data.
function createLetterHeaders(count) {
    var headers = [];
    for (var i = 0; i < count; i++) {
        headers.push({
            title: jspreadsheet.getColumnName(i),
            colspan: 1
        });
    }
    return headers;
}

var originalColumnCount = {#Titles#}.length;

// JSpreadsheet requires nestedHeaders as an array of header rows.
// Preserve either an existing single header row or multiple header rows.
nested = [createLetterHeaders(originalColumnCount)].concat(
    nested.length ? (Array.isArray(nested[0]) ? nested : [nested]) : []
);

// Identify graded numeric cells and dropdown units.
// Only cells marked "?" or "?,weight" in column B are graded as units.
// The teacher's unit must be nonempty, so divider/header rows are skipped.
var teacherInitialData = teacherTable.getData();
for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const rowData = data[rowIndex];
    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
        const rawCell = rowData[colIndex];
        if (typeof rawCell !== 'string') continue;

        if (colIndex === 1) {
            var isUnitPlaceholder = rawCell === '?' || /^\?,\s*(?:\d+(?:\.\d+)?|\.\d+)\s*$/.test(rawCell);
            var teacherUnit = teacherInitialData[rowIndex] && teacherInitialData[rowIndex][1];
            if (isUnitPlaceholder && normalizeUnit(teacherUnit) !== '') {
                var unitWeight = rawCell === '?' ? defaultUnitGradeWeight : Number(rawCell.substring(2));
                if (Number.isFinite(unitWeight) && unitWeight > 0) {
                    unitCellsToGrade.push({ row: rowIndex, theGrade: unitWeight });
                }
            }
            if (rawCell.startsWith('?,') && {#design#} !== 1) {
                data[rowIndex][colIndex] = '?';
            }
            continue; // Column B is never treated as a numeric cell.
        }

        if (rawCell.startsWith('?,')) {
            const agrade = Number(rawCell.substring(2));
            if ({#design#} !== 1) data[rowIndex][colIndex] = '?';
            if (Number.isFinite(agrade) && agrade > 0) {
                cellsToGrade.push({ row: rowIndex, col: colIndex, theGrade: agrade });
            }
        }
    }
}

// Helper: Extract "__STYLE__" row if saved by student in ans2
function extractStudentDataAndStyle(rawArray) {
    var cleanData = [];
    var extractedStyle = null;
    if (Array.isArray(rawArray)) {
        for (var i = 0; i < rawArray.length; i++) {
            var row = rawArray[i];
            if (Array.isArray(row) && row[0] === "__STYLE__" && typeof row[1] === "string") {
                try {
                    extractedStyle = JSON.parse(row[1].replace(/'/g, '"'));
                } catch (e) {}
            } else {
                cleanData.push(row);
            }
        }
    }
    return { data: cleanData, style: extractedStyle };
}

// Helper: Get non-empty styles from jspreadsheet
function getCleanStyle(jspInstance) {
    if (!jspInstance) return initialStyle;
    var clean = {};
    try {
        var rawStyle = jspInstance.getStyle() || {};
        for (var key in rawStyle) {
            if (rawStyle[key] && rawStyle[key].trim() !== '') {
                clean[key] = rawStyle[key];
            }
        }
    } catch (e) {}
    return clean;
}

// Read current widths (px); this works with the JSpreadsheet CE getWidth API.
function readColumnWidths(jspInstance, count) {
    var result = [];
    for (var i = 0; i < count; i++) {
        var w = NaN;
        if (jspInstance && typeof jspInstance.getWidth === 'function') {
            try { w = parseFloat(jspInstance.getWidth(i)); } catch (e) {}
        }
        if (!Number.isFinite(w) && jspInstance && jspInstance.options) {
            var col = jspInstance.options.columns && jspInstance.options.columns[i];
            w = parseFloat(col && col.width);
            if (!Number.isFinite(w)) {
                w = parseFloat(jspInstance.options.colWidths && jspInstance.options.colWidths[i]);
            }
        }
        if (!Number.isFinite(w)) w = (i < 3 ? [150, 100, 100][i] : 100);
        result.push(Math.round(w));
    }
    return result;
}

// Restore widths through the actual column API, not CSS styles on cells.
function applyColumnWidths(jspInstance, values) {
    if (!jspInstance || !values || typeof jspInstance.setWidth !== 'function') return;
    var enabledBefore = widthSyncEnabled;
    widthSyncEnabled = false;
    try {
        for (var i = 0; i < values.length; i++) {
            var w = Math.round(Number(values[i]));
            if (Number.isFinite(w) && w >= 30 && w <= 3000) {
                jspInstance.setWidth(i, w);
            }
        }
    } finally {
        widthSyncEnabled = enabledBefore;
    }
}

// Helper: Update the Maxima tableStyle box in Design Mode, and update ans2
function syncOutputs(jspInstance) {
    if (suppressPersistence) return;
    var currentData = jspInstance ? jspInstance.getData() : data;
    var currentStyle = jspInstance ? getCleanStyle(jspInstance) : Object.assign({}, initialStyle);
    var columnWidths = jspInstance
        ? readColumnWidths(jspInstance, originalColumnCount)
        : (initialColumnWidths || makeDefaultWidths(originalColumnCount));
    currentStyle[COLUMN_WIDTH_KEY] = columnWidths.join(',');
    var styleStr = JSON.stringify(currentStyle).replace(/"/g, "'");

    if ({#design#} == 1) {
        // In Design Mode: keep ans2 100% pure data (for data / hintdata), and put styles in the tableStyle box!
        dataInput.value = JSON.stringify(currentData);
        dataInput.dispatchEvent(new Event('change'));
        var styleOut = document.getElementById('tableStyleOutput');
        if (styleOut) {
            styleOut.value = 'tableStyle: "' + encodeTableStyleForMaxima(styleStr) + '";';
        }
    } else {
        // In Student Mode: preserve student style changes inside ans2 across reloads
        var out = currentData.slice();
        if (currentStyle && Object.keys(currentStyle).length > 0) {
            out.push(["__STYLE__", styleStr]);
        }
        dataInput.value = JSON.stringify(out);
        dataInput.dispatchEvent(new Event('change'));
    }
}

// Helper: Apply a style map {"D1": "background-color: #...", ...} to the jspreadsheet instance
function applyStylesToTable(jspInstance, styleMap) {
    if (!jspInstance || !styleMap || Object.keys(styleMap).length === 0) return;
    try {
        jspInstance.setStyle(styleMap);
    } catch (e) {
        for (var cellName in styleMap) {
            try {
                var cellEl = jspInstance.getCell(cellName);
                if (cellEl) {
                    cellEl.style.cssText += ';' + styleMap[cellName];
                }
            } catch (err) {}
        }
    }
}

// Restore from ans2 (dataInput) if student/teacher already has saved state
dataInput.dispatchEvent(new Event('change'));
if (dataInput.value !== '') {
    try {
        var parsedInput = extractStudentDataAndStyle(JSON.parse(dataInput.value));
        data = parsedInput.data;
        if (parsedInput.style !== null) {
            initialStyle = parsedInput.style;
            var savedWidths = removeWidthMetadata(initialStyle);
            if (savedWidths) initialColumnWidths = savedWidths;
        }
        dataInput.dispatchEvent(new Event('change'));
    } catch (e) {
        console.warn("Could not parse dataInput:", e);
    }
} else {
    syncOutputs(null);
}
  
function makeDefaultWidths(count) {
    var w = [150, 100, 100];
    for (var i=3; i<count; i++) w[i] = 100;
    return w.slice(0, count);
}
var widths = makeDefaultWidths(originalColumnCount);
if (initialColumnWidths) {
    for (var i=0; i<Math.min(widths.length, initialColumnWidths.length); i++) {
        widths[i] = initialColumnWidths[i];
    }
}
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
// MathJax 2 + JSpreadsheet: render the display, never an active cell editor.
// JSpreadsheet owns the raw cell value, while MathJax owns only its DOM display.
var mathEditBackup = new WeakMap();
var mathEditingCells = new WeakSet();
var mathRenderVersion = new WeakMap();

function hasAsciiMath(value) {
    return typeof value === 'string' && /`[^`]+`/.test(value);
}

function invalidateMathRender(cell) {
    if (!cell) return;
    mathRenderVersion.set(cell, (mathRenderVersion.get(cell) || 0) + 1);
}

function queueCellMathRender(cell, rawValue, forceRebuild) {
    if (!cell || !hasAsciiMath(rawValue)) return;
    invalidateMathRender(cell);
    var version = mathRenderVersion.get(cell);

    MathJax.Hub.Queue(function() {
        if (!cell.isConnected ||
            mathEditingCells.has(cell) ||
            mathRenderVersion.get(cell) !== version ||
            cell.isContentEditable ||
            cell.querySelector('[contenteditable="true"]')) return;

        // Never feed an already-rendered MathJax DOM back to the editor.
        // When closing an editor, discard any old display and start from raw text.
        if (!forceRebuild &&
            cell.querySelector('.MathJax, .MathJax_Preview, script[type^="math/"]')) return;

        if (forceRebuild && typeof MathJax.Hub.getAllJax === 'function') {
            var oldJax = MathJax.Hub.getAllJax(cell) || [];
            for (var i = 0; i < oldJax.length; i++) {
                try { oldJax[i].Remove(); } catch (e) {}
            }
        }
        // textContent deliberately avoids importing MathJax's generated HTML.
        cell.textContent = rawValue;
        return MathJax.Hub.Typeset(cell);
    });
}

var observer;
suppressPersistence = true;
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
  // Persist a manual column resize in the same tableStyle Maxima variable.
  onresizecolumn: function() {
      if (widthSyncEnabled && !suppressPersistence && table) syncOutputs(table);
  },
  updateTable: function (instance, cell, col, row, val, label, cellName) {
   var isAttemptMode = window.location.href.indexOf('attempt.php') !== -1;
   if (isAttemptMode && readonly) cell.classList.add('readonly');                                    
   if (instance.jspreadsheet) {
       syncOutputs(instance.jspreadsheet);
   }
   // Only process the changed cell; never typeset the active editor or page.
   var rawForRender = instance.jspreadsheet && instance.jspreadsheet.getData()
       ? ((instance.jspreadsheet.getData()[row] || [])[col]) : val;
   if (hasAsciiMath(rawForRender)) {
       queueCellMathRender(cell, rawForRender, false);
   }
  },

  // Keep the raw source before editing. The MathJax display is not the value.
  oneditionstart: function(instance, cell, x, y) {
      var currentData = instance.jspreadsheet ? instance.jspreadsheet.getData() : table.getData();
      var raw = currentData && currentData[y] ? currentData[y][x] : null;
      if (hasAsciiMath(raw)) {
          mathEditBackup.set(cell, raw);
          mathEditingCells.add(cell);
          invalidateMathRender(cell);
      }
  },

  // If JSpreadsheet tries to save MathJax's generated HTML as a cell value,
  // protect the original AsciiMath text instead.
  onbeforechange: function(instance, cell, x, y, newValue) {
      var original = mathEditBackup.get(cell);
      if (hasAsciiMath(original) && typeof newValue === 'string' &&
          /(?:class=[\"']?MathJax|math\/asciimath|MathJax_Preview)/.test(newValue)) {
          return original;
      }
      return newValue;
  },

  // In both Enter and click-away cases, reconstruct the display once from
  // JSpreadsheet's raw model value, then typeset that one cell only.
  oneditionend: function(instance, cell, x, y, value, save) {
      var backup = mathEditBackup.get(cell);
      if (!hasAsciiMath(backup)) return;
      invalidateMathRender(cell);
      mathEditingCells.delete(cell);
      mathEditBackup.delete(cell);

      setTimeout(function() {
          if (!cell || !cell.isConnected) return;
          var rows = table.getData();
          var current = rows && rows[y] ? rows[y][x] : null;

          // Recover if the editor committed its rendered HTML rather than text.
          if (typeof current === 'string' &&
              /(?:class=[\"']?MathJax|math\/asciimath|MathJax_Preview)/.test(current)) {
              var coord = jspreadsheet.getColumnName(x) + (y + 1);
              table.setValue(coord, backup, false);
              current = backup;
          }

          if (hasAsciiMath(current)) {
              queueCellMathRender(cell, current, true);
          }
      }, 0);
  },
  columnSorting:false,
});
 table.refresh();

// Initial table typesetting: once, after creation, before user editing.
// Later updates use the per-cell function instead of this table-wide call.
MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById(uid_table)]);

// Apply initial styles AND widths after refresh so they survive reloads.
applyStylesToTable(table, initialStyle);
applyColumnWidths(table, widths);
suppressPersistence = false;
widthSyncEnabled = true;
syncOutputs(table);

// Show the tableStyle export box when in Design Mode (design == 1)
if ({#design#} == 1) {
    var styleBar = document.getElementById('styleExportBar');
    if (styleBar) styleBar.style.display = 'block';
    document.getElementById('btnCopyStyle').addEventListener('click', function() {
        var outInput = document.getElementById('tableStyleOutput');
        outInput.select();
        navigator.clipboard.writeText(outInput.value);
        var msg = document.getElementById('copyStyleMsg');
        msg.style.display = 'inline';
        setTimeout(function() { msg.style.display = 'none'; }, 2000);
    });
}

// Hook into table.setStyle so toolbar color changes immediately update tableStyleOutput / ans2
var origSetStyle = table.setStyle;
table.setStyle = function() {
    var result = origSetStyle.apply(this, arguments);
    syncOutputs(table);
    return result;
};
 
table.onafterchange = function (instance, cell, x, y, value) {
  if (readonly) {
    cell.classList.add('readonly');
  }
  syncOutputs(table);
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
                  
// Use the same numeric comparison for score calculations and review markers.
// The rendered cell text is used intentionally: JSpreadsheet evaluates formulas
// for display while getData() can contain unevaluated formula strings.
function numericCellIsCorrect(row, col, studentValue, teacherValue) {
    if (studentValue === '' && teacherValue === '') return false;

    var studentNumber = parseFloat(studentValue);
    var teacherNumber = parseFloat(teacherValue);

    if (studentNumber === 0 && teacherNumber === 0) return true;
    if (!Number.isFinite(studentNumber) || !Number.isFinite(teacherNumber)) return false;

    var relativeDifference = Math.abs(studentNumber - teacherNumber) /
                             Math.abs(teacherNumber);
    return relativeDifference <= {#relativeErr#};
}

function getNumericCellComparison(row, col) {
    var ref = jspreadsheet.getColumnName(col) + (row + 1);
    var studentCell = table.getCell(ref);
    var teacherCell = teacherTable.getCell(ref);
    return {
        studentCell: studentCell,
        studentValue: studentCell ? studentCell.innerHTML.trim() : '',
        teacherValue: teacherCell ? teacherCell.innerHTML.trim() : ''
    };
}

var prepareGrade = function() {
    if (readonly) return;
    var studentsGrade = 0, totalGrades = 0;
    var studentData = table.getData();
    var teacherData = teacherTable.getData();

    cellsToGrade.forEach(({ row, col, theGrade }) => {
        totalGrades += theGrade;
        var result = getNumericCellComparison(row, col);
        if (numericCellIsCorrect(row, col, result.studentValue, result.teacherValue)) {
            studentsGrade += theGrade;
        }
    });

    // Dropdown units in column B retain their current independent weights.
    unitCellsToGrade.forEach(({ row, theGrade }) => {
        totalGrades += theGrade;
        if (unitsMatch(studentData[row] && studentData[row][1],
                       teacherData[row] && teacherData[row][1])) {
            studentsGrade += theGrade;
        }
    });

    var finalScore = totalGrades > 0 ? studentsGrade / totalGrades : 0;
    gradeInput.value = JSON.stringify([finalScore]);
    gradeInput.dispatchEvent(new Event('change'));
    syncOutputs(table);
};

// Add a review marker by CSS class only. No extra column, HTML content,
// setValue(), or change to the saved answer is needed.
function applyInCellGradeMarker(cell, correct) {
    if (!cell) return;
    cell.classList.remove('stack-grade-correct', 'stack-grade-incorrect');
    cell.classList.add(correct ? 'stack-grade-correct' : 'stack-grade-incorrect');
}

var checkAnswer = function() {
    if (observer) observer.disconnect();
    // Review markers must never be written back to student data / tableStyle.
    suppressPersistence = true;
    widthSyncEnabled = false;
    readonly = true;

    var studentData = table.getData();
    var teacherData = teacherTable.getData();

    // Grade numeric cells in their ORIGINAL column and show feedback there.
    cellsToGrade.forEach(({ row, col }) => {
        var result = getNumericCellComparison(row, col);
        if (!result.studentCell) return;
        // Match the previous behavior: skip when both cells are empty.
        if (result.studentValue === '' && result.teacherValue === '') return;
        applyInCellGradeMarker(result.studentCell,
            numericCellIsCorrect(row, col, result.studentValue, result.teacherValue));
    });

    // Grade units directly in column B (same marker style as numeric cells).
    unitCellsToGrade.forEach(({ row }) => {
        var unitCell = table.getCell('B' + (row + 1));
        if (!unitCell) return;
        applyInCellGradeMarker(unitCell,
            unitsMatch(studentData[row] && studentData[row][1],
                       teacherData[row] && teacherData[row][1]));
    });

    // Lock the existing table without refreshing or rebuilding it.
    // v3 supports the 'readonly' class, used by the original review code.
    // The global editable flag further prevents editing in review mode.
    table.options.editable = false;
    table.options.allowInsertColumn = false;
    table.options.allowInsertRow = false;
    table.options.allowDeleteRow = false;
    table.options.allowDeleteColumn = false;
    for (var r = 0; r < studentData.length; r++) {
        for (var c = 0; c < studentData[r].length; c++) {
            var cell = table.getCell(jspreadsheet.getColumnName(c) + (r + 1));
            if (cell) cell.classList.add('readonly');
        }
    }
};

var answered=false;

// Check twice a second (500ms) to see if Moodle has graded/locked the question
var checkInterval = setInterval(function() {
    var isLocked = false;
    
    // 1. Check if the input itself got locked
    if (dataInput.hasAttribute('readonly') || dataInput.readOnly || dataInput.disabled) {
        isLocked = true;
    }
    
    // 2. Check if the Moodle question container (which holds this specific input) got graded
    var questionContainer = dataInput.closest('.que');
    if (questionContainer) {
        if (questionContainer.classList.contains('correct') || 
            questionContainer.classList.contains('incorrect') || 
            questionContainer.classList.contains('partiallycorrect') ||
            questionContainer.classList.contains('complete')) {
            isLocked = true;
        }
    }

    // 3. Also check if we are in the post-quiz Review page
    if (window.location.href.indexOf('review.php') !== -1) {
        isLocked = true;
    }

    // If any of the above are true, trigger the feedback!
    if (isLocked) {
        if (!answered) {
            answered = true;
            clearInterval(checkInterval); // Stop checking to save browser memory
            checkAnswer();                // Show the ✔️ and ❌
        }
    }
}, 500);
 });
[[/script]]
</div>
    
[[/iframe]]
