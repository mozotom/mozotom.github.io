$(document).ready(function() {
  drawScreen($("#canvas")[0].getContext('2d'));
});

$(window).resize(function() {
  drawScreen($("#canvas")[0].getContext('2d'));
});

CanvasRenderingContext2D.prototype.drawLine = function (x0, y0, x1, y1, c) {
  this.strokeStyle  = c;
  this.beginPath();
  this.moveTo(x0, y0);
  this.lineTo(x1, y1);
  this.stroke();
};

CanvasRenderingContext2D.prototype.rotateText = function(str, x0, y0, angle) {
  var sin = Math.sin(Math.PI*3/2);
  var cos = Math.cos(Math.PI*3/2);

  this.save();
  this.translate(x0, y0);
  this.transform(cos, sin, -sin, cos, 0, 0);
  this.fillText(str, 0, 0);
  this.restore();
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
