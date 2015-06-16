// Copyright @2013 Tomasz Mozolewski
var contacts = new Array();
var dupAttrs = ["TEL", "ADR", "URL", "EMAIL"];
var curLeft = 0;
var curRight = 0;
 
function e(id) {
  return document.getElementById(id);
}
 
function extractTEL(val) {
  return val.replace(/[)( -]/g, "").replace(/^\+1/, "");
}
 
function stripSpace(val) {
  return val.replace(/ *[:;] */g, ":").replace(/^  */, "").replace(/  *$/, "");
}
 
function attrFix(val) {
  return val.replace(/^item[0-9]*\./, "").replace(/type=/g, "").toUpperCase();
}
 
function htmlSafe(val) {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 
function shortVal(val, len) {
  var v = htmlSafe(val);
  if (val.length > len) {
    return "<div title=\"" + v + "\">" + htmlSafe(val.substring(0, len)) + "&#8230;</div>";
  } else {
    return v;
  }
}

function parseCardLine(line, rmAttr) {
  // Extract attributes
  var nameVal = line.split(":");
  var fullName = attrFix(nameVal[0]);
  var nameSplit = fullName.split(";");
  var attrType = nameSplit[0];
  if (rmAttr.indexOf(attrType) >= 0) return;
  var attrDetail = nameSplit.slice(1).join(";");
  var orgVal = nameVal.slice(1).join(":").replace(/^  */, "").replace(/  *$/, "");

  // Simplify values for comparisons
  var modVal = stripSpace(orgVal).toUpperCase();
  if (attrType == "TEL") {
    modVal = extractTEL(modVal);
  }

  return { "fullName": fullName, "attrType": attrType, "attrDetail": attrDetail, "orgVal": orgVal, "modVal": modVal };
}

function machesAnyPattern(line, skipPatterns) {
  for (var k=0; k<skipPatterns.length; ++k) {
    if (line.match(skipPatterns[k])) return true;
  }
  return false;
}

function parseCard(card, rmXAttr, rmAttr, skipPatterns) {
  var lines = card.split("\n");
  for (var i0=0; i0<lines.length; ++i0) {
    if (lines[i0] == "BEGIN:VCARD") {
      var cardObj = new Array();
      for (var i=i0+1; i<lines.length; ++i) {
        // Join lines that were split
        while ((i+1<lines.length) && (lines[i+1].length > 0) && (lines[i+1].charAt(0) == " ")) {
          ++i;
          lines[i] = lines[i-1] + lines[i].substr(1);
        }
        var compLine = lines[i].replace(/^item[0-9]*\./, "");
        if ((rmXAttr) && (compLine.substr(0,2).toUpperCase() == "X-")) continue;
        if (machesAnyPattern(compLine, skipPatterns)) continue;
        
        var cardLineObj = parseCardLine(lines[i], rmAttr);
        
        if ((cardLineObj) && (cardLineObj["modVal"] != "")) {
          cardObj.push(cardLineObj);
        }
      }
      contacts.push(cardObj);
      return;
    }
  }
}
 
function parseInput(input, rmXAttr, rmAttr, skipPatterns) {
  contacts = new Array();
  var cards = input.split("END:VCARD");
  for (var card in cards) {
    parseCard(cards[card], rmXAttr, rmAttr, skipPatterns);
  }
}
 
function getMatchingIndex(i0, i1, k0) {
 // i0 - org contact index
  // i1 - match contact index
  // k0 - org attribute index
 
  var kAttr = -1;
  var kVal = -1;
  var dupAttr = dupAttrs.indexOf(contacts[i0][k0].attrType) >= 0;
 
  for (var k=0; k<contacts[i1].length; ++k) {
    if ((!dupAttr) && (contacts[i1][k].attrType == contacts[i0][k0].attrType)) {
      kAttr = k;
    }
    if (contacts[i1][k].modVal == contacts[i0][k0].modVal) {
      kVal = k;
    }
  }
 
  if (kVal >= 0) return kVal;
  if (kAttr >= 0) return kAttr;
  return -1;
}

function addMouseColor(o, c0, c1) {
  o.onmouseover = function () { o.style.color = c1; };
  o.onmouseout = function () { o.style.color = c0; };
  o.style.cursor = "pointer";
}

function addMergeRow(t, i0, k0, i1, k1) {
  var rowId = t.rows.length - 3;
  var r = t.insertRow(t.rows.length - 2);
  var cAttr = r.insertCell(0);
  var cLeft = r.insertCell(1);
  var cResult = r.insertCell(2);
  var cRight = r.insertCell(3);

  cLeft.id = "cLeft" + rowId;
  cResult.id = "cResult" + rowId;
  cRight.id = "cRight" + rowId;
  
  cLeft.innerHTML = k0<0?"":shortVal(contacts[i0][k0].orgVal, 30);
  cRight.innerHTML = k1<0?"":shortVal(contacts[i1][k1].orgVal, 30);

  var cAttrInput = document.createElement("input");
  cAttrInput.id = "cAttrInput" + rowId;
  cAttrInput.className = "attrs";
  cAttrInput.value = k0<0?contacts[i1][k1].fullName:contacts[i0][k0].fullName;
  cAttrInput.tabIndex = rowId + 1000;
  cAttr.appendChild(cAttrInput);
  
  var cResultInput = document.createElement("input");
  cResultInput.id = "cResultInput" + rowId;
  cResultInput.className = "results";
  cResultInput.value = k0<0?contacts[i1][k1].orgVal:contacts[i0][k0].orgVal;
  cResultInput.tabIndex = rowId + 2000;
  cResult.appendChild(cResultInput);

  var cResultErase = document.createElement("span");
  cResultErase.innerHTML = "&#x2716;";
  cResultErase.onclick = function () { cResultInput.value = ""; };
  addMouseColor(cResultErase, "black", "red");
  cResult.appendChild(cResultErase);

  if ((k0 < 0) || (k1 < 0)) {
    cResultInput.style.fontWeight = "bold";
  } else if (contacts[i0][k0].modVal != contacts[i1][k1].modVal) {
    cResultInput.style.backgroundColor = "yellow";
  }
 
  cLeft.onclick = function() { cResultInput.value = k0<0?"":contacts[i0][k0].orgVal; };
  addMouseColor(cLeft, "black", "green");
  cRight.onclick = function() { cResultInput.value = k1<0?"":contacts[i1][k1].orgVal; };
  addMouseColor(cRight, "black", "green");
}
 
function showMerge(i0, i1) {
  setStatus("Merging records " + i0 + " and " + i1);
  curLeft = i0;
  curRight = i1;
  var t = e("compvcf");
  while (t.rows.length > 3) t.deleteRow(1);
  
  var a1 = new Array(contacts[i1].length);
 
  for (var k0=0; k0<contacts[i0].length; ++k0) {
    var k1 = getMatchingIndex(i0, i1, k0);
    addMergeRow(t, i0, k0, i1, k1);
    if (k1 >= 0) a1[k1] = true;
  }
 
  for (var k1=0; k1<contacts[i1].length; ++k1) if (!a1[k1]) {
    var k0 = getMatchingIndex(i1, i0, k1);
    addMergeRow(t, i0, k0, i1, k1);
  }
  
  e("leftKeepvcf").checked = false;
  e("resultKeepvcf").checked = true;
  e("rightKeepvcf").checked = false;
}

function copyMerge(id) {
  var t = e("compvcf");
  for (var k=0; k<t.rows.length-3; ++k) {
    e(id + k).click();
  }
}

function setStatus(msg) {
  e("status").innerText = msg;
}

function loadData() {
  var rmAttr = new Array();
  if (e("attrPRODID").checked) rmAttr.push("PRODID");
  if (e("attrREV").checked) rmAttr.push("REV");
  
  var skipPattern = e("skipPattern").value;
  if (skipPattern != "") {
    var skipPatterns = skipPattern.split("|");
  } else {
    var skipPatterns = [];
  }
  
  parseInput(e("invcf").value, e("xAttr").checked, rmAttr, skipPatterns);
  setStatus("Data Loaded: " + contacts.length + " contacts.");
}

function dupMerge() {
  curLeft = 0;
  curRight = 0;
  if (contacts.length > 0) {
    showNextMerge();
  } else {
    alert("Please load contacts first.");
  }
}
 
function saveResult() {
  var r = new Array();
  var t = e("compvcf");

  for (var k=0; k<t.rows.length-3; ++k) {
    var elm = e("cResultInput" + k);
    if (elm) {
      var v = elm.value;
      if (v != "") {
        var a = e("cAttrInput" + k).value;
        var cardLineObj = parseCardLine(a + ":" + v, []);
        if (cardLineObj) r.push(cardLineObj);
      }
    }
  }
  
  contacts.push(r);
}

function saveNext() {
  var leftKeepvcf = e("leftKeepvcf").checked;
  var resultKeepvcf = e("resultKeepvcf").checked;
  var rightKeepvcf = e("rightKeepvcf").checked;
  
  if (!leftKeepvcf && !resultKeepvcf && !rightKeepvcf) {
    if (!window.confirm("Are you sure you want to delete both contacts?")) return;
  }

  if (leftKeepvcf && resultKeepvcf && rightKeepvcf) {
    if (!window.confirm("Are you sure you want to keep both contacts and create new one?")) return;
  }
  
  if (!leftKeepvcf) delete contacts[curLeft];
  if (resultKeepvcf) saveResult();
  if (!rightKeepvcf) delete contacts[curRight];
  
  showNextMerge();
}
 
function genResult() {
  var r = "";
  
  for (var i=0; i<contacts.length; ++i) if (contacts[i]) {
    r += "BEGIN:VCARD\n"
    for (var k=0; k<contacts[i].length; ++k) if (contacts[i][k]) {
      r += contacts[i][k].fullName + ":" + contacts[i][k].orgVal + "\n";
    }
    r += "END:VCARD\n"
  }
  
  e("outvcf").value = r;
}

function getValues(i, attrType, valType) {
  var a = new Array();
  for (var k=0; k<contacts[i].length; ++k) {
    if (contacts[i][k].attrType == attrType) {
      a.push(contacts[i][k][valType]);
    }
  }
  return a;
}

function matchAny(a0, a1, matchCount, matchP) {
  var m = Math.min(a0.length, a1.length) * matchP;
  var c = 0;
  for (var i0=0; i0<a0.length; ++i0) {
    for (var i1=0; i1<a1.length; ++i1) {
      if (a0[i0] == a1[i1]) {
        ++c;
        if ((c >= matchCount ) && (c > m)) return true;
      }
    }
  }
  return false;
}

function contactMatchAttribute(i0, i1, attrType, valType) {
  var a0 = getValues(i0, attrType, valType);
  var a1 = getValues(i1, attrType, valType);
  return matchAny(a0, a1, 1, 0);
}

function getNameParts(str) {
  return str.toUpperCase().replace(/[^A-Z]/g, " ").replace(/  */g, " ").split(" ").sort().filter(function(el,i,a){if((i==a.indexOf(el))&&(el.length>1))return 1;return 0});
}

function contactMatchAttributeParts(i0, i1, attrType, valType, matchCount, matchP) {
  var a0 = getNameParts(getValues(i0, attrType, valType).join(" "));
  var a1 = getNameParts(getValues(i1, attrType, valType).join(" "));
  return matchAny(a0, a1, matchCount, matchP);
}

function isMergeCandicate(i0, i1) {
  return (
      contacts[i0] && contacts[i1]
    ) && (
      contactMatchAttribute(i0, i1, "F", "modVal") ||
      contactMatchAttribute(i0, i1, "FN", "modVal") ||
      contactMatchAttribute(i0, i1, "TEL", "modVal") ||
      contactMatchAttribute(i0, i1, "EMAIL", "modVal") ||
      contactMatchAttributeParts(i0, i1, "F", "modVal", 2, 0.51) ||
      contactMatchAttributeParts(i0, i1, "FN", "modVal", 2, 0.51)
    );
}

function isIdentical(i0, i1) {
  if (contacts[i0].length != contacts[i1].length) return false;
  for (var k=0; k<contacts[i0].length; ++k) {
    if ((contacts[i0][k].fullName != contacts[i0][k].fullName) || (contacts[i0][k].orgVal != contacts[i0][k].orgVal)) return false
  }
  return true;
}

function showNextMerge() {
  while (true) {
    do {
      ++curRight;
      if (curRight >= contacts.length) {
        do {
          ++curLeft;
        } while (!curLeft);
        curRight = curLeft + 1;
      }
      
      if (curLeft >= contacts.length - 1) {
        alert("All contact pairs have been merged.");
        return;
      }
    } while (!isMergeCandicate(curLeft, curRight));
    
    if (isIdentical(curLeft, curRight)) {
      delete contacts[curRight];
    } else {
      break;
    }
  }
  showMerge(curLeft, curRight);
}

function init() {
  addMouseColor(e("leftHeader"), "black", "blue");
  addMouseColor(e("resultHeader"), "black", "blue");
  addMouseColor(e("rightHeader"), "black", "blue");
}
