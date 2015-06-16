var ROUND_FACTOR = 1;
var MAX_VALS = 1000;
var DELAY = 250;
var xData = fillArray(MAX_VALS, 0);
var yData = fillArray(MAX_VALS, 0);
var zData = fillArray(MAX_VALS, 0);
var cData = fillArray(MAX_VALS, 0);
var plot;
  
$(document).ready(function(){
  chart.width = $(window).width();
  chart.height = $(window).height();
  
  plot = $.jqplot ('chart', [[xData], [yData], [zData], [cData]]);
  
  window.ondevicemotion = function(event) {
    addData(event.acceleration.x, event.acceleration.y, event.acceleration.z);
  }
  
  redrawGraph();
});

function genData(orgData) {
  result = [[]];
  for (var i=0; i<orgData.length; ++i) {
    result.push([i+1, orgData[i]]);
  }
  return result;
}

function fillArray(size, value) {
  result = [];
  for (var i=0; i<size; ++i) {
    result.push(value);
  }
  return result;
}

function addData(x, y, z) {
  xData.shift();
  yData.shift();
  zData.shift();
  cData.shift();

  xData.push(Math.round(x * ROUND_FACTOR) / ROUND_FACTOR);
  yData.push(Math.round(y * ROUND_FACTOR) / ROUND_FACTOR);
  zData.push(Math.round(z * ROUND_FACTOR) / ROUND_FACTOR);
  cData.push(Math.round(Math.sqrt(x * x + y * y + z * z) * ROUND_FACTOR) / ROUND_FACTOR);
}

function redrawGraph() {
  plot.series[0].data = genData(xData);
  plot.series[1].data = genData(yData);
  plot.series[2].data = genData(zData);
  plot.series[3].data = genData(cData);
  plot.replot({resetAxes:true});
  setTimeout(redrawGraph, DELAY);
}
