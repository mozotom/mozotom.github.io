// Copyright @2013 Tomasz Mozolewski

var pages = ["about", "contact", "documents", "reference", "community"];
var curPage = "about";
var imgs = ["landing-sign.jpg", "entrance-street.jpg", "dardenne-woods-sunset.jpg", "dardenne-woods-sky.jpg", "dardenne-woods-flag.jpg"];
var imgsLoad = [];
var curImg = 2;
var imgCron;

function resetImgCron() {
  if (imgCron) clearInterval(imgCron);
  imgCron = setInterval("setRandomImg()", 60 * 1000);
}

function e(id) {
  return document.getElementById(id);
}

function show(name) {
  for (var i in pages) {
    e("page-" + pages[i]).style.display = "none";
  }
  e("page-" + name).style.display = "block";
  curPage = name;
}

function setAction(name) {
  e("button-" + name).onclick = function() { if (name != curPage) { show(name); resetImgCron();  setRandomImg(); } };
}

function loadImages() {
  for (var i in imgs) {
    imgsLoad.push(new Image().src = "img/" + imgs[i]);
  }
}

function init() {
  for (var i in pages) {
    setAction(pages[i]);
  }
  setImage(curImg);
  show(curPage);
  resetImgCron();
  setTimeout(loadImages, 100);
}

function setImage(i) {
  document.body.style.backgroundImage = "url('img/" + imgs[curImg = i] + "')";
}

function setRandomImg() {
  var i = curImg;
  while ((i == curImg) && (imgs.length > 1)) {
    i = Math.floor(Math.random() * imgs.length);
  }
  setImage(i);
}
