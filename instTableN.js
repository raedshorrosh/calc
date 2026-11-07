[[iframe]]
[[script src="https://raedshorrosh.github.io/jexcel.js"/]]
[[script src="https://raedshorrosh.github.io/jsuites.js"/]]
[[style href="https://raedshorrosh.github.io/jsuites.css" type="text/css" /]]
[[style href="https://raedshorrosh.github.io/jexcel.css" type="text/css" /]]
[[style href="https://fonts.googleapis.com/css?family=Material+Icons" type="text/css" /]]
[[script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_HTMLorMML" /]]

 <p style=display:none>`x^2`,`x/y`, \(\small C_6H_{12}O_{6(s)}\)</p>
 <div id="styleExportBar" style="display:none; direction:ltr; text-align:center; margin-bottom:8px; font-family:Arial, sans-serif; font-size:14px;">
   <label for="tableStyleOutput"><b>tableStyle (changes only): </b></label>
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

// Compact tableStyle format: save ONLY cells that differ from the defaults
// and ONLY columns whose widths were manually changed.
// The default appearance is supplied by CSS, not by per-cell setStyle().
// Example: tableStyle:"{'D4':'font-weight:bold;','__COLWIDTHS__':'E=140'}";
var COLUMN_WIDTH_KEY = '__COLWIDTHS__';
var initialColumnWidthChanges = {};
var widthSyncEnabled = false;
var suppressPersistence = false;

// Default table appearance follows nested header groups rather than fixed columns.
// Columns A:C always remain neutral unless styled by the user.
// With nested headers, each group from D onward has its own color.
// Without nested headers, columns D onward use the first color.
// Group colors are CSS defaults and are NOT saved in tableStyle.
var DEFAULT_CELL_CSS = {
    'text-align': 'center',
    'white-space': 'pre-wrap'
};
var DEFAULT_GROUP_COLORS = [
    'rgb(255, 235, 238)', // pale red
    'rgb(227, 242, 253)', // pale blue
    'rgb(255, 243, 224)', // pale orange
    'rgb(232, 245, 233)', // pale green
    'rgb(243, 229, 245)', // pale lilac
    'rgb(224, 247, 250)', // pale cyan
    'rgb(255, 249, 196)', // pale yellow
    'rgb(236, 239, 241)'  // pale grey
];

// Filled after {#nested#} is parsed. Each entry is a palette index or absent.
var nestedColorGroupByColumn = [];
var defaultColorClassNames = DEFAULT_GROUP_COLORS.map(function(_, i) {
    return 'stack-default-group-' + i;
});
var defaultStyleElement = document.createElement('style');
var defaultRules =
    '#' + uid_table + ' td.stack-default-cell {' +
        'text-align:center;white-space:pre-wrap;' +
    '}' +
    '#' + uid_table + ' td.stack-default-label {' +
        'font-weight:bold;' +
    '}';
DEFAULT_GROUP_COLORS.forEach(function(color, i) {
    defaultRules += '#' + uid_table + ' td.stack-default-group-' + i + '{' +
        'background-color:' + color + ';' +
    '}';
});
defaultStyleElement.textContent = defaultRules;
document.head.appendChild(defaultStyleElement);

function applyDefaultCellClasses(cell, col) {
    if (!cell) return;
    cell.classList.remove('stack-default-label');
    defaultColorClassNames.forEach(function(className) {
        cell.classList.remove(className);
    });
    cell.classList.add('stack-default-cell');
    if (col < 2) cell.classList.add('stack-default-label');
    var groupIndex = col >= 3 ? nestedColorGroupByColumn[col] : undefined;
    if (Number.isInteger(groupIndex)) {
        cell.classList.add('stack-default-group-' + groupIndex);
    }
}

// The nested header row determines the default color of each data column.
// A: C remain neutral even when the first nested group spans those columns.
// The first meaningful (outermost) grouping is used for multi-row headers.
function buildNestedColorMap(rawNested, columnCount) {
    var map = [];
    // No nested groups: color only D onward using the first palette color.
    // A:C remain neutral; teachers/students may override any cell color.
    if (!Array.isArray(rawNested) || rawNested.length === 0) {
        for (var col = 3; col < columnCount; col++) map[col] = 0;
        return map;
    }
    var rows = Array.isArray(rawNested[0]) ? rawNested : [rawNested];
    var headerRow = rows[0];
    if (!Array.isArray(headerRow) || headerRow.length === 0) {
        for (var col = 3; col < columnCount; col++) map[col] = 0;
        return map;
    }

    var offset = 0;
    var colorGroup = 0;
    headerRow.forEach(function(header) {
        var span = Number(header && header.colspan);
        if (!Number.isInteger(span) || span < 1) span = 1;
        var end = Math.min(columnCount, offset + span);
        if (end > 3 && end > offset) {
            for (var col = Math.max(3, offset); col < end; col++) {
                map[col] = colorGroup % DEFAULT_GROUP_COLORS.length;
            }
            colorGroup++;
        }
        offset = end;
    });
    return map;
}

// Cell names are generated by JSpreadsheet, including AA, AB, ... .
function columnIndexFromLetters(letters) {
    var index = 0;
    for (var i = 0; i < letters.length; i++) {
        index = index * 26 + letters.charCodeAt(i) - 64;
    }
    return index - 1;
}

// Store width changes as E=140,G=125 instead of a width for every column.
function extractWidthChanges(styleMap) {
    var changes = {};
    if (!styleMap || !Object.prototype.hasOwnProperty.call(styleMap, COLUMN_WIDTH_KEY)) {
        return changes;
    }
    var encoded = String(styleMap[COLUMN_WIDTH_KEY] || '');
    delete styleMap[COLUMN_WIDTH_KEY];
    encoded.split(',').forEach(function(entry) {
        var match = /^([A-Z]+)=(\d+)$/.exec(entry.trim());
        if (!match) return;
        var index = columnIndexFromLetters(match[1]);
        var pixels = Number(match[2]);
        if (index >= 0 && Number.isFinite(pixels) && pixels >= 30 && pixels <= 3000) {
            changes[index] = pixels;
        }
    });
    return changes;
}

// Parse simple CSS property declarations and keep the last value when repeated.
function parseCellCss(raw) {
    var result = {};
    if (typeof raw !== 'string') return result;
    raw.split(';').forEach(function(part) {
        var pos = part.indexOf(':');
        if (pos < 0) return;
        var name = part.slice(0, pos).trim().toLowerCase();
        var value = part.slice(pos + 1).trim();
        if (name && value) result[name] = value;
    });
    return result;
}
function normaliseCssValue(value) {
    return String(value).trim().toLowerCase()
        .replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ');
}
function defaultPropertiesForCell(col) {
    var defaults = Object.assign({}, DEFAULT_CELL_CSS);
    if (col < 2) defaults['font-weight'] = 'bold';
    var groupIndex = col >= 3 ? nestedColorGroupByColumn[col] : undefined;
    if (Number.isInteger(groupIndex)) {
        defaults['background-color'] = DEFAULT_GROUP_COLORS[groupIndex];
    }
    return defaults;
}

// This is the single source of truth for the Maxima export:
// only properties that are different from the shared table defaults.
function getChangedCellStyles(jspInstance) {
    var changed = {};
    if (!jspInstance || typeof jspInstance.getStyle !== 'function') return changed;
    var allStyles = jspInstance.getStyle() || {};
    Object.keys(allStyles).sort().forEach(function(ref) {
        var match = /^([A-Z]+)([1-9]\d*)$/.exec(ref);
        if (!match) return;
        var col = columnIndexFromLetters(match[1]);
        var defaults = defaultPropertiesForCell(col);
        var properties = parseCellCss(allStyles[ref]);
        var differences = [];
        Object.keys(properties).sort().forEach(function(name) {
            if (!Object.prototype.hasOwnProperty.call(defaults, name) ||
                normaliseCssValue(properties[name]) !== normaliseCssValue(defaults[name])) {
                differences.push(name + ':' + properties[name] + ';');
            }
        });
        if (differences.length) changed[ref] = differences.join('');
    });
    return changed;
}

// Plain, uncompressed tableStyle only. Missing/empty tableStyle means defaults.
var initialStyle = {};
var tblStl = null;
try {
    // The CAS expression also works when tableStyle was never defined.
    tblStl = {#if stringp(tableStyle) then tableStyle else "{}"#};
} catch (e) {
    // Missing tableStyle in an older question: use the shared defaults.
    tblStl = null;
}
if (tblStl !== undefined && tblStl !== null && tblStl !== '') {
    try {
        var parsedTableStyle = typeof tblStl === 'string'
            ? JSON.parse(tblStl.replace(/'/g, '"')) : tblStl;
        if (parsedTableStyle && typeof parsedTableStyle === 'object' &&
            !Array.isArray(parsedTableStyle)) {
            initialStyle = Object.assign({}, parsedTableStyle);
        }
    } catch (e) {
        console.warn('Could not parse tableStyle; using defaults.', e);
    }
}
initialColumnWidthChanges = extractWidthChanges(initialStyle);

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
// Allow a question with no nested Maxima variable at all.
const nst = {#if stringp(nested) then nested else "[]"#};
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
// Use the teacher-defined nested column groups before adding the letter row.
// Without nested headers, only D onward use the first palette color.
nestedColorGroupByColumn = buildNestedColorMap(nested, originalColumnCount);

// JSpreadsheet requires nestedHeaders as an array of header rows.
// Preserve either an existing single header row or multiple header rows.
nested = [createLetterHeaders(originalColumnCount)].concat(
    nested.length ? (Array.isArray(nested[0]) ? nested : [nested]) : []
);

// Match the existing default group colors on the column Titles row and on
// the teacher-defined nested header rows, but NEVER color the A/B/C... letters.
// The first three data columns (A-C) also remain neutral.
function colorColumnAndNestedTitles() {
    var root = document.getElementById(uid_table);
    if (!root) return;
    var headerRows = Array.from(root.querySelectorAll('.jexcel > thead > tr'));
    if (headerRows.length < 2) return;

    // The row-number corner is not a data column; skip it when present.
    function getDataHeaderCells(row) {
        var cells = Array.from(row.children);
        var spanTotal = cells.reduce(function(sum, cell) {
            return sum + (Number(cell.colSpan) || 1);
        }, 0);
        if (spanTotal > originalColumnCount) cells.shift();
        return cells;
    }

    function colorHeaderRow(row) {
        if (!row) return;
        var col = 0;
        getDataHeaderCells(row).forEach(function(cell) {
            var span = Number(cell.colSpan) || 1;
            // Never color header cells that start inside neutral columns A-C.
            // A merged title crossing A-C cannot be colored only in part.
            if (col >= 3) {
                var group = nestedColorGroupByColumn[col];
                if (Number.isInteger(group)) {
                    cell.style.backgroundColor = DEFAULT_GROUP_COLORS[group];
                }
            }
            col += span;
        });
    }

    // The last THEAD row is the individual column Titles, not the letter row.
    colorHeaderRow(headerRows[headerRows.length - 1]);

    // nested[0] is the generated A/B/C letter row: deliberately skip it.
    // The remaining rows are the teacher's own nested headers.
    var userNestedRowCount = Math.max(0, nested.length - 1);
    var firstUserNestedRow = headerRows.length - 1 - userNestedRowCount;
    for (var i = 0; i < userNestedRowCount; i++) {
        colorHeaderRow(headerRows[firstUserNestedRow + i]);
    }
}

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

// Apply only the explicitly customized column widths.
function applyColumnWidthChanges(jspInstance, changes) {
    if (!jspInstance || !changes || typeof jspInstance.setWidth !== 'function') return;
    var enabledBefore = widthSyncEnabled;
    widthSyncEnabled = false;
    try {
        Object.keys(changes).forEach(function(indexText) {
            var index = Number(indexText), width = Number(changes[indexText]);
            if (Number.isInteger(index) && index >= 0 &&
                Number.isFinite(width) && width >= 30 && width <= 3000) {
                jspInstance.setWidth(index, Math.round(width));
            }
        });
    } finally {
        widthSyncEnabled = enabledBefore;
    }
}

// Persist the sparse style overrides, without any compression.
function syncOutputs(jspInstance) {
    if (suppressPersistence) return;
    var currentData = jspInstance ? jspInstance.getData() : data;
    var overrides = jspInstance ? getChangedCellStyles(jspInstance) : {};
    var columnWidths = jspInstance
        ? readColumnWidths(jspInstance, originalColumnCount)
        : makeDefaultWidths(originalColumnCount);
    var defaultWidths = makeDefaultWidths(originalColumnCount);
    var editedWidths = [];
    for (var i = 0; i < columnWidths.length; i++) {
        if (columnWidths[i] !== defaultWidths[i]) {
            editedWidths.push(jspreadsheet.getColumnName(i) + '=' + columnWidths[i]);
        }
    }
    if (editedWidths.length) overrides[COLUMN_WIDTH_KEY] = editedWidths.join(',');
    var styleStr = JSON.stringify(overrides).replace(/"/g, "'");

    if ({#design#} == 1) {
        // Teacher mode: ans2 holds data only; tableStyle holds ONLY overrides.
        dataInput.value = JSON.stringify(currentData);
        dataInput.dispatchEvent(new Event('change'));
        var styleOut = document.getElementById('tableStyleOutput');
        if (styleOut) styleOut.value = 'tableStyle: "' + styleStr + '";';
    } else {
        // Keep the existing student-answer format; do not compress ans2.
        var out = currentData.slice();
        if (Object.keys(overrides).length) out.push(['__STYLE__', styleStr]);
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
            initialColumnWidthChanges = extractWidthChanges(initialStyle);
        }
        dataInput.dispatchEvent(new Event('change'));
    } catch (e) {
        console.warn("Could not parse dataInput:", e);
    }
} else {
    dataInput.value = JSON.stringify(data);
    dataInput.dispatchEvent(new Event('change'));
}
  
function makeDefaultWidths(count) {
    var w = [150, 100, 100];
    for (var i=3; i<count; i++) w[i] = 100;
    return w.slice(0, count);
}
var widths = makeDefaultWidths(originalColumnCount);
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
   applyDefaultCellClasses(cell, col);
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

// Color Titles and teacher nested headers; keep Excel letter row neutral.
colorColumnAndNestedTitles();

// Initial table typesetting: once, after creation, before user editing.
// Later updates use the per-cell function instead of this table-wide call.
MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById(uid_table)]);

// Restore only style and width differences, over the CSS defaults.
applyStylesToTable(table, initialStyle);
applyColumnWidthChanges(table, initialColumnWidthChanges);
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
