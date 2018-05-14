// Monthly stock prices from https://query1.finance.yahoo.com/v7/finance/download/%5EGSPC?period1=-630957600&period2=1526101200&interval=1mo&events=history&crumb=nsVSUpVHJuN
var dataUrl = 'http://mozotom.github.io/projects/stock-market/sp500.csv';
//var dataUrl = 'sp500.csv';
var data;
var dataName = "S&P 500";
var timeframeMonths = [12, 36, 60, 84, 120, 180, 240, 360];
var percentiles = [.01, .05, .10, .20, .25, .50, .75, .80, .90, .95, .99];
var percentiles = getSequence(0.05, .96, 0.05);

function getSequence(start, end, step = 1) {
  result = [];
  for (var i = start; i <= end; i += step) {
	result.push(i);
  }
  return result;
}

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
      if (type.indexOf('text') !== 1) {
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
	runSim(data, timeframeMonths);
  } else {
    load(dataUrl, v => { data = v ; runSim(v, timeframeMonths); });
  }
}

function runSim(data, timeframeMonths) {
  const dataLines = data.split('\n');
  const stockValues = [];
  var k = 0;
  for (var i in dataLines) {
	const val = dataLines[i].split(',')[5];
	if (val && !isNaN(val)) {
	  stockValues[k++] = Number(val);
	}
  }

  const apy = [];
  for (var k in timeframeMonths) {
	apy[k] = [];
    for (var i = 0; i < stockValues.length - timeframeMonths[k]; ++i) {
	  apy[k][i] = calcAPY(timeframeMonths[k], calcFinalValueFromStock(stockValues.slice(i, i + timeframeMonths[k])));
    }
    apy[k].sort((a,b) => a - b);
  }
  
  _('result').innerHTML = '<table>' + createDistributionTable(timeframeMonths, apy, percentiles, dataLines[1].split(',')[0], dataLines[dataLines.length - 1].split(',')[0]) + '</table>';
}

function createHeader(startDate, endDate, span) {
  return '<tr><td class="title" colspan="' + span + '">' + dataName + ' annualized average return from ' + startDate + ' to ' + endDate + ' monthly</td></tr>';
}

function createDistributionTable(timeframeMonths, vals, probabilities, startDate, endDate) {
  var r = createHeader(startDate, endDate, 1 + timeframeMonths.length);
  r += '<tr>';
  r += '<th>Percentile</th>';
  for (var i in timeframeMonths) {
    r += '<th>' + (timeframeMonths[i] / 12) + '-Year APY</th>';
  }
  r += '</tr>';

  for (var k in probabilities) {
	r += '<tr>';
	r += '<th class="value">' + (Math.round((probabilities[k] * 100000)) / 1000) + '%</th>';
	for (var i in timeframeMonths) {
	  r += '<td class="value">' + (getPercentile(vals[i], probabilities[k]) * 100).toFixed(2) + '%</td>';
	}
	r += '</tr>';
  }

  r += '<tr>';
  r += '<th class="datasize">Data size</th>';
  for (var i in timeframeMonths) {
    r += '<td class="value datasize">' + vals[i].length + '</td>';
  }
  r += '</tr>';

  return r;
}

function getPercentile(vals, percentile) {
  const i = Math.floor(vals.length * percentile);
  const j = Math.ceil(vals.length * percentile);
  const k = vals.length * percentile;
  return vals[i] + (vals[j] - vals[i]) * (k - i);
}

function calcFinalValueFromStock(stockValues) {
  var totalShares = 0;
  for (var i in stockValues) {
	totalShares += 1 / stockValues[i];
  }
  return totalShares * stockValues[stockValues.length - 1];
}

function calcAPY(timeframeMonths, finalValue) {
  var minAPY = -.9999;
  var maxAPY = 100;
  var minVal = calcFinalValueFromAPY(timeframeMonths, minAPY);
  var maxVal = calcFinalValueFromAPY(timeframeMonths, maxAPY);
  var iter = 0;
  while (Math.abs(maxAPY - minAPY) > 0.000001) {
	++iter;
	var apy = (maxAPY + minAPY) / 2;
	var val = calcFinalValueFromAPY(timeframeMonths, apy);
	if (val < finalValue) {
	  minAPY = apy;
      minVal = val;
	} else {
	  maxAPY = apy
      maxVal = val;
	}
  }
  return (minAPY + maxAPY) / 2;
}

function calcFinalValueFromAPY(timeframeMonths, apy) {
  const mult = (1 + apy / 12);
  var finalValue = 0;
  for (var i=0; i<timeframeMonths; ++i) {
	finalValue *= mult;
	finalValue += 1;
  }
  return finalValue;
}