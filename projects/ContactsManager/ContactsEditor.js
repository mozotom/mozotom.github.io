// Copyright @2013 Tomasz Mozolewski
var contacts = new Array();
var curContact = -1;
 
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
  var name = attrFix(nameVal[0]);
  var nameSplit = name.split(";");
  var attrType = nameSplit[0];
  if (rmAttr.indexOf(attrType) >= 0) return;
  var val = nameVal.slice(1).join(":").replace(/^  */, "").replace(/  *$/, "");
  return { "name": name, "val": val };
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
        
        if ((cardLineObj) && (cardLineObj["val"] != "")) {
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
 
function addMouseColor(o, c0, c1) {
  o.onmouseover = function () { o.style.color = c1; };
  o.onmouseout = function () { o.style.color = c0; };
  o.style.cursor = "pointer";
}

function cleanStr(str) {
  return str.toUpperCase().replace(/[^A-Z0-9]/g, " ").replace(/  */g, " ").replace(/^  */, "").replace(/  *$/, "");
}

function isDupVal(a, b) {
  return cleanStr(a) == cleanStr(b);
}

function highlightDupVals(id, attr) {
  var t = e("compvcf").rows.length - 3;
  for (var i=0; i<t; ++i) {
    for (var j=i+1; j<t; ++j) {
      if (isDupVal(contacts[curContact][i][attr], contacts[curContact][j][attr])) {
        e(id + i).style.backgroundColor = "yellow";
        e(id + j).style.backgroundColor = "yellow";
      }
    }
  }
}

function addRow(t, name, val, isLast) {
  var rowId = t.rows.length - 2;
  var r = t.insertRow(t.rows.length - 1);
  var cName = r.insertCell(0);
  var cVal = r.insertCell(1);

  cName.id = "cName" + rowId;
  cVal.id = "cVal" + rowId;
  
  var cNameInput = document.createElement("input");
  cNameInput.id = "cNameInput" + rowId;
  cNameInput.className = "attrs";
  cNameInput.value = name;
  cNameInput.tabIndex = rowId + 1000;
  cNameInput.onchange = function() { saveResult(); highlightDupVals("cNameInput", "name"); };
  cName.appendChild(cNameInput);
  
  var cValInput = document.createElement("input");
  cValInput.id = "cValInput" + rowId;
  cValInput.className = "results";
  cValInput.value = val;
  cValInput.tabIndex = rowId + 2000;
  cValInput.onchange = function() { saveResult(); highlightDupVals("cValInput", "val"); };
  cVal.appendChild(cValInput);

  var cValErase = document.createElement("span");
  cValErase.innerHTML = "&#x2716;";
  cValErase.onclick = function () { if (r.rowIndex == t.rows.length - 2) addRow(t, "", "", true); t.deleteRow(r.rowIndex); saveResult(); showContact(curContact); };
  addMouseColor(cValErase, "black", "red");
  cVal.appendChild(cValErase);
  
  if (isLast) {
    cValInput.onchange = function() {
      if (cValInput.value != "") {
        saveResult();
        cValInput.onchange = function() { saveResult(); highlightDupVals("cValInput", "val"); };
        addRow(t, "", "", true);
        highlightDupVals("cNameInput", "name"); highlightDupVals("cValInput", "val");
      }
    }
  }
}

function emptyContactDetailsTable(t) {
  while (t.rows.length > 2) t.deleteRow(1);
}
 
function showContact(i) {
  setStatus("Contact " + (i+1) + " of " + contacts.length);
  curContact = i;
  var t = e("compvcf");
  emptyContactDetailsTable(t);
  
  for (var k=0; k<contacts[i].length; ++k) {
    addRow(t, contacts[i][k].name, contacts[i][k].val, false);
  }  
  addRow(t, "", "", true);
  highlightDupVals("cNameInput", "name"); highlightDupVals("cValInput", "val");
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
  
  if (contacts.length > 0) {
    showContact(0);
  } else {
    alert("No contacts have been loaded");
  }
}

function saveResult() {
  var r = new Array();
  var t = e("compvcf");

  for (var k=0; k<t.rows.length-2; ++k) {
    var elm = e("cValInput" + k);
    if (elm) {
      var v = elm.value;
      if (v != "") {
        var a = e("cNameInput" + k).value;
        var cardLineObj = parseCardLine(a + ":" + v, []);
        if (cardLineObj) r.push(cardLineObj);
      }
    }
  }
  
  contacts[curContact] = r;
}

function showPrev() {
  showContact((curContact + contacts.length - 1) % contacts.length);
}

function showNext() {
  showContact((curContact + 1) % contacts.length);
}

function delContact() {
  contacts.splice(curContact, 1);
  if (contacts.length > 0) {
    showContact(curContact % contacts.length);
  } else {
     emptyContactDetailsTable(e("compvcf"));
     setStatus("All contacts deleted");
  }
}

function addContact() {
  contacts[contacts.length] = [{name: "VERSION", val: "3.0"}, {name: "N", val: ""}, {name: "FN", val: ""}, {name: "TEL", val: ""}, {name: "EMAIL", val: ""}, {name: "ADR", val: ""}];
  showContact(contacts.length - 1);
}

function genResult() {
  var r = "";
  
  for (var i=0; i<contacts.length; ++i) if (contacts[i]) {
    r += "BEGIN:VCARD\n"
    for (var k=0; k<contacts[i].length; ++k) if (contacts[i][k]) {
      r += contacts[i][k].name + ":" + contacts[i][k].val + "\n";
    }
    r += "END:VCARD\n"
  }
  
  e("outvcf").value = r;
}

function init() {

}
