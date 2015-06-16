var flightMatirxRowCount = 0
var inputNames = [ "f", "t", "y", "m", "d" ]
var allowRowChanges = false

function addTD(row) {
  var col = document.createElement("td")
  row.appendChild(col)
  return col
}

function addCol(row, i, name) {
  var col = addTD(row)
  
  var input = document.createElement("input")
  col.appendChild(input)

  input.setAttribute("id", name + i)
  input.setAttribute("type", "text")
  input.setAttribute("size", "4")
  input.setAttribute("onchange", "updateSearchUrls()")
}

function addButton(row, i) {
  var col = addTD(row)

  var button = document.createElement("input")
  col.appendChild(button)
  
  button.setAttribute("id", "removeRow" + (i))
  button.setAttribute("type", "button")
  button.setAttribute("class", "button")
  button.setAttribute("onclick", "removeRow(" + (i) + ")")
  button.setAttribute("value", "Remove")
}

function removeRow(x) {
  --flightMatirxRowCount
  for (i=x; i<flightMatirxRowCount; ++i) {
    for (n in inputNames) {
      swapValues(i, i+1, inputNames[n])
    }
  }
  
  document.getElementById("flightMatrix").removeChild(document.getElementById("row" + flightMatirxRowCount))
}

function swapValues(i1, i2, n) {
  document.getElementById(n + i1).value = document.getElementById(n + i2).value
}

function addRow() {
  var flightMatrix = document.getElementById("flightMatrix")
  
  var row = document.createElement("tr")
  flightMatrix.appendChild(row)
  row.setAttribute("id", "row" + flightMatirxRowCount)
  
  for (var i in inputNames) {
    addCol(row, flightMatirxRowCount, inputNames[i])
  }
  
  if (allowRowChanges) addButton(row, flightMatirxRowCount)
  ++flightMatirxRowCount
}

function clearMatrix() {
  while (flightMatirxRowCount > 0) removeRow(flightMatirxRowCount - 1)
}

function setTripType(radioId, rowCount, allowRowChangesNewValue, tripVal) {
  allowRowChanges = allowRowChangesNewValue
  document.getElementById("addRowButton").setAttribute("type", allowRowChanges?"button":"hidden")
  document.getElementById(radioId).setAttribute("checked", "checked")

  if (searchType != tripVal) {
    searchType = tripVal
    clearMatrix()
  }
  while (flightMatirxRowCount < rowCount) addRow()
}

function setOneWayTrip() {
  setTripType("oneWayTrip", 1, false, "o")
}

function setReturnTrip() {
  setTripType("returnTrip", 2, false, "r")
  linkValues("f0", "t1")
  linkValues("f1", "t0")
}

function linkValues(n1, n2) {
  var e1 = document.getElementById(n1)
  var e2 = document.getElementById(n2)
  
  e1.setAttribute("onchange", n2 + ".value = " + n1 + ".value")
  e2.setAttribute("onchange", n1 + ".value = " + n2 + ".value")
}

function setMultiCityTrip() {
  setTripType("multiCityTrip", 1, true, "m")
}

function showForm() {
  switch (searchType) {
  case "o": setOneWayTrip(); break
  case "m": setMultiCityTrip(); break
  default: setReturnTrip()
  }
}

function populateValues() {
  for (var i=0; i<flights.length; ++i) {
	while (i >= flightMatirxRowCount) addRow()
	document.getElementById("f" + i).value = flights[i].from
	document.getElementById("t" + i).value = flights[i].to
	document.getElementById("y" + i).value = flights[i].year
	document.getElementById("m" + i).value = flights[i].month
	document.getElementById("d" + i).value = flights[i].day
  }

  if (passangerCount > 0) document.getElementById("passangerCount").value = passangerCount
  document.getElementById("nonStop").checked = nonStop?"checked":""
}
