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
    draw(JSON.parse(response));
  });
}

function draw(data) {
  var c = document.getElementById("drawing");
  var ctx = c.getContext("2d");

  var size = data.size;
  var scale = data.scale;
  var shift = data.shift;
  var font = data.font;
  var points = data.points;
  var lines = data.lines;
  var measures = data.measures;
  
  c.width = size[0] * scale[0];
  c.height = size[1] * scale[0];
  
  var P = {}
  for (var i in points) {
    P[i] = [(shift[0] + points[i][0]) * scale[0], c.height - (shift[1] + points[i][1]) * scale[1]];
  }
  
  for (var i in lines) {
    var line = lines[i];
    var A = P[line[0]];
    var B = P[line[1]];
    var color = line[2];
    var weight = line[3];
    
    ctx.beginPath();
    ctx.lineWidth = weight;
    ctx.strokeStyle = color;
    ctx.moveTo(A[0], A[1]);
    ctx.lineTo(B[0], B[1]);
    ctx.stroke();
  }

  for (var i in measures) {
    var measure = measures[i];
    var A = P[measure[0]];
    var B = P[measure[1]];
    var color = measure[2];
    var weight = measure[3];
    var offsetX = measure[4] * scale[0];
    var offsetY = measure[5] * scale[1];
    var C = [A[0] + offsetX, A[1] - offsetY];
    var D = [B[0] + offsetX, B[1] - offsetY];
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
    ctx.lineWidth = weight;
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
}

function distance(A, B) {
  return Math.round(Math.sqrt((A[0] - B[0]) * (A[0] - B[0]) + (A[1] - B[1]) * (A[1] - B[1])) * 100) / 100;
}