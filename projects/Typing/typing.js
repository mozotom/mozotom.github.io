var nbsp = '\u00a0';
var words = [];
var text = "";
var t0 = -1;

function loadName() {
  document.getElementById("name").value = localStorage.getItem("name");
}

function saveName() {
  localStorage.setItem("name", document.getElementById("name").value);
}

function loadWords() {
  var letters = document.getElementById("lesson").value;
  words = parseWords(wordsText, letters);
  document.getElementById("typing").innerText = "";
  text = randomWords(55 * 5);
  startTyping();
  typedKey();
}
setTimeout(loadWords, 1);

function parseWords(text, letters) {
  var words = []
  var lines = text.split(" ");
  for (var i in lines) {
    if (containsOnly(letters, lines[i])) {
      words.push(lines[i]);
    }
  }
  return words;
}

function containsOnly(letters, text) {
  for (var i=0; i<text.length; ++i) {
    if (letters.indexOf(text[i]) < 0) {
      return false;
    }
  }
  return true;
}

function randomWords(charCount) {
  var wordBag = words;
  var r = "";
  while ((r.length < charCount) && (wordBag.length > 0)) {
    if (r.length > 0) r += " ";
    var k = Math.floor(Math.random() * wordBag.length);
    var word = wordBag.splice(k, 1);
    r += word;
  }
  return r;
}

function typedKey() {  
  var typingDom = document.getElementById("typing");
  var typed = typingDom.innerText;
  var k = typed.length;
  updateTiming();
  highlight("text", k);
  highlightErrors();
  placeCaretAtEnd(typingDom);
}

function updateTiming() {
  var txt0 = document.getElementById("text").innerText;
  var txt1 = document.getElementById("typing").innerText;
  
  if (txt1.length < 1) {
    t0 = -1;
  } else if (t0 < 0) {
    t0 = performance.now();
  }
  var t1 = performance.now();
  var tt = t1 - t0;
  var n = countCorrect(txt0, txt1);
  var m = tt / 1000 / 60;
  var wpm = Math.round(n / 5 / m);
  
  if ((t0 >= 0) && (t0 < t1)) {
    var s = Math.round(tt / 1000);
    var m = Math.floor(s / 60);
    s = s%60;
    if (s <= 9) s = "0" + s;
    var timeText = m + ":" + s;
    var wpmText = "  " + wpm + " WPM";
  } else {
    var timeText = "0:00";
    var wpmText = "0 WPM";
  }  
  
  document.getElementById("time").innerText = timeText;
  document.getElementById("wpm").innerText = wpmText;
  
  if ((txt0.length == n) && (n > 1)) {
    saveResult(wpm, timeText);
    startTyping();
  }
}

function saveResult(wpm, tt) {
  var name = document.getElementById("name").value;
  var lesson = document.getElementById("lesson").value;
  var now = new Date();
  var timestamp = (1900 + now.getYear()) + "/" + now.getMonth() + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  var result = name + "\t" + lesson + "\t" + timestamp + "\t" + wpm + "\t" + tt;
  var results = localStorage.getItem("results");
  if (results == null) results = ""; else result += "\n";
  localStorage.setItem("results", result + results);
  loadResults();
}

function loadResults() {
  var resTbl = document.getElementById("results");
  var results = localStorage.getItem("results");
  results = results==null ? [] : results.split('\n');
  
  while (resTbl.rows.length > 1) {
    resTbl.deleteRow(1);
  }
  
  for (var i in results) if (results[i].indexOf('\t') >= 0) {
    var tr = document.createElement("tr");
    resTbl.appendChild(tr);

    var vals = results[i].split("\t");
    for (var j in vals) {
      var td = document.createElement("td");
      td.innerText = vals[j];
      tr.appendChild(td);
    }
  }
  
}

function countCorrect(org, typed) {
  var k = 0;
  for (var i=0; i <typed.length; ++i) {
    if ((org[i] == typed[i]) || ((org[i] == " ") && (typed[i] == nbsp))) {
      ++k;
    }
  }
  return k;
}

function highlight(id, k) {
  var newText = '<span class="grayout">' + text.substr(0, k) + '</span><span class="highlight">' + (k<text.length?text[k]:"") + '</span>' + text.substr(k + 1);
  document.getElementById(id).innerHTML = newText;
}

function highlightErrors() {
  var t0 = document.getElementById("text").innerText;
  var t1 = document.getElementById("typing").innerText;
  var i = 0;
  var newText = "";
  for (var i=0; i < t1.length; ++i) {
    if ((t0[i] == t1[i]) || ((t0[i] == " ") && (t1[i] == nbsp))) {
      newText += t1[i];
    } else {
      newText += '<span class="errorhighlight">' + t1[i] + '</span>';
    }
  }
  
  var dom = document.getElementById("typing");
  dom.innerHTML = newText;
}

function startTyping() {
  var dom = document.getElementById("typing")
  dom.innerText = "";
  t0 = -1;
  dom.focus();
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}