(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _Ziggurat = require("../../src/lib/Ziggurat");

var _Ziggurat2 = _interopRequireDefault(_Ziggurat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight - 4;
  var center = { x: width / 2, y: height / 2 };

  // Canvas setup
  canvas.height = height;
  canvas.width = width;

  var ziggurat = new _Ziggurat2.default();
  var paintDrops = new Array(500);
  var xMean = center.x;
  var yMean = center.y;
  var sd = 180;
  var colorMean = 5.0237271;
  var colorSD = 0.65;

  for (var i = 0; i < paintDrops.length; i++) {
    paintDrops[i] = {
      x: ziggurat.nextGaussian(),
      y: ziggurat.nextGaussian(),
      color: ziggurat.nextGaussian()
    };
  }

  for (var _i = 0; _i < paintDrops.length; _i++) {
    var xVal = paintDrops[_i].x * sd + xMean;
    var yVal = paintDrops[_i].y * sd + yMean;
    var colorVal = paintDrops[_i].color * colorSD + colorMean;

    ctx.beginPath();
    ctx.arc(xVal, yVal, 30, 0, Math.PI * 2, false);
    ctx.fillStyle = toHex(colorVal);
    ctx.fill();
    ctx.closePath();
  }

  function toHex(n) {
    var r = 255 - (n / 10 * 255 | 0);
    var g = n / 10 * 255 | 0;

    return '#' + (r ? (r = r.toString(16), r.length == 2 ? r : '0' + r) : '00') + (g ? (g = g.toString(16), g.length == 2 ? g : '0' + g) : '00') + '00';
  }
};

},{"../../src/lib/Ziggurat":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Ziggurat;
function Ziggurat() {

  var jsr = 123456789;

  var wn = Array(128);
  var fn = Array(128);
  var kn = Array(128);

  function RNOR() {
    var hz = SHR3();
    var iz = hz & 127;
    return Math.abs(hz) < kn[iz] ? hz * wn[iz] : nfix(hz, iz);
  }

  this.nextGaussian = function () {
    return RNOR();
  };

  function nfix(hz, iz) {
    var r = 3.442619855899;
    var r1 = 1.0 / r;
    var x;
    var y;
    while (true) {
      x = hz * wn[iz];
      if (iz == 0) {
        x = -Math.log(UNI()) * r1;
        y = -Math.log(UNI());
        while (y + y < x * x) {
          x = -Math.log(UNI()) * r1;
          y = -Math.log(UNI());
        }
        return hz > 0 ? r + x : -r - x;
      }

      if (fn[iz] + UNI() * (fn[iz - 1] - fn[iz]) < Math.exp(-0.5 * x * x)) {
        return x;
      }
      hz = SHR3();
      iz = hz & 127;

      if (Math.abs(hz) < kn[iz]) {
        return hz * wn[iz];
      }
    }
  }

  function SHR3() {
    var jz = jsr;
    var jzr = jsr;
    jzr ^= jzr << 13;
    jzr ^= jzr >>> 17;
    jzr ^= jzr << 5;
    jsr = jzr;
    return jz + jzr | 0;
  }

  function UNI() {
    return 0.5 * (1 + SHR3() / -Math.pow(2, 31));
  }

  function zigset() {
    // seed generator based on current time
    jsr ^= new Date().getTime();

    var m1 = 2147483648.0;
    var dn = 3.442619855899;
    var tn = dn;
    var vn = 9.91256303526217e-3;

    var q = vn / Math.exp(-0.5 * dn * dn);
    kn[0] = Math.floor(dn / q * m1);
    kn[1] = 0;

    wn[0] = q / m1;
    wn[127] = dn / m1;

    fn[0] = 1.0;
    fn[127] = Math.exp(-0.5 * dn * dn);

    for (var i = 126; i >= 1; i--) {
      dn = Math.sqrt(-2.0 * Math.log(vn / dn + Math.exp(-0.5 * dn * dn)));
      kn[i + 1] = Math.floor(dn / tn * m1);
      tn = dn;
      fn[i] = Math.exp(-0.5 * dn * dn);
      wn[i] = dn / m1;
    }
  }
  zigset();
}

},{}]},{},[1])

//# sourceMappingURL=app.js.map
