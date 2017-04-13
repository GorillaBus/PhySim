(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Drawer = require('../../src/lib/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Particle = require('../../src/lib/Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Vector = require('../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var drawer = new _Drawer2.default();
  var player = new _AnimationPlayer2.default();

  var particleCfg = {
    x: drawer.width / 2,
    y: drawer.height / 2,
    speed: 10,
    direction: Math.random() * Math.PI * 2,
    radius: 10,
    friction: 0.97
  };
  var p = new _Particle2.default(particleCfg);

  // For a real friction, use this
  var friction = new _Vector2.default({ x: 0, y: 0, length: 0.15 });

  // Demo player
  player.setUpdateFn(update);
  player.play();

  // Frame drawing function
  function update() {
    drawer.clear();

    /*
    // Real friction method (cpu intensive)
    if (p.velocity.getLength() > friction.getLength()) {
      friction.setAngle(p.velocity.getAngle());
      p.velocity.substractFrom(friction);
    } else {
      p.velocity.setLength(0);
    }
    */
    p.update();

    drawer.circle(p.x, p.y, p.radius);
  }

  // Animation control: KeyDown
  document.body.addEventListener("keydown", function (e) {
    //console.log("Key pressed: ", e.keyCode);
    switch (e.keyCode) {
      case 38:
        // Up
        thrusting = true;
        break;
      case 37:
        // Left
        turningLeft = true;
        break;
      case 39:
        // Right
        turningRight = true;
        break;
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

},{"../../src/lib/AnimationPlayer":3,"../../src/lib/Drawer":4,"../../src/lib/Particle":5,"../../src/lib/Vector":6}],2:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drawer = function () {
  function Drawer(canvas) {
    _classCallCheck(this, Drawer);

    this.canvas = canvas || null;
    this.ctx = null;
    this.width = null;
    this.height = null;
    this.center = { x: null, y: null };

    this.setup(canvas);
  }

  _createClass(Drawer, [{
    key: "setup",
    value: function setup(canvas) {
      this.canvas = canvas ? canvas : document.createElement("canvas");
      this.canvas.setAttribute("id", "canvas");
      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width = window.innerWidth - 4;
      this.height = this.canvas.height = window.innerHeight - 4;
      this.center = { x: this.width / 2, y: this.height / 2 };

      if (!canvas) {
        this.insertCanvas(this.canvas);
      }
    }
  }, {
    key: "insertCanvas",
    value: function insertCanvas(canvas) {
      document.getElementsByTagName("BODY")[0].appendChild(canvas);
    }
  }, {
    key: "clear",
    value: function clear(x, y, width, height) {
      x = x || 0;
      y = y || 0;
      width = width || this.width;
      height = height || this.height;

      this.ctx.clearRect(x, y, width, height);
    }
  }, {
    key: "circle",
    value: function circle(x, y, radio) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radio, 0, 2 * Math.PI, false);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }]);

  return Drawer;
}();

exports.default = Drawer;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require("../../src/feature-toggle");

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {

    /*
     *   Pass 'boxBounce' as { w: <with>, h: <height> } to make particle bounce inside a box
     *
     **/
    function Particle(settings) {
        _classCallCheck(this, Particle);

        this.x = settings.x || 0;
        this.y = settings.y || 0;
        this.vx = Math.cos(settings.direction) * settings.speed || 0;
        this.vy = Math.sin(settings.direction) * settings.speed || 0;
        this.gravity = settings.gravity || 0;
        this.mass = settings.mass || 1;
        this.radius = settings.radius || settings.mass * 0.87;
        this.friction = settings.friction || 1;
        this.springs = [];
        this.gravitations = [];

        this.color = settings.color || "#000000";
        this.boxBounce = settings.boxBounce || false;
    }

    /*
     *  Updates the state of the particle
     */


    _createClass(Particle, [{
        key: "update",
        value: function update() {
            this.handleSprings();
            this.handleGravitations();
            this.vy += this.gravity;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;

            if (this.boxBounce) {
                this.checkBorders(this.boxBounce.w, this.boxBounce.h);
            }
        }

        /*
         *  Gets the length of the velocity vector, which equals to the hypotenuse
         */

    }, {
        key: "getSpeed",
        value: function getSpeed() {
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        }

        /*
         *  Using the actual Velocity vector's angle, sets a new length for it
         */

    }, {
        key: "setSpeed",
        value: function setSpeed(speed) {
            var heading = this.getHeading();
            this.vx = Math.cos(heading) * speed;
            this.vy = Math.sin(heading) * speed;
        }

        /*
         *  Gets the angle direction of the velocity vector
         */

    }, {
        key: "getHeading",
        value: function getHeading() {
            return Math.atan2(this.vy, this.vx);
        }

        /*
         *  Changes the Velocity vector's angle and recalculate coordinates
         */

    }, {
        key: "setHeading",
        value: function setHeading(heading) {
            var speed = this.getSpeed();
            this.vx = Math.cos(heading) * speed;
            this.vy = Math.sin(heading) * speed;
        }

        /*
         *  Sums to the Velocity vector x and y values
         */

    }, {
        key: "accelerate",
        value: function accelerate(x, y) {
            this.vx += x;
            this.vy += y;
        }

        /*
        *  Bounce if the particle hits the box (i.e. screen) borders
        */

    }, {
        key: "checkBorders",
        value: function checkBorders(width, height) {
            if (this.x + this.radius >= width) {
                this.x = width - this.radius;
                this.vx *= -1;
            } else if (this.x - this.radius <= 0) {
                this.x = this.radius;
                this.vx *= -1;
            }

            if (this.y + this.radius >= height) {
                this.y = height - this.radius;
                this.vy *= -1;
            } else if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.vy *= -1;
            }
        }

        /*
         *  Calculates the angle between this particle and 'p2'
         */

    }, {
        key: "angleTo",
        value: function angleTo(p2) {
            return Math.atan2(p2.y - this.y, p2.x - this.x);
        }

        /*
         *  Calculates the distance to a given particle
         */

    }, {
        key: "distanceTo",
        value: function distanceTo(p) {
            var dx = p.x - this.x;
            var dy = p.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /*
         *  Calculates and applies a gravitation vector to a given particle
         */

    }, {
        key: "gravitateTo",
        value: function gravitateTo(p, gravityFactor) {
            gravityFactor = gravityFactor || 0.04;

            var radiusSum = this.radius + p.radius;
            var massFactor = this.mass * p.mass;

            var dx = p.x - this.x;
            var dy = p.y - this.y;
            var distSQ = dx * dx + dy * dy;
            var dist = Math.sqrt(distSQ);
            var surfaceDist = dist - radiusSum;

            // Cancel gravitation once objects collide
            // TODO: Verify if we can save the Math.sqrt() comparing squares
            if (dist < radiusSum + 5) {
                return;
            }

            //let force = (p.mass) / distSQ; // Force = mass / square of the distance
            var force = gravityFactor * massFactor / (surfaceDist * surfaceDist);

            var ax = dx / surfaceDist * force;
            var ay = dy / surfaceDist * force;

            this.vx += ax;
            this.vy += ay;
        }

        /*
         *  Registers a particle to gravitate to
         */

    }, {
        key: "addGravitation",
        value: function addGravitation(p) {
            this.removeGravitation(p);
            this.gravitations.push(p);
        }

        /*
         *  Unregisters a gravitation particle
         */

    }, {
        key: "removeGravitation",
        value: function removeGravitation(p) {
            var length = this.gravitations.length;
            for (var i = 0; i < length; i++) {
                if (this.gravitations[i] === p) {
                    this.gravitations.slice(i, 1);
                    return true;
                }
            }
        }

        /*
         *  Gravitates to each registered gravitation particle
         */

    }, {
        key: "handleGravitations",
        value: function handleGravitations() {
            var length = this.gravitations.length;
            for (var i = 0; i < length; i++) {
                this.gravitateTo(this.gravitations[i]);
            }
        }

        /*
         *  Calculates and applies a spring vector to a given point
         */

    }, {
        key: "springTo",
        value: function springTo(point, k, length) {
            var dx = point.x - this.x;
            var dy = point.y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var force = (distance - length || 0) * k;
            // Instead of getting cos / sin of angle, divide sides by hypotenuse
            this.vx += dx / distance * force;
            this.vy += dy / distance * force;
        }

        /*
         *  Registers a new spring point
         */

    }, {
        key: "addSpring",
        value: function addSpring(point, k, length) {
            this.removeSpring(point);
            this.springs.push({
                point: point,
                k: k,
                length: length || 0
            });
        }

        /*
         *  Unregisters a spring point
         */

    }, {
        key: "removeSpring",
        value: function removeSpring(point) {
            var length = this.springs.length;
            for (var i = 0; i < length; i++) {
                if (this.springs[i].point === point) {
                    this.springs.splice(i, 1);
                    return;
                }
            }
        }

        /*
         *  Springs to each registered spring point
         */

    }, {
        key: "handleSprings",
        value: function handleSprings() {
            var length = this.springs.length;
            for (var i = 0; i < length; i++) {
                var spring = this.springs[i];
                this.springTo(spring.point, spring.k, spring.length);
            }
        }
    }]);

    return Particle;
}();

exports.default = Particle;

},{"../../src/feature-toggle":2}],6:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}]},{},[1])


//# sourceMappingURL=app.js.map
