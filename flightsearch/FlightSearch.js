var searchEngines = { "Southwest": searchSouthwest, "Orbitz": searchOrbitz }

var searchType = getParam("s") // o = one way, r = return, m = multi-city
var flights = new Array()
var nonStop = getParamEquals("n", "y") // y - only non stop flights (if supported)
var passangerCount = getParam("p", 1) // number of passangers (default 1)
var engineType = getParam("e") // see keys in searchEngines - if specified, flight search will start automatically

function Flight(from, to, year, month, day) {
  this.from = from
  this.to = to
  this.year = year
  this.month = month
  this.day = day
  
  this.toString = function toString() {
    return from + "-->" + to + " " + month + "/" + day + "/" + year
  }
}

function initFlightParams() {
  var i=0
  while (getParam("f" + i) != undefined) {
	flights.push(new Flight(getParam("f" + i), getParam("t" + i), getParam("y" + i), getParam("m" + i), getParam("d" + i)))
	++i
  }
}

initFlightParams()

function getParameterString() {
  var paramStr = "s=" + searchType

  for (var i=0; i<flightMatirxRowCount; ++i) {
	paramStr += "&f" + i + "=" + document.getElementById("f" + i).value
	paramStr += "&t" + i + "=" + document.getElementById("t" + i).value
	paramStr += "&y" + i + "=" + document.getElementById("y" + i).value
	paramStr += "&m" + i + "=" + document.getElementById("m" + i).value
	paramStr += "&d" + i + "=" + document.getElementById("d" + i).value
  }
  
  paramStr += document.getElementById("nonStop").checked?"&n=y":""
  paramStr += "&p=" + document.getElementById("passangerCount").value

  return paramStr
}

function addSearchUrl(element, searchEngineName, searchEngineParam) {
  var link = document.createElement("a")
  link.setAttribute("href", location.href.split("?")[0] + "?" + getParameterString() + searchEngineParam)
  link.innerText = searchEngineName
  element.appendChild(link)
}

function addSearchUrls(element) {
  addSearchUrl(element, "Save data", "")

  for (var searchEngine in searchEngines) {
    element.appendChild(document.createTextNode(" - "))
    addSearchUrl(element, searchEngine, "&e=" + searchEngine)
  }
  
  return element
}

function updateSearchUrls() {
  var searchUrls = document.getElementById("searchUrls")
  searchUrls.innerHTML = ""
  addSearchUrls(searchUrls)
}

function initPage() {
  showForm()
  populateValues()
  updateSearchUrls()
  if (engineType != undefined) searchEngines[engineType]()
}
