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
  load("sp500.csv", v => { _("result").innerText = v; });
}
