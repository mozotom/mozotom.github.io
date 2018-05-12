// Monthly stock prices from https://query1.finance.yahoo.com/v7/finance/download/%5EGSPC?period1=-630957600&period2=1526101200&interval=1mo&events=history&crumb=nsVSUpVHJuN
var dataUrl = "http://mozotom.github.io/projects/stock-market/sp500.csv";
//var dataUrl = "sp500.csv";
var data;

function _(id) {
  return document.getElementById(id);
}

function load(url, f) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader('Content-Type');
      if (type.indexOf("text") !== 1) {
        f(request.responseText);
      }
    }
  }
}

function init() {
  go();
}

function go() {
  if (data) {
	runSim(data, _("timeframe").value);
  } else {
    load(dataUrl, v => { data = v ; runSim(v, _("timeframe").value); });
  }
}

function runSim(data, timeframeMonths) {
  const dataLines = data.split('\n');
  const stockValues = [];
  for (var i = 1; i < dataLines.length; ++i) {
	stockValues[i - 1] = dataLines[i].split(',')[5];
  }
  
  
  _("result").innerText = stockValues.length;
}