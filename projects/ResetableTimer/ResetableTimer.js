// Copyright @2012 Tomasz Mozolewski

function getCtx() {
  return $("#canvas")[0].getContext('2d');
}

$(document).ready(function() {
  $("#canvas").click(function(e) {
    resetTimer();
    tick();
  });

  tick();
});

$(window).resize(function() {
  tick();
});

$(window).keypress(function(e) {
  resetTimer();
  tick();
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

Number.prototype.formatTime = function() {
  var n = this;
  n = Math.floor(n / 100);
  var ds = n % 10;
  n = Math.floor(n / 10);
  var s = ("0" + (n % 60)).slice(-2);
  n = Math.floor(n / 60);
  var m = ("0" + (n % 60)).slice(-2);
  n = Math.floor(n / 60);
  var h = ("0" + (n % 60)).slice(-2);

  return (h!='00'?(h + ':'):'') + (m!='00'||h!='00'?(m + ':'):'') + s + '.' + ds;
}

function rgb(r, g, b) {
  return "rgb(" + r +", " + g +", " + b +")"
}

function drawScreen(ctx) {
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

function showMousePos(ctx, x, y) {
  drawScreen(ctx);
  var fontHeight = Math.min(ctx.canvas.width, ctx.canvas.height) / 14;
  ctx.fillStyle = rgb(255, 255, 255);
  ctx.textAlign = "center";
  ctx.font = fontHeight + "px 'Arial'";

  ctx.fillText(x.addCommas() + ", " + y.addCommas(), ctx.canvas.width*3/4, ctx.canvas.height*3/4 + fontHeight/2);
}

function showMouseClick(ctx, x, y) {
  drawScreen(ctx);
  var fontHeight = Math.min(ctx.canvas.width, ctx.canvas.height) / 14;
  ctx.fillStyle = rgb(255, 255, 255);
  ctx.textAlign = "center";
  ctx.font = fontHeight + "px 'Arial'";
  ctx.fillText(x.addCommas() + ", " + y.addCommas(), ctx.canvas.width*3/4, ctx.canvas.height*1/4 + fontHeight/2);
}


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
var resetTime = (params["t"] || 120) * 1000;
var display = params["d"] || "c";
var style = params["s"] || "arc";
var clock = params["c"] || "y";

var half_snd = new Audio(params["half"] || "sounds/half0.mp3");
var finish_snd = new Audio(params["finish"] || "sounds/finish0.mp3");

half_snd.load();
finish_snd.load();

var alertTime = resetTime / 2;
var startTime = new Date().getTime();
var reverseTime = 0;

var tickThread = setInterval("tick()", 10);
var tickWork = true;

var soundLoader = setInterval("waitForSound()", 100);

function waitForSound() {
  if (half_snd.readyState > 2 && finish_snd.readyState > 2) {
    clearInterval(soundLoader);
    half_btn.style.display = "none";
    finish_btn.style.display = "none";
    resetTimer();
    tickWork = false;
  }
}

function playSound(snd) {
  if (snd.readyState > 2) {
    half_snd.pause();
    finish_snd.pause();
    snd.currentTime = 0;
    snd.play();
  }
}

function tick() {
  if (tickWork) return;
  tickWork = true;

  var now = new Date().getTime();
  var elapsed = now - startTime;

  if (elapsed > resetTime) {
    // Time exipred - sound buzzer
    playSound(finish_snd);
    resetTimer();
    elapsed = 0;
  } else if (resetTime - elapsed < alertTime) {
    // Half time - sound chirp
    alertTime = alertTime / 2;
    reverseTime = now + 250;
    playSound(half_snd);
  } 

  if (reverseTime < now) {
    var c0 = "red";
    var c1 = "green";
  } else {
    var c0 = "black";
    var c1 = "yellow";
  }
  
  showDial(getCtx(), elapsed, resetTime, c0, c1);
  tickWork = false;
}


function resetTimer() {
  alertTime = resetTime / 2;
  startTime = new Date().getTime();
  reverseTime = 0;
}

function showDial(ctx, msElapsed, msTotal, c0, c1) {
  ctx.canvas.width = $(window).width();
  ctx.canvas.height = $(window).height();

  var r = display=="c"?Math.min(ctx.canvas.width, ctx.canvas.height) / 2:Math.sqrt(ctx.canvas.width * ctx.canvas.width + ctx.canvas.height * ctx.canvas.height) / 2;
  var x0 = ctx.canvas.width / 2;
  var y0 = ctx.canvas.height / 2;
  var s = - Math.PI / 2;
  var f = 2 * Math.PI;
  var d = msElapsed / msTotal;


  if (style == "arc") {
    if (d > 0) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.arc(x0, y0, r, s, s + f * d, false);
      ctx.fillStyle = c0;
      ctx.fill();
    }

    if (d < 1) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.arc(x0, y0, r, s, s + f * d, true);
      ctx.fillStyle = c1;
      ctx.fill();
    }
  } else if (style == "shrink") {
    if (d > 0) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.arc(x0, y0, r, 0, f, false);
      ctx.fillStyle = c0;
      ctx.fill();
    }

    if (d < 1) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.arc(x0, y0, r * (1-d), 0, f, true);
      ctx.fillStyle = c1;
      ctx.fill();
    }
  }

  if (clock == "y") {  
    var txt = (msTotal - msElapsed).formatTime();
    var fontHeight = ctx.getFontHeight(txt, 3 * Math.min(ctx.canvas.width / 2, r) / 2, Math.min(ctx.canvas.height / 2, r), 'Arial');
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = fontHeight + "px 'Arial'";
    ctx.fillText(txt, x0, y0 + fontHeight / 4);
  }
}
