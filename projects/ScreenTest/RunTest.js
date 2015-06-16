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

var colors = params["C"] || 1;
var channelSteps = Math.pow(2, colors);
var colorSteps = Math.pow(channelSteps, 3);

var patterns = [];
var patternFuncs = { Combo: drawCombo, Solid: drawSolid, Horizontal: drawHorizontal, Vertical: drawVertical, Checker: drawChecker };
for (key in patternFuncs) if (params[key]) patterns.push(key);

var iColor = 0;
var iPattern = 0;

function getCtx() {
  return $("#canvas")[0].getContext('2d');
}

$(document).ready(function() {
  $("#canvas").click(function(e) {
    showMouseClick(getCtx(), e.pageX, e.pageY);
  });

  drawScreen(getCtx());
});

$(window).resize(function() {
  drawScreen(getCtx());
});

CanvasRenderingContext2D.prototype.drawLine = function (x0, y0, x1, y1, c) {
  this.strokeStyle  = c;
  this.beginPath();
  this.moveTo(x0, y0);
  this.lineTo(x1, y1);
  this.stroke();
};

function rgb(r, g, b) {
  return "rgb(" + r +", " + g +", " + b +")"
}

function drawScreen(ctx) {
  ctx.canvas.height = $(window).height();
  ctx.canvas.width = $(window).width();

  patternFuncs[patterns[iPattern]](ctx, getR(iColor), getG(iColor), getB(iColor), 0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getR(i) {
  i = Math.floor(i / channelSteps / channelSteps);
  return Math.floor(255 * (i % channelSteps) / (channelSteps - 1));
}

function getG(i) {
  i = Math.floor(i / channelSteps);
  return Math.floor(255 * (i % channelSteps) / (channelSteps - 1));
}

function getB(i) {
  return Math.floor(255 * (i % channelSteps) / (channelSteps - 1));
}

function drawCombo(ctx, r, g, b, x0, y0, xd, yd) {
  ctx.fillStyle = rgb(0, 0, 0);
  ctx.fillRect(x0, y0, xd, yd);
  
  var iLen = Math.ceil(Math.sqrt(colorSteps));
  var xMax = Math.floor(xd / 2);
  var yMax = Math.floor(yd / 2);
  
  drawBoxes(ctx, 0, 0, xMax, yMax, drawSolid, iLen);
  drawBoxes(ctx, xMax, 0, 2 * xMax, yMax, drawHorizontal, iLen);
  drawBoxes(ctx, 0, yMax, xMax, 2 * yMax, drawVertical, iLen);
  drawBoxes(ctx, xMax, yMax, 2 * xMax, 2 * yMax, drawChecker, iLen);
  
  iColor = -1;
}

function drawBoxes(ctx, x0, y0, x1, y1, f, iLen) {
  var xd = Math.floor((x1 - x0) / iLen);
  var yd = Math.floor((y1 - y0) / iLen);
  
  for (var i=0; i<colorSteps; ++i) {
    f(ctx, getR(i), getG(i), getB(i), x0 + (i % iLen) * xd, y0 + Math.floor(i / iLen) * yd, xd, yd);

    drawSolid(ctx, 0, 0, 0, x0 + (i % iLen) * xd, y0 + Math.floor(i / iLen) * yd + yd, x1, y1);
    drawSolid(ctx, 0, 0, 0, x0 + (i % iLen) * xd + xd, y0 + Math.floor(i / iLen) * yd, x1, y1);
    
    ctx.strokeStyle="#FFFFFF";
    ctx.strokeRect(x0 + (i % iLen) * xd, y0 + Math.floor(i / iLen) * yd, xd, yd);
  }
}

function drawSolid(ctx, r, g, b, x0, y0, xd, yd) {
  ctx.fillStyle = rgb(r, g, b);
  ctx.fillRect(x0, y0, xd, yd);
}

function drawHorizontal(ctx, r, g, b, x0, y0, xd, yd) {
  drawSolid(ctx, 255 - r, 255 - g, 255 - b, x0, y0, xd, yd);
  ctx.fillStyle = rgb(r, g, b);
  for (var i=0; i<yd; i+=2) {
    ctx.fillRect(x0, y0 + i, xd, 1);
  }
}

function drawVertical(ctx, r, g, b, x0, y0, xd, yd) {
  drawSolid(ctx, 255 - r, 255 - g, 255 - b, x0, y0, xd, yd);
  ctx.fillStyle = rgb(r, g, b);
  for (var i=0; i<xd; i+=2) {
    ctx.fillRect(x0 + i, y0, 1, yd);
  }
}

function drawChecker(ctx, r, g, b, x0, y0, xd, yd) {
  drawSolid(ctx, 255 - r, 255 - g, 255 - b, x0, y0, xd, yd);
  ctx.fillStyle = rgb(r, g, b);
  ctx.fillRect(x0, y0 + 1, 1, 1);
  ctx.fillRect(x0 + 1, y0, 1, 1);
  copyPattern(ctx, 2, x0, y0, xd, yd);
}

function copyPattern(ctx, size, x0, y0, xd, yd) {
  if ((size < xd) || (size < yd)) {
    var img = ctx.getImageData(x0, y0, size, size);
    ctx.putImageData(img, x0, y0 + size);
    ctx.putImageData(img, x0 + size, y0);
    ctx.putImageData(img, x0 + size, y0 + size);
    copyPattern(ctx, size * 2, x0, y0, xd, yd);
  }
}

function showMouseClick(ctx, x, y) {
  if (ctx.canvas.height > ctx.canvas.width) {
    if (y > ctx.canvas.height / 2) {
      nextScreen(ctx);
    } else {
      prevScreen(ctx);
    }
  } else {
    if (x > ctx.canvas.width / 2) {
      nextScreen(ctx);
    } else {
      prevScreen(ctx);
    }
  }
  
  drawScreen(ctx);
}

function nextScreen(ctx) {
  iColor = (iColor + 1) % colorSteps;
  if (iColor == 0) {
    iPattern = (iPattern + 1) % patterns.length;
  }
}

function prevScreen(ctx) {
  if (iColor <= 0) {
    iPattern = (iPattern + patterns.length - 1) % patterns.length;
    iColor = 0;
  }
  iColor = (iColor + colorSteps - 1) % colorSteps;
}