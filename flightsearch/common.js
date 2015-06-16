var params = new Array()

function initParams() {
  var queryString = window.location.href.split("?", 2)[1]
  if (queryString != undefined) {
    var paramArray = queryString.split("&")
    for (i=0; i<paramArray.length; ++i) {
      var nameValue = paramArray[i].split("=", 2)
      params[nameValue[0]] = nameValue[1]
    }
  }
}

function getParam(name) {
  return params[name]
}

function getParam(name, defaultValue) {
  var value = params[name]
  return value==undefined?defaultValue:value
}

function getParamEquals(name, value) {
  return getParam(name) == value
}

function hasParams() {
  return params.length > 0
}

initParams()

function postRequest(action, queryString) {
  var form = document.createElement("form")
  form.setAttribute("method", "POST")
  form.setAttribute("action", action)
  
  var paramArray = queryString.split("&")
  for (i=0; i<paramArray.length; ++i) {
    var valueHolder = document.createElement("input")
    valueHolder.setAttribute("type", "hidden")

    var nameValue = paramArray[i].split("=", 2)
    valueHolder.setAttribute("name", nameValue[0])
    valueHolder.setAttribute("value", nameValue[1])

    form.appendChild(valueHolder);
  }

  form.submit()
}
