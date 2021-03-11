'use strict'

window.onload = window.onresize = function () {
  var body = document.querySelector('body')
  var height = window.innerHeight;
  body.style.height = height + "px";
}