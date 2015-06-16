function getCtx() {
  return $("#canvas")[0].getContext('2d');
}

$(document).ready(function() {
  $("#canvas").mousedown(function(e) {
    processMouseDown(getCtx(), e.pageX, e.pageY);
  });

  $("#canvas").mousemove(function(e) {
    processMouseMove(getCtx(), e.pageX, e.pageY);
  });

  $("#canvas").mouseup(function(e) {
    processMouseUp(getCtx(), e.pageX, e.pageY);
  });

  drawScreen(getCtx());
});

$(window).resize(function() {
  drawScreen(getCtx());
});

$(window).keypress(function(e) {
  var f = keyPressFunc[e.charCode];
  if (f) {
    stopHighlight();
    f();
    drawScreen(getCtx());
  }
});

CanvasRenderingContext2D.prototype.drawLine = function (x0, y0, x1, y1, c) {
  this.strokeStyle  = c;
  this.beginPath();
  this.moveTo(x0, y0);
  this.lineTo(x1, y1);
  this.stroke();
};

CanvasRenderingContext2D.prototype.rotateText = function(str, x0, y0, angle) {
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);

  this.save();
  this.translate(x0, y0);
  this.transform(cos, sin, -sin, cos, 0, 0);
  this.fillText(str, 0, 0);
  this.restore();
};

CanvasRenderingContext2D.prototype.getFontHeight = function(str, maxWidth, maxHeight, fontName) {
  this.font = maxHeight + "px '" + fontName + "'";
  var len = this.measureText(str).width;
  return Math.min(maxHeight, maxHeight * maxWidth / len);
};

Number.prototype.addCommas = function() {
  var nStr = this + '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

function rgb(r, g, b) {
  return "rgb(" + r +", " + g +", " + b +")"
}


function processClick(ctx, x, y) {
  for (var key in keyPos) {
    if (isInArea(x, y, keyPos[key])) {
      stopHighlight();
      keyFunc[key]();
      drawScreen(ctx);
    }
  }
}

function processMouseUp(ctx, x, y) {
  mouseDown = false;
  processClick(ctx, x, y);
  keyDown = undefined;
  drawScreen(ctx);
}

function processMouseDown(ctx, x, y) {
  mouseDown = true;
  processMouseMove(ctx, x, y);
}

function processMouseMove(ctx, x, y) {
  for (var key in keyPos) {
    if (isInArea(x, y, keyPos[key])) {
      keyDown = key;
      drawScreen(ctx);
      return;
    }
  }
  keyDown = undefined;
  drawScreen(ctx);
}

function isInArea(x, y, dim) {
  return ((x >= dim[0]) && (y >= dim[1]) && (x <= dim[2]) && (y <= dim[3]));
}

function keyPressedDigit(d) {
  typed = typed + "" + d;
  ansColor = "#000000";
}

function keyPressedClear() {
  typed = "";
  ansColor = "#000000";
}

function keyPressedPlusMinus() {
  if (typed != "") {
    typed = (-parseFloat(typed)) + "";
    ansColor = "#000000";
  }
}

function keyPressedSubmit() {
  var ans = 0;
  if (typed != "") ans = parseFloat(typed);
  if (ans == pbm.s) {
    ansColor = "#00cf00";
    highlight("pbm = genProblem(); keyPressedClear(); drawScreen(getCtx());", 100);
    if (keepScore) ++correctCount;
  } else {
    ansColor = "#cc0000";
    if (keepScore) ++incorrectCount;
    highlight("keyPressedClear(); drawScreen(getCtx());", 500);
  }
}


var highlightAction = "";
var highlightTimer = null;

function stopHighlight() {
  if (highlightTimer != null) {
    clearTimeout(highlightTimer);
    eval(highlightAction);
    highlightAction = "";
    highlightTimer = null;
  }
}

function highlight(action, time) {
  stopHighlight();
  highlightAction = action;
  highlightTimer = setTimeout("highlightAction = ''; highlightTimer = null; " + highlightAction, time);
}

function drawScreen(ctx) {
  ctx.canvas.height = $(window).height();
  ctx.canvas.width = $(window).width();

  var gradObj = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj.addColorStop(0, "#efefef");
  gradObj.addColorStop(1, "#d7d7d7");
  ctx.fillStyle = gradObj;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (ctx.canvas.width >= ctx.canvas.height * 31 / 35) {
    drawProblem(ctx, ctx.canvas.width * 1/31, ctx.canvas.height * 1/35, ctx.canvas.width * 14/31, ctx.canvas.height * 29/35);
    drawKeyPad(ctx, ctx.canvas.width * 16/31, ctx.canvas.height * 1/35, ctx.canvas.width * 14/31, ctx.canvas.height * 29/35);
  } else {
    drawProblem(ctx, ctx.canvas.width * 1/31, ctx.canvas.height * 1/35, ctx.canvas.width * 29/31, ctx.canvas.height * 14/35);
    drawKeyPad(ctx, ctx.canvas.width * 1/31, ctx.canvas.height * 16/35, ctx.canvas.width * 29/31, ctx.canvas.height * 14/35);
  }
  drawScore(ctx, ctx.canvas.width * 1/31, ctx.canvas.height * 31/35, ctx.canvas.width * 29/31, ctx.canvas.height * 3/35);
}

var keyPos;
var keyDown;
var keyFunc = {
  '1': function() { keyPressedDigit(1); }, 
  '2': function() { keyPressedDigit(2); }, 
  '3': function() { keyPressedDigit(3); }, 
  '4': function() { keyPressedDigit(4); }, 
  '5': function() { keyPressedDigit(5); }, 
  '6': function() { keyPressedDigit(6); }, 
  '7': function() { keyPressedDigit(7); }, 
  '8': function() { keyPressedDigit(8); }, 
  '9': function() { keyPressedDigit(9); }, 
  "\u00B1": function() { keyPressedPlusMinus(); }, 
  '0': function() { keyPressedDigit(0); }, 
  'C': function() { keyPressedClear(); },
  'Enter': function() { keyPressedSubmit(); }
};

var keyPressFunc = {
  49: function() { keyPressedDigit(1); }, 
  50: function() { keyPressedDigit(2); }, 
  51: function() { keyPressedDigit(3); }, 
  52: function() { keyPressedDigit(4); }, 
  53: function() { keyPressedDigit(5); }, 
  54: function() { keyPressedDigit(6); }, 
  55: function() { keyPressedDigit(7); }, 
  56: function() { keyPressedDigit(8); }, 
  57: function() { keyPressedDigit(9); }, 
  45: function() { keyPressedPlusMinus(); }, 
  43: function() { keyPressedPlusMinus(); }, 
  48: function() { keyPressedDigit(0); }, 
  8: function() { keyPressedClear(); },
  127: function() { keyPressedClear(); },
  88: function() { keyPressedClear(); },
  99: function() { keyPressedClear(); },
  67: function() { keyPressedClear(); },
  120: function() { keyPressedClear(); },
  13: function() { keyPressedSubmit(); }
};

var keyText = {
  0: '1', 
  1: '2', 
  2: '3', 
  3: '4', 
  4: '5', 
  5: '6', 
  6: '7', 
  7: '8', 
  8: '9', 
  9: "\u00B1", 
  10: '0', 
  11: 'C',
  12: "Enter"
};

function getScore(msg) {
  var t = Math.max(0, time - Math.round((new Date().getTime() - startTime.getTime()) / 1000));
  return msg[0] + correctCount + msg[1] + incorrectCount + (t>0?(msg[2] + t):"");
}

function drawScore(ctx, x0, y0, width, height) {
  var msg = [
    ["Correct: ", " - Incorrect: ", " - Time Left: "],
    ["Good: ", ", Bad: ", ", Time: "],
    ["G: ", " B: ", " T: "],
    ["", "|", " "]
  ];  

  var bestSize = 0;
  var bestMsg = "";

  for (var i=0; i<msg.length; ++i) {  
    var msgi = getScore(msg[i]);
    var fontSize = ctx.getFontHeight(msgi, width, height, 'Arial');
    if (fontSize > bestSize) { 
      bestSize = fontSize;
      bestMsg = msgi;
    }
  }
  
  ctx.textAlign = "center";
  ctx.font = bestSize + "px 'Arial'";

  ctx.fillStyle = "#000000";
  ctx.fillText(bestMsg, x0 + width / 2, y0 + (height + fontSize * .875) / 2);
  ctx.fillStyle = "#bfbfbf";
  ctx.fillText(bestMsg, x0 + width / 2 - 1, y0 + (height + fontSize * .875) / 2 - 1);
}

function drawKeyPad(ctx, x0, y0, width, height) {
  var space = Math.min(width, height) / 32;
  var outline = space / 4;
  var shadow = 1;
  var sizeY = Math.min((width - space * 2) / 3, (height - space * 4) / 5);
  var sizeX = Math.min((width - space * 3) / 4, (height - space * 3) / 4);
  
  var size = Math.max(sizeX, sizeY);
  
  var gradObj1 = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj1.addColorStop(0, "#afafaf");
  gradObj1.addColorStop(1, "#8f8f8f");
  
  var gradObj2 = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj2.addColorStop(0, "#cfcfcf");
  gradObj2.addColorStop(1, "#afafaf");

  var gradObj3 = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj3.addColorStop(0, "#efefef");
  gradObj3.addColorStop(1, "#cfcfcf");

  var gradObj4 = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj4.addColorStop(0, "#8f8f8f");
  gradObj4.addColorStop(1, "#6f6f6f");

  keyPos = {};
  
  if (sizeY > sizeX) {
    var x1 = (width - 3 * size - 2 * space) / 2;
    var y1 = (height - 5 * size - 4 * space) / 2;
  
    var x = x0 + x1;
    var y = y0 + y1 + 4 * (size + space);
    var s = size * 3 + space * 2;
    
    ctx.fillStyle = keyDown==keyText[12]?(mouseDown?gradObj4:gradObj2):gradObj1;
    ctx.fillRect(x, y, s, size);
    keyPos[keyText[12]] = [x, y, x+s, y+size];
  
    ctx.fillStyle = keyDown==keyText[12]?(mouseDown?gradObj3:gradObj1):gradObj2;
    ctx.fillRect(x0 + x1 + outline, y0 + y1 + 4 * (size + space) + outline, size * 3 + space * 2 - 2 * outline, size - 2 * outline);
    
    var fontSize = ctx.getFontHeight(keyText[12], size * 3, size - 2 * outline, 'Arial');
    ctx.textAlign = "center";
    ctx.font = fontSize + "px 'Arial'";

    ctx.fillStyle = "#000000";
    ctx.fillText(keyText[12], x + size * 1.5 + space, y + fontSize * .875);
    ctx.fillStyle = "#3f3f3f";
    ctx.fillText(keyText[12], x + size * 1.5 + space - shadow, y + fontSize * .875 - shadow);
  } else {
    var x1 = (width - 4 * size - 3 * space) / 2;
    var y1 = (height - 4 * size - 3 * space) / 2;

    var x = x0 + x1 + 3 * (size + space);
    var y = y0 + y1;
    var s = size * 4 + space * 3;
    
    ctx.fillStyle = keyDown==keyText[12]?(mouseDown?gradObj4:gradObj2):gradObj1;
    ctx.fillRect(x, y, size, s);
    keyPos[keyText[12]] = [x, y, x+size, y+s];
    
    ctx.fillStyle = keyDown==keyText[12]?(mouseDown?gradObj3:gradObj1):gradObj2;
    ctx.fillRect(x0 + x1 + 3 * (size + space) + outline, y0 + y1 + outline, size - 2 * outline, size * 4 + space * 3 - 2 * outline);

    var fontSize = ctx.getFontHeight(keyText[12], size * 3, size - 2 * outline, 'Arial');
    ctx.textAlign = "center";
    ctx.font = fontSize + "px 'Arial'";

    ctx.fillStyle = "#000000";
    ctx.rotateText(keyText[12], x + size / 2 + fontSize * .35, y + size * 2 + 1.5 * space, Math.PI*3/2);
    ctx.fillStyle = "#3f3f3f";
    ctx.rotateText(keyText[12], x + size / 2 + fontSize * .35 - shadow, y + size * 2 + 1.5 * space + shadow, Math.PI*3/2);
  }

  var fontSize = ctx.getFontHeight("0", size - 2 * outline , size - 2 * outline, 'Arial');
  ctx.textAlign = "center";
  ctx.font = fontSize + "px 'Arial'";

  for (var j = 0; j<4; ++j) for (var i = 0; i<3; ++i) {
    ctx.fillStyle = keyDown==keyText[j * 3 + i]?(mouseDown?gradObj4:gradObj2):gradObj1;
    ctx.fillRect(x0 + x1 + i * (size + space), y0 + y1 + j * (size + space), size, size);
    
    ctx.fillStyle = keyDown==keyText[j * 3 + i]?(mouseDown?gradObj3:gradObj1):gradObj2;
    ctx.fillRect(x0 + x1 + i * (size + space) + outline, y0 + y1 + j * (size + space) + outline, size - 2 * outline, size - 2 * outline);

    ctx.fillStyle = "#000000";
    ctx.fillText(keyText[j * 3 + i], x0 + x1 + (i + .5) * size + i * space + outline, y0 + y1 + j * (size + space) + outline + fontSize * .875);
    ctx.fillStyle = "#3f3f3f";
    ctx.fillText(keyText[j * 3 + i], x0 + x1 + (i + .5) * size + i * space + outline - shadow, y0 + y1 + j * (size + space) + outline + shadow + fontSize * .875);
    
    keyPos[keyText[j * 3 + i]] = [x0 + x1 + i * (size + space), y0 + y1 + j * (size + space), x0 + x1 + i * (size + space) + size, y0 + y1 + j * (size + space) + size];
  }
}

function drawProblem(ctx, x0, y0, width, height) {
  var fontSizeRatio = .75;
  var fontName = 'Courier New Bold';
  
  var maxStr = max.addCommas();
  var minStr = min.addCommas();
  maxStr = maxStr.length > minStr.length ? maxStr : minStr;
  
  var fontHeight = ctx.getFontHeight(maxStr, width * maxStr.length / (maxStr.length + 1), height / 3.4 / fontSizeRatio, fontName);
  var fontSpace = fontHeight * fontSizeRatio;

  ctx.fillStyle = "#000000";
  ctx.font = fontHeight + "px '" + fontName + "'";
  
  ctx.textAlign = "right";
  ctx.fillText(pbm.a.addCommas(), x0 + width, y0 + fontSpace * 1);
  ctx.fillText(pbm.b.addCommas(), x0 + width, y0 + fontSpace * 2);
  
  ctx.textAlign = "left";
  ctx.fillText(pbm.o, x0, y0 + fontSpace * 2);
  
  ctx.lineWidth = Math.max(1, Math.floor(fontHeight / 10));
  ctx.drawLine(x0, y0 + fontSpace * 2 + ctx.lineWidth * 2, x0 + width, y0 + fontSpace * 2 + ctx.lineWidth * 2, "#000000");

  if (typed != "") {
    ctx.textAlign = "right";
    ctx.fillStyle = ansColor;
    ctx.fillText(parseFloat(typed).addCommas(), x0 + width, y0 + fontSpace * 3 + ctx.lineWidth * 3);
  }
}

var problemMap = {
 'Addition': 
   function () {
      var a = random(min, max);
      var b = random(min, max);
      return { 'a': a, 'b': b, o: "+", s: (a+b) };
   },
 'Subtraction with non negative result':
   function () {
      var a = random(min, max);
      var b = random(min, max);
      return { 'a': a+b, 'b': b, o: "-", s: a };
   },
 'Subtraction with any result':
   function () {
      var a = random(min, max);
      var b = random(min, max);
      return { 'a': a, 'b': b, o: "-", s: (a-b) };
   },
 'Multiplication': 
   function () {
      var a = random(min, max);
      var b = random(min, max);
      return { 'a': a, 'b': b, o: "\u00D7", s: (a*b) };
   },
 'Division': 
   function () {
      var a = random(min, max);
      var b = random(min, max);
      if (b == 0) b = 1;
      return { 'a': a*b, 'b': b, o: "\u00F7", s: a };
   }
}; 

function getParams(url) {
  var params = {};
  var urlSplit = url.split('?');
  if (urlSplit.length <= 1) return params;
  var nameValues = urlSplit[1].split('&');
  
  for (var i in nameValues) {
    var data = nameValues[i].split('=');
    params[unescape(data[0])] = unescape(data[1]);
  }
  
  return params;
}

var params = getParams(window.location.href);
   
var genProblem = problemMap[params["op"] || 'Addition'];
var min = parseFloat(params["min"] || 0);
var max = parseFloat(params["max"] || 12);
var pbm = genProblem();

var startTime = new Date();
var correctCount = 0;
var incorrectCount = 0;

var keepScore = true;
var time = parseFloat(params["time"] || 0);
var autoRefresh = null;

if (time > 0) {
  autoRefresh = setInterval("drawScreen(getCtx());", 1000);
  setTimeout("keepScore = false; clearInterval(autoRefresh); autoRefresh = null; drawScreen(getCtx());", time * 1000);
}

var typed = "";
var ansColor = "#000000";
var mouseDown = false;

function random(a, b) {
  var min = 0;
  var max = a;

  if (b) {
    min = a;
    max = b;
  }
  
  return Math.floor(Math.random() * (max - min) + min);
}

function listDivisors(n) {
  var result = [];
  if (n == 0) return result;
  
  var end = Math.ceil(Math.sqrt(Math.abs(n)));
  
  if (end * end == n) result.push(end);
  
  for (var i = end - 1; i > 0 ; i--) {
    if (n % i == 0) {
      result.unshift(i);
      result.push(n / i);
    }
  }
  
  return result
}

function XXXdrawScreen(ctx) {
  ctx.canvas.height = $(window).height();
  ctx.canvas.width = $(window).width();

  ctx.fillStyle = rgb(0, 255, 0);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var gradObj = ctx.createLinearGradient(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  gradObj.addColorStop(0, "#00009f");
  gradObj.addColorStop(1, "#00005f");
  ctx.fillStyle = gradObj;
  ctx.fillRect(1, 1, ctx.canvas.width-2, ctx.canvas.height-2);
  
  ctx.lineWidth = 1;
  ctx.drawLine(ctx.canvas.width * 1 / 3, 0.5, ctx.canvas.width * 2 / 3, 0.5, rgb(255, 0, 0));
  ctx.drawLine(ctx.canvas.width / 2, 0.5, ctx.canvas.width / 2, ctx.canvas.height-0.5, rgb(255, 0, 0));
  ctx.drawLine(ctx.canvas.width * 1 / 3, ctx.canvas.height-0.5, ctx.canvas.width * 2 / 3, ctx.canvas.height-0.5, rgb(255, 0, 0));

  ctx.drawLine(0.5, ctx.canvas.height * 1 / 3, 0.5, ctx.canvas.height * 2 / 3, rgb(255, 0, 0));
  ctx.drawLine(0.5, ctx.canvas.height / 2, ctx.canvas.width-0.5, ctx.canvas.height / 2, rgb(255, 0, 0));
  ctx.drawLine(ctx.canvas.width-0.5, ctx.canvas.height * 1 / 3, ctx.canvas.width-0.5, ctx.canvas.height * 2 / 3, rgb(255, 0, 0));
  
  var fontHeight = Math.min(ctx.canvas.width, ctx.canvas.height) / 7;
  ctx.fillStyle = rgb(255, 255, 255);
  ctx.textAlign = "center";
  ctx.font = fontHeight + "px 'Arial'";
  
  ctx.fillText(ctx.canvas.width.addCommas(), ctx.canvas.width/4, ctx.canvas.height / 2);
  ctx.rotateText(ctx.canvas.height.addCommas(), ctx.canvas.width/2, ctx.canvas.height / 4, Math.PI*3/2);
}

function XXXshowMouseClick(ctx, x, y) {
  drawScreen(ctx);
  var fontHeight = Math.min(ctx.canvas.width, ctx.canvas.height) / 14;
  ctx.fillStyle = rgb(255, 255, 255);
  ctx.textAlign = "center";
  ctx.font = fontHeight + "px 'Arial'";
  ctx.fillText(x.addCommas() + ", " + y.addCommas(), ctx.canvas.width*3/4, ctx.canvas.height*1/4 + fontHeight/2);
}