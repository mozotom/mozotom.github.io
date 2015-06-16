var allLinks = new Array();
var baseName = new Array();
var defaultInput = { 1: "Tree", 2: "Google", 3: "Wikipedia" }

function addLink(name, url, info, target) {
  allLinks[baseName.join("/") + "#" + info] = new Array(url, info, target);
}

function treeFind(value) {
  var result = "";
  
  if (value != "") {
    var val = value.toLowerCase();
    for (var name in allLinks) {
      if (name.toLowerCase().match(val)) {
        result += "<li><a href=\"" + allLinks[name][0] + "\" title=\"" + allLinks[name][1] + "\" target=\"" + allLinks[name][2] + "\">" + name.substring(0, name.indexOf("#")) + "</a></li>";
      }
    }
  }
  
  if (result != "") {
    result = "<ul>" + result + "</ul>";
  }
  
  treeFindResult.innerHTML = result;
}

function flip(tagId) {
  var branchTag = document.getElementById("branchTag_" + tagId);
  var imgTag = document.getElementById("imgTag_" + tagId);
  
  if (branchTag.style.display != "none") {
    imgTag.src = "plus.bmp";
    branchTag.style.display = "none";
  } else {
    imgTag.src = "minus.bmp";
    branchTag.style.display = "inline";
  }
}

function blurInput(k) {
  for (var i=1; i<=3; ++i) {
    document.getElementById("tdinput" + i).className = "medium";
    document.getElementById("input" + i).className = "inactive";
  }
  
  var inputK = document.getElementById("input" + k);
  if (inputK.value == "") {
    inputK.value = defaultInput[k];
  }
}

function focusInput(k) {
  for (var i=1; i<=3; ++i) {
    if (i == k) {
      document.getElementById("tdinput" + i).className = "large";
      document.getElementById("input" + i).className = "active";
      document.getElementById("input" + i).select();
    } else {
      document.getElementById("tdinput" + i).className = "small";
      document.getElementById("input" + i).className = "inactive";
    }
  }
}

function searchGoogle(event, value) {
  if (event.keyCode == 13) {
    parent.node.location.href='http://www.google.com/search?q=' + encodeURIComponent(value);
  }
}

function searchWikipedia(event, value) {
  if (event.keyCode == 13) {
    parent.node.location.href='http://en.wikipedia.org/wiki/' + encodeURIComponent(value);
  }
}
