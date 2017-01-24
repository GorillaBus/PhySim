(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Monitor = require('../../src/lib/Monitor');

var _Monitor2 = _interopRequireDefault(_Monitor);

var _Vector = require('../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

var _Utils = require('../../src/lib/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Dust = require('./lib/Dust.js');

var _Dust2 = _interopRequireDefault(_Dust);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight - 4;
  var center = { x: width / 2, y: height / 2 };
  document.getElementsByTagName("BODY")[0].style = "background: #000000";
  canvas.height = height;
  canvas.width = width;

  var player = new _AnimationPlayer2.default();

  // Create dust
  // let dust = new Array(30);
  // for (let i=0;i<dust.length;i++){
  //   let position = {
  //     x: Utils.randomRange(0, width),
  //     y: Utils.randomRange(0, height)
  //   };
  //   let initMass = 1;
  //
  //   dust[i] = new Dust(ctx, position, initMass);
  // }

  // Create dust
  var position1 = {
    x: 100,
    y: center.y,
    length: 3
  };
  var initMass1 = 41;
  var position2 = {
    x: width - 100,
    y: center.y - 15,
    length: -2
  };
  var initMass2 = 12;
  var d1 = new _Dust2.default(ctx, position1, initMass1);
  var d2 = new _Dust2.default(ctx, position2, initMass2);
  var dust = [d1, d2];

  // let direction = dust[1].location.substract(dust[0].location);
  // direction.normalize();
  // direction.multiplyBy(20);
  // dust[0].applyForce(direction);

  // Demo player setup
  player.setUpdateFn(update);
  player.play();
  var flag = false;
  // Frame drawing function
  function update() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < dust.length; i++) {
      dust[i].update();
    }

    for (var _i = 0; _i < dust.length; _i++) {
      var _d = dust[_i];
      var absorbed = false;

      // Interaction
      for (var x = 0; x < dust.length; x++) {
        var _d2 = dust[x];

        if (_d.id === _d2.id) {
          continue;
        }

        if (_d.collides(_d2) && !flag) {
          var recoil = _d.collideElastic(_d2);
          flag = true;
          if (recoil) {

            if (_d.mass > _d2.mass) {
              _d.absorb(_d2);
              dust.splice(x, 1);
            } else {
              _d2.absorb(_d);
              dust.splice(_i, 1);
            }

            absorbed = true;
            continue;
          }
        }
      }

      // Update
      //d1.checkEdges(width, height);

      // Draw
      _d.draw();
    }
  }

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

      case 13:
        player.stop();
        player.play();
        player.stop();
        console.log("> Step forward");
        break;

      default:
        break;
    }
  });
};

},{"../../src/lib/AnimationPlayer":4,"../../src/lib/Monitor":5,"../../src/lib/Utils.js":7,"../../src/lib/Vector":8,"./lib/Dust.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('../../../src/lib/Utils.js');

var _Utils2 = _interopRequireDefault(_Utils);

var _Mover2 = require('../../../src/lib/Mover.js');

var _Mover3 = _interopRequireDefault(_Mover2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dust = function (_Mover) {
  _inherits(Dust, _Mover);

  function Dust(ctx, position, mass, G) {
    _classCallCheck(this, Dust);

    var _this = _possibleConstructorReturn(this, (Dust.__proto__ || Object.getPrototypeOf(Dust)).call(this, position.x, position.y, mass, null, null, position.length));

    _this.ctx = ctx;
    _this.id = _this.uuid();
    _this.mass = mass || 1;
    _this.radius = _this.calcRadius();
    _this.G = G || 0.9;
    _this.fillStyle = "#ffffff";
    return _this;
  }

  _createClass(Dust, [{
    key: 'calcRadius',
    value: function calcRadius() {
      return this.mass > 1 ? this.mass * 0.4 : 1;
    }
  }, {
    key: 'collides',
    value: function collides(dust) {
      var direction = dust.location.substract(this.location);
      var distance = direction.getLength();

      // Check collision
      var collidingArea = this.radius + dust.radius;
      if (distance <= collidingArea) {
        // let overlap = collidingArea - distance + 0.3;
        // direction.normalize();
        // direction.multiplyBy(overlap * -1);
        // dust.location.substractFrom(direction);

        return true;
      }

      return false;
    }
  }, {
    key: 'absorb',
    value: function absorb(dust) {
      // let direction = dust.location.substract(this.location);
      // let pRatio = dust.radio / this.radio;
      //
      // // Re-position the absorber
      // direction.normalize();
      // direction.multiplyBy(pRatio);
      // this.location.addTo(direction);

      this.mass += dust.mass;
      this.radius = this.calcRadius();

      if (this.fillStyle === "#ffffff") {
        this.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
      }
    }
  }, {
    key: 'attract',
    value: function attract(dust) {
      // Attract
      var collidingArea = this.radius + dust.radius;
      var direction = dust.location.substract(this.location);
      var realDistance = direction.getLength();
      if (realDistance <= collidingArea) {

        var overlap = collidingArea - realDistance;
        direction.normalize();
        direction.multiplyBy(overlap);
        this.velocity.substractFrom(direction);
        return false;
      }

      var masPower = this.G * this.mass * dust.mass;
      var distance = Math.max(100, realDistance);
      var force = masPower / (distance * distance);

      direction.normalize();
      direction.multiplyBy(force);
      this.applyForce(direction);
    }
  }, {
    key: 'collideElastic',
    value: function collideElastic(mover) {
      // Simulates the lost of Kinetic Energy
      var KE_LOOSE_RATIO = 0.76;

      /*
       *    Vf~1 = (mass1 - mass2) * Vi~1 / mass1 + mass2
       *    Vf~2 = 2 * mass1 * Vi~1 / mass1 + mass2
       */
      var Vf1 = this.velocity.copy();
      var Vf2 = this.velocity.copy();
      var diffMass = this.mass - mover.mass;
      var totalMass = this.mass + mover.mass;

      // Calculate 'final velocity 1'
      this.velocity.multiplyBy(0);
      Vf1.multiplyBy(diffMass);
      Vf1.divideBy(totalMass);
      Vf1.multiplyBy(KE_LOOSE_RATIO);

      // Calculate 'final velocity 2'
      mover.velocity.multiplyBy(0);
      Vf2.multiplyBy(2 * this.mass);
      Vf2.divideBy(totalMass);
      Vf2.multiplyBy(KE_LOOSE_RATIO);

      var recoil = Vf1.getLength() + Vf2.getLength();
      if (recoil < 0.1) {
        return recoil;
      }

      this.velocity = Vf1;
      mover.velocity = Vf2;

      /*
       let Vf1 = this.velocity.copy();
       let Vf2 = this.velocity.copy();
       let diffMass = (this.mass - mover.mass);
       let totalMass = (this.mass + mover.mass);
        // Calculate 'final velocity 1'
       this.velocity.multiplyBy(0);
       Vf1.multiplyBy(diffMass);
       Vf1.divideBy(totalMass);
       Vf1.multiplyBy(KE_LOOSE_RATIO);
          // Calculate 'final velocity 2'
       mover.velocity.multiplyBy(0);
       Vf2.multiplyBy(2 * this.mass);
       Vf2.divideBy(totalMass);
       Vf2.multiplyBy(KE_LOOSE_RATIO);
        let recoil = Vf1.getLength() + Vf2.getLength();
       if (recoil < 0.1) {
         return recoil;
       }
        this.velocity = Vf1;
       mover.velocity = Vf2;
      */
    }
  }, {
    key: 'collideInelastic',
    value: function collideInelastic(mover) {
      /*
       *
       *
       */
      var Vf1 = this.velocity.copy();
      var Vf2 = this.velocity.copy();
      var diffMass = this.mass - mover.mass;
      var totalMass = this.mass + mover.mass;

      // Calculate 'final velocity 1'
      this.velocity.multiplyBy(0);
      Vf1.multiplyBy(diffMass);
      Vf1.divideBy(totalMass);
      this.velocity = Vf1;

      // Calculate 'final velocity 2'
      mover.velocity.multiplyBy(0);
      Vf2.multiplyBy(2 * this.mass);
      Vf2.divideBy(totalMass);
      mover.velocity = Vf2;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var x = this.location.getX();
      var y = this.location.getY();

      this.ctx.beginPath();
      this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.fill();
    }
  }, {
    key: 'uuid',
    value: function uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }]);

  return Dust;
}(_Mover3.default);

exports.default = Dust;

},{"../../../src/lib/Mover.js":6,"../../../src/lib/Utils.js":7}],3:[function(require,module,exports){
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
  FPS_CONTROL: false // FPS controll for AnimationPlayer class
};

exports.default = FEATURE_TOGGLE;

},{}],4:[function(require,module,exports){
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
        if (_featureToggle2.default.FPS_CONTROL) {
            this.fps = settings.fps || 90;
            this.now;
            this.lastTime = Date.now();
            this.interval = 1000 / this.fps;
            this.delta;
        }
    }

    _createClass(AnimationPlayer, [{
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
            var _this = this;

            this.updateFn = function () {
                _this.requestId = _this.window.requestAnimationFrame(_this.updateFn);

                // FPS control
                if (_featureToggle2.default.FPS_CONTROL) {
                    _this.now = Date.now();
                    _this.delta = _this.now - _this.lastTime;

                    if (_this.delta > _this.interval) {
                        _this.lastTime = _this.now - _this.delta % _this.interval;
                        updateFn();
                    }
                    return;
                }

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

},{"../../src/feature-toggle":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Monitor = function () {
  function Monitor() {
    _classCallCheck(this, Monitor);

    this.HTMLObject = this.createWrapper();
    this.outputs = [];
  }

  _createClass(Monitor, [{
    key: "out",
    value: function out(t, v) {
      t = t - 1;
      if (!this.outputs[t]) {
        console.warn("Monitor > no output #" + t);
        return false;
      }
      this.outputs[t].innerHTML = v;
    }
  }, {
    key: "newOutput",
    value: function newOutput(title) {
      var e = this.createOutput(title);
      var v = e.getElementsByTagName("SPAN")[0];
      this.outputs.push(v);
      this.HTMLObject.appendChild(e);
      return this.outputs.length;
    }
  }, {
    key: "createWrapper",
    value: function createWrapper() {
      var e = document.createElement("DIV");
      e.setAttribute("id", "monitorWrapper");
      document.getElementsByTagName("body")[0].appendChild(e);
      return e;
    }
  }, {
    key: "createOutput",
    value: function createOutput(title) {
      title = this.sanitize(title);

      var e = document.createElement("DIV");
      e.setAttribute("class", "monitor");
      e.setAttribute("id", title);

      var head = document.createElement("H3");
      head.innerHTML = title;
      e.appendChild(head);

      var val = document.createElement("SPAN");
      val.innerHTML = "---";
      e.appendChild(val);

      return e;
    }
  }, {
    key: "sanitize",
    value: function sanitize(s) {
      return s.replace(/\W/g, '');
    }
  }]);

  return Monitor;
}();

exports.default = Monitor;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require('./Vector');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mover = function () {
  function Mover(x, y, mass, angle, maxLength, length) {
    _classCallCheck(this, Mover);

    length = length || 0;
    this.angle = angle || 0;
    this.mass = mass || 1;
    this.maxLength = maxLength || 0;
    this.acceleration = new _Vector2.default({ x: 0, y: 0 });
    this.velocity = new _Vector2.default({ x: 0, y: 0, length: length });
    this.location = new _Vector2.default({ x: x, y: y });
  }

  _createClass(Mover, [{
    key: 'applyForce',
    value: function applyForce(force) {
      // Acceleration = mass / force: create a new vector with it
      var f = force.divide(this.mass);
      this.acceleration.addTo(f);
    }
  }, {
    key: 'update',
    value: function update() {
      if (this.maxLength != 0 && this.velocity.getLength() > this.maxLength) {
        this.velocity.setLength(this.maxLength);
      } else {
        this.velocity.addTo(this.acceleration);
      }

      this.location.addTo(this.velocity);
      // Reset acceleration vector
      this.acceleration.multiplyBy(0);
    }
  }, {
    key: 'isInside',
    value: function isInside(liquid) {
      return this.location.getY() > liquid.getY() && this.location.getY() <= liquid.getH() + liquid.getY();
    }
  }, {
    key: 'drag',
    value: function drag(liquid) {
      var speed = this.velocity.getLength();
      var dragMagnitude = liquid.getC() * speed * speed;
      var drag = this.velocity.multiply(-1);

      drag.normalize();
      drag.multiplyBy(dragMagnitude);
      this.applyForce(drag);
    }
  }, {
    key: 'checkEdges',
    value: function checkEdges(width, height) {
      if (this.location.getX() >= width) {
        this.location.setX(width);
        this.velocity.setX(this.velocity.getX() * -1);
      } else if (this.location.getX() <= 0) {
        this.location.setX(0);
        this.velocity.setX(this.velocity.getX() * -1);
      }

      if (this.location.getY() >= height) {
        this.location.setY(height);
        this.velocity.setY(this.velocity.getY() * -1);
      } else if (this.location.getY() <= 0) {
        this.location.setY(0);
        this.velocity.setY(this.velocity.getY() * -1);
      }
    }
  }, {
    key: 'resetVelocity',
    value: function resetVelocity() {
      this.velocity.multiplyBy(0);
    }
  }]);

  return Mover;
}();

exports.default = Mover;

},{"./Vector":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, [{
    key: 'montecarlo',
    value: function montecarlo() {
      while (true) {
        var r1 = Math.random();
        var p = r1;
        var r2 = Math.random();
        if (r2 < p) {
          return r1;
        }
      }
    }
  }, {
    key: 'lerp',
    value: function lerp(norm, min, max) {
      return (max - min) * norm + min;
    }
  }, {
    key: 'quadraticBezier',
    value: function quadraticBezier(p0, p1, p2, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
      pFinal.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
      return pFinal;
    }
  }, {
    key: 'cubicBezier',
    value: function cubicBezier(p0, p1, p2, p3, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x;
      pFinal.y = Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y;
      return pFinal;
    }
  }, {
    key: 'distance',
    value: function distance(p0, p1) {
      var dx = p0.x - p1.x;
      var dy = p0.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }, {
    key: 'distanceXY',
    value: function distanceXY(x0, y0, x1, y1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // TODO: Check if and why we need to parseInt() the result

  }, {
    key: 'mapRange',
    value: function mapRange(value, low1, high1, low2, high2) {
      return result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      var result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      if (low2 === parseInt(low2, 10) || high2 === parseInt(high2, 10)) {
        result = parseInt(result);
      }
      return result;
    }
  }, {
    key: 'inRange',
    value: function inRange(value, min, max) {
      return value >= Math.min(min, max) && value <= Math.max(min, max);
    }
  }, {
    key: 'rangeIntersect',
    value: function rangeIntersect(min0, max0, min1, max1) {
      return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    }
  }, {
    key: 'randomRange',
    value: function randomRange(min, max) {
      return min + Math.random() * (max - min);
    }
  }, {
    key: 'circleCollision',
    value: function circleCollision(c0, c1) {
      return this.distance(c0, c1) <= c0.radius + c1.radius;
    }
  }, {
    key: 'rectangleCollision',
    value: function rectangleCollision(r0, r1) {
      return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }
  }, {
    key: 'circlePointCollision',
    value: function circlePointCollision(px, py, circle) {
      return this.distanceXY(px, py, circle.x, circle.y) < circle.radius;
    }
  }, {
    key: 'rectanglePointCollision',
    value: function rectanglePointCollision(px, py, rect) {
      return this.inRange(px, rect.x, rect.x + rect.width) && this.inRange(py, rect.y, rect.y + rect.height);
    }
  }]);

  return Utils;
}();

var instance = new Utils();

exports.default = instance;

},{"../../src/feature-toggle":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
  function Vector(settings) {
    _classCallCheck(this, Vector);

    settings = settings || {};
    settings.x = settings.x || 0;
    settings.y = settings.y || 0;
    settings.length = settings.length || 0;
    settings.angle = settings.angle || 0;

    this._x = settings.x;
    this._y = settings.y;

    if (settings.length) {
      this.setLength(settings.length);
    }
    if (settings.angle) {
      this.setAngle(settings.angle);
    }
  }

  _createClass(Vector, [{
    key: 'setX',
    value: function setX(value) {
      this._x = value;
    }
  }, {
    key: 'getX',
    value: function getX(value) {
      return this._x;
    }
  }, {
    key: 'setY',
    value: function setY(value) {
      this._y = value;
    }
  }, {
    key: 'getY',
    value: function getY(value) {
      return this._y;
    }
  }, {
    key: 'setAngle',
    value: function setAngle(angle) {
      var length = this.getLength();
      this._x = Math.cos(angle) * length;
      this._y = Math.sin(angle) * length;
    }
  }, {
    key: 'getAngle',
    value: function getAngle() {
      return Math.atan2(this._y, this._x);
    }
  }, {
    key: 'setLength',
    value: function setLength(length) {
      var angle = this.getAngle();
      this._x = Math.cos(angle) * length;
      this._y = Math.sin(angle) * length;
    }
  }, {
    key: 'getLength',
    value: function getLength() {
      return Math.sqrt(this._x * this._x + this._y * this._y);
    }
  }, {
    key: 'add',
    value: function add(vector) {
      return new Vector({ x: this._x + vector.getX(), y: this._y + vector.getY() });
    }
  }, {
    key: 'substract',
    value: function substract(vector) {
      return new Vector({ x: this._x - vector.getX(), y: this._y - vector.getY() });
    }
  }, {
    key: 'multiply',
    value: function multiply(value) {
      return new Vector({ x: this._x * value, y: this._y * value });
    }
  }, {
    key: 'divide',
    value: function divide(value) {
      return new Vector({ x: this._x / value, y: this._y / value });
    }
  }, {
    key: 'addTo',
    value: function addTo(vector) {
      this._x += vector.getX();
      this._y += vector.getY();
    }
  }, {
    key: 'substractFrom',
    value: function substractFrom(vector) {
      this._x -= vector.getX();
      this._y -= vector.getY();
    }
  }, {
    key: 'multiplyBy',
    value: function multiplyBy(value) {
      this._x *= value;
      this._y *= value;
    }
  }, {
    key: 'divideBy',
    value: function divideBy(value) {
      this._x /= value;
      this._y /= value;
    }
  }, {
    key: 'copy',
    value: function copy() {
      return new Vector({
        x: this.getX(),
        y: this.getY()
      });
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      var length = this.getLength();
      if (length != 0) {
        this.divideBy(length);
      }
    }
  }]);

  return Vector;
}();

exports.default = Vector;
;

},{"../../src/feature-toggle":3}]},{},[1])


//# sourceMappingURL=app.js.map
