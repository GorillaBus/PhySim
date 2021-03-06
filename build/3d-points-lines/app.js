(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _AnimationPlayer = require("../../src/lib/AnimationPlayer");

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight - 4;
  var center = { x: width / 2, y: height / 2 };

  canvas.height = height;
  canvas.width = width;

  var player = new _AnimationPlayer2.default({ fps: 90 });

  var fl = 900;
  var points = [];
  var centerZ = 1000;
  var needsUpdate = true;

  points[0] = { x: -500, y: -500, z: 500 };
  points[1] = { x: 500, y: -500, z: 500 };
  points[2] = { x: 500, y: -500, z: -500 };
  points[3] = { x: -500, y: -500, z: -500 };
  points[4] = { x: -500, y: 500, z: 500 };
  points[5] = { x: 500, y: 500, z: 500 };
  points[6] = { x: 500, y: 500, z: -500 };
  points[7] = { x: -500, y: 500, z: -500 };

  // Demo player setup
  player.setUpdateFn(update);
  player.play();

  ctx.translate(center.x, center.y);

  // Frame drawing function
  function update() {
    if (needsUpdate) {
      ctx.clearRect(-center.x, -center.y, width, height);

      project();

      ctx.beginPath();
      drawLine(0, 1, 2, 3, 0);
      drawLine(4, 5, 6, 7, 4);
      drawLine(0, 4);
      drawLine(1, 5);
      drawLine(2, 6);
      drawLine(3, 7);
      ctx.stroke();
      needsUpdate = false;
    }
  }

  function project() {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var scale = fl / (fl + p.z + centerZ);

      p.sx = p.x * scale;
      p.sy = p.y * scale;
    }
  }

  function drawLine() {
    var p = points[arguments[0]];
    ctx.moveTo(p.sx, p.sy);

    for (var i = 1; i < arguments.length; i++) {
      p = points[arguments[i]];
      ctx.lineTo(p.sx, p.sy);
    }
  }

  function translateModel(x, y, z) {
    for (var i = 0; i < points.length; i++) {
      points[i].x += x || 0;
      points[i].y += y || 0;
      points[i].z += z || 0;
    }
    needsUpdate = true;
  }

  /**
   *  Rotate X axis:
   *    y1 = y * cos(angle) - z * sin(angle)
   *    z1 = z * cos(angle) + y * sin(angle)
   */
  function rotateX(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var y = p.y * cos - p.z * sin;
      var z = p.z * cos + p.y * sin;
      p.y = y;
      p.z = z;
    }
    needsUpdate = true;
  }

  /**
   *  Rotate Z axis:
   *    x1 = x * cos(angle) - y * sin(angle)
   *    y1 = y * cos(angle) + x * sin(angle)
   */
  function rotateZ(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var x = p.x * cos - p.y * sin;
      var y = p.y * cos + p.x * sin;
      p.x = x;
      p.y = y;
    }
    needsUpdate = true;
  }

  /**
   *  Rotate X axis:
   *    y1 = y * cos(angle) - z * sin(angle)
   *    z1 = z * cos(angle) + y * sin(angle)
   */
  function rotateX(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var y = p.y * cos - p.z * sin;
      var z = p.z * cos + p.y * sin;
      p.y = y;
      p.z = z;
    }
    needsUpdate = true;
  }

  /**
   *  Rotate Y axis:
   *    x1 = x * cos(angle) - z * sin(angle)
   *    z1 = z * cos(angle) + x * sin(angle)
   */
  function rotateY(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var x = p.x * cos - p.z * sin;
      var z = p.z * cos + p.x * sin;
      p.x = x;
      p.z = z;
    }
    needsUpdate = true;
  }

  document.body.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 37:
        // Left
        if (event.shiftKey) {
          rotateY(0.05);
        } else if (event.altKey) {
          rotateZ(0.05);
        } else {
          translateModel(-20, 0, 0);
        }
        break;

      case 39:
        // Right
        if (event.shiftKey) {
          rotateY(-0.05);
        } else if (event.altKey) {
          rotateZ(-0.05);
        } else {
          translateModel(20, 0, 0);
        }
        break;

      case 38:
        // Up
        if (event.ctrlKey) {
          translateModel(0, 0, 20);
        } else if (event.shiftKey) {
          rotateX(0.05);
        } else {
          translateModel(0, -20, 0);
        }
        break;

      case 40:
        // Down
        if (event.ctrlKey) {
          translateModel(0, 0, -20);
        } else if (event.shiftKey) {
          rotateX(-0.05);
        } else {
          translateModel(0, 20, 0);
        }
        break;

    }
  });

  // Animation control: KeyDown
  document.body.addEventListener("keydown", function (e) {
    //console.log("Key pressed: ", e.keyCode);
    switch (e.keyCode) {
      case 27:
        // Esc
        if (player.playing) {
          player.stop();
          console.log("> Scene stopped");
        } else {
          player.play();
          console.log("> Playing scene");
        }
        break;
      default:
        break;
    }
  });
};

},{"../../src/lib/AnimationPlayer":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 *  Feature Toggling
 *
 *  Activete/Hide features that are in process of development or under testing
 *  Once a feature is accepted to be includded must be removed from the
 *  feature toggle scheme
 */

var FEATURE_TOGGLE = {
  FPS_CONTROL: true // FPS controll for AnimationPlayer class
};

exports.default = FEATURE_TOGGLE;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require("../../src/feature-toggle");

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationPlayer = function () {
  function AnimationPlayer(settings) {
    _classCallCheck(this, AnimationPlayer);

    settings = settings || {};

    this.window = settings.windowElement || window;
    this.requestId = null;
    this.playing = false;

    // FPS control
    this.fps = settings.fps || 90;
    this.now;
    this.lastTime = Date.now();
    this.interval = 1000 / this.fps;
    this.delta;

    this.registerEvents();
  }

  _createClass(AnimationPlayer, [{
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;

      // Animation control: KeyDown
      document.body.addEventListener("keydown", function (e) {
        //console.log("Key pressed: ", e.keyCode);
        switch (e.keyCode) {
          case 27:
            // Esc
            if (_this.playing) {
              _this.stop();
              console.log("> Scene stopped");
            } else {
              _this.play();
              console.log("> Playing scene");
            }
            break;

          case 13:
            _this.stop();
            _this.play();
            _this.stop();
            console.log("> Step forward");
            break;

          default:
            break;
        }
      });
    }
  }, {
    key: "play",
    value: function play() {
      this.playing = true;
      this.updateFn();
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.playing) {
        return false;
      }
      this.window.cancelAnimationFrame(this.requestId);
      this.playing = false;
      this.requestId = null;
    }
  }, {
    key: "setUpdateFn",
    value: function setUpdateFn(updateFn) {
      var _this2 = this;

      this.updateFn = function () {
        _this2.requestId = _this2.window.requestAnimationFrame(_this2.updateFn);
        _this2.now = Date.now();
        _this2.delta = _this2.now - _this2.lastTime;

        if (_this2.delta > _this2.interval) {
          _this2.lastTime = _this2.now - _this2.delta % _this2.interval;
          updateFn(_this2.delta, _this2.lastTime);
        }
        return;

        updateFn();
      };
    }
  }, {
    key: "updateFn",
    value: function updateFn() {
      console.warn("Player update function has not been set.");
    }
  }]);

  return AnimationPlayer;
}();

exports.default = AnimationPlayer;

},{"../../src/feature-toggle":2}]},{},[1])

//# sourceMappingURL=app.js.map
