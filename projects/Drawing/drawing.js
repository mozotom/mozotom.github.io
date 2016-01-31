var data = null;

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

function loadJSON(filename, callback) {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', filename, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}

function loadfile(filename) {
  loadJSON(filename, function(response) {
    data = JSON.parse(response);
    draw();

    var c = document.getElementById("drawing");
    c.addEventListener('mousemove', function(e) {
      draw(getMousePos(c, e));
    }, false);

  });
}

function getCoordinate(points, point, index) {
  var result = point[index];
  if ((isNaN(result)) && (result !== undefined)) {
    var expr = result.split(/[\s\+\-\*\/]+/);
    for (var i=0; i<expr.length; ++i) {
      if (isNaN(expr[i])) {
        result = result.replace(expr[i], getCoordinate(points, points[expr[i]], index));
      }
    }
    
    result = eval(result);
    point[index] = result;
  }
  return result;
}

function draw(mousePos) {
  var c = document.getElementById("drawing");
  var ctx = c.getContext("2d");

  var size = data.size;
  var scale = data.scale;
  var shift = data.shift;
  var font = data.font;
  var points = data.points;
  var lines = data.lines;
  var arcs = data.arcs;
  var measures = data.measures;
  
  c.width = size[0] * scale[0];
  c.height = size[1] * scale[0];
  
  var minDist = Number.MAX_VALUE;
  var minPoint = null;
  
  var P = {}
  for (var i in points) {
    P[i] = [(shift[0] + getCoordinate(points, points[i], 0)) * scale[0], c.height - (shift[1] + getCoordinate(points, points[i], 1)) * scale[1]];
    if (mousePos) {
      var d = distance([mousePos.x, mousePos.y], P[i]);
      if (d < minDist) {
        minDist = d;
        minPoint = i;
      }
    }
  }
  
  for (var i in lines) {
    var line = lines[i];
    var A = P[line[0]];
    var B = P[line[1]];
    var color = line[2];
    var lineWidth = line[3];
    
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    ctx.stroke();
  }

  for (var i in arcs) {
    var arc = arcs[i];
    var A = P[arc[0]];
    var rX = arc[1] * scale[0];
    var rY = arc[2] * scale[1];
    var a0 = arc[3] * Math.PI / 180;
    var a1 = arc[4] * Math.PI / 180;
    var angle = arc[5] * Math.PI / 180;
    var color = arc[6];
    var lineWidth = arc[7];
    
    ctx.save();
    ctx.beginPath();
    ctx.translate(A[0], A[1]);
    ctx.rotate(angle);
    ctx.scale(rX, rY);
    ctx.arc(0, 0, 1, a0, a1);
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  for (var i in measures) {
    var measure = measures[i];
    var A = P[measure[0]];
    var B = P[measure[1]];
    var color = measure[2];
    var lineWidth = measure[3];
    var offsetX = measure[4] * scale[0];
    var offsetY = measure[5] * scale[1];
    var C = [A[0] + offsetX * 3 / 4, A[1] - offsetY * 3 / 4];
    var D = [B[0] + offsetX * 3 / 4, B[1] - offsetY * 3 / 4];
    var C2 = [A[0] + offsetX / 2, A[1] - offsetY / 2];
    var D2 = [B[0] + offsetX / 2, B[1] - offsetY / 2];
    var T = [(C2[0] + D2[0]) / 2, (C2[1] + D2[1]) / 2];
    var text = distance(points[measure[0]], points[measure[1]]);
    
    var dX = A[0] - B[0];
    var dY = A[1] - B[1];
    if (dX == 0) {
      var angle = Math.PI / 2;
    } else {
      var angle = Math.atan(dY / dX);
    }
    
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(T[0], T[1]);
    ctx.rotate(angle);
    ctx.translate(-T[0], -T[1]);
    var txtWidth = ctx.measureText(text).width + 10;
    ctx.fillText(text, T[0], T[1]);
    ctx.restore();

    var lineLen = distance(C2, D2);
    var drawLen = (lineLen - txtWidth) / 2;
    var drawPart = drawLen / lineLen;
    
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    if (drawPart > 0) {
      ctx.moveTo(C2[0], C2[1]);
      ctx.lineTo(C2[0] + (D2[0] - C2[0]) * drawPart, C2[1] + (D2[1] - C2[1]) * drawPart);
      ctx.moveTo(D2[0], D2[1]);
      ctx.lineTo(D2[0] + (C2[0] - D2[0]) * drawPart, D2[1] + (C2[1] - D2[1]) * drawPart);
    }
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(C[0], C[1]);
    ctx.moveTo(B[0], B[1]);
    ctx.lineTo(D[0], D[1]);
    ctx.stroke();
  }

  if (minDist < 50) {
    ctx.font = '36pt Times New Roman';
    ctx.fillStyle = 'red';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(minPoint, P[minPoint][0], P[minPoint][1]);
  }
}

function distance(A, B) {
  return Math.round(Math.sqrt((A[0] - B[0]) * (A[0] - B[0]) + (A[1] - B[1]) * (A[1] - B[1])) * 100) / 100;
}

function getMousePos(c, e) {
  var rect = c.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
