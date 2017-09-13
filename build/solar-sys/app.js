(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Star = require('./lib/Star');

var _Star2 = _interopRequireDefault(_Star);

var _Planet = require('./lib/Planet');

var _Planet2 = _interopRequireDefault(_Planet);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth - 4;
    var height = canvas.height = window.innerHeight - 4;
    var center = {
        x: width / 2,
        y: height / 2
    };

    // World data
    var world = {
        ctx: ctx,
        width: width,
        height: height,
        center: center,
        scale: 1,
        lastScale: 0,
        trans_x: 0,
        trans_y: 0,
        needsUpdate: false,
        update: function update() {
            this.needsUpdate = this.lastScale != this.scale;
        }
    };

    var player = new _AnimationPlayer2.default({ fps: 60 });

    var sunSetup = {
        x: center.x,
        y: center.y,
        mass: 500,
        speed: 0,
        color: "#D6D32D",
        center: false
    };

    var planetsSetup = [{
        x: center.x + 504,
        y: center.y,
        speed: 1.428,
        direction: Math.PI / 2,
        color: '#FA1616',
        mass: 25.5,
        center: false
    }, {
        x: center.x + 220,
        y: center.y,
        speed: 2.41876606819402505,
        direction: Math.PI / 2,
        color: '#808231',
        mass: 10,
        center: false
    }, {
        x: center.x - 380,
        y: center.y,
        speed: 1.159,
        direction: -Math.PI / 2,
        color: '#4042A8',
        mass: 10,
        center: false
    }, {
        x: center.x - 480,
        y: center.y,
        speed: 1.567,
        direction: -Math.PI / 2,
        color: '#47BFBD',
        mass: 28,
        center: false
    }, {
        x: center.x - 620,
        y: center.y,
        speed: 2,
        direction: -Math.PI / 2,
        color: '#AB3A2B',
        mass: 68,
        center: true
    }, {
        x: center.x + 2292,
        y: center.y,
        speed: 1.6,
        direction: Math.PI / 2,
        color: '#2B7523',
        mass: 227,
        center: false
    }, {
        x: center.x + 960,
        y: center.y,
        speed: 1.5,
        direction: Math.PI / 2,
        color: '#6C29A3',
        mass: 73,
        center: false
    }, {
        x: center.x + 1849,
        y: center.y,
        speed: 1.53,
        direction: Math.PI / 2,
        color: '#A7A2AB',
        mass: 183,
        center: false
    }];

    // Setup planets
    var planets = createPlanets(planetsSetup);

    // Setup sun
    var sun = createSun(sunSetup);

    // All celestial bodies
    planets.push(sun);

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Reference framework
    var ctxX = void 0;
    var ctxY = void 0;
    var centerObject = void 0;

    // Frame drawing function
    function update() {
        ctx.clearRect(0, 0, world.width, world.height);

        var totalPlanets = planets.length;

        // Update planets
        for (var i = 0; i < totalPlanets; i++) {
            var p = planets[i];
            p.update();

            if (p instanceof _Planet2.default) {
                planets[i].gravitateTo(sun);
            }

            // Adjust reference framework to the center body: planet or sun
            if (p.center) {
                centerObject = p;
                ctxX = (world.center.x - p.x) * world.scale + world.trans_x;
                ctxY = (world.center.y - p.y) * world.scale + world.trans_y;
            }
        }

        ctx.save();
        ctx.translate(ctxX, ctxY);

        // Draw planets
        for (var _i = 0; _i < totalPlanets; _i++) {
            var _p = planets[_i];

            if (_p.center) {
                continue;
            }

            _p.draw(sun);
        }

        ctx.restore();

        // Draw center body
        centerObject.draw(sun);

        world.update();
    }

    /** Helpers **/

    function createSun(config) {
        return new _Star2.default(config, world);
    }

    function createPlanets(config) {
        var total = config.length;
        var planets = [];

        for (var i = 0; i < total; i++) {
            var p = new _Planet2.default(config[i], world);
            if (config[i].debugOrbit) {
                p.debugOrbit = true;
            }
            planets.push(p);
        }
        return planets;
    }

    /** Events **/

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
                // Esc
                if (player.playing) {
                    player.stop();
                }

                player.play();
                player.stop();

                break;
            default:
                break;
        }
    });

    document.body.addEventListener("mousewheel", MouseWheelHandler, false);

    function MouseWheelHandler(e) {
        var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
        var scaleFactor = world.scale * 0.1;
        if (delta > 0) {
            world.scale += scaleFactor;
        } else {
            world.scale -= scaleFactor;
        }
    }
};

},{"../../src/lib/AnimationPlayer":6,"./lib/Planet":3,"./lib/Star":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Particle2 = require('../../../src/lib/Particle');

var _Particle3 = _interopRequireDefault(_Particle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CelestialBody = function (_Particle) {
  _inherits(CelestialBody, _Particle);

  function CelestialBody(settings, world) {
    _classCallCheck(this, CelestialBody);

    var _this = _possibleConstructorReturn(this, (CelestialBody.__proto__ || Object.getPrototypeOf(CelestialBody)).call(this, settings));

    _this.world = world;
    _this.ctx = world.ctx;

    _this.color = _this.hexToRGB(settings.color);
    _this.radius = settings.mass * 0.2;
    _this.center = settings.center;

    _this.scaledX = 0;
    _this.scaledY = 0;
    _this.scaledR = 0;

    _this.reScale();
    return _this;
  }

  _createClass(CelestialBody, [{
    key: 'reScale',
    value: function reScale() {
      this.scaledX = (this.x - this.world.center.x) * this.world.scale + this.world.center.x + this.world.trans_x;
      this.scaledY = (this.y - this.world.center.y) * this.world.scale + this.world.center.y + this.world.trans_y;
      this.scaledR = this.radius * this.world.scale;
    }
  }, {
    key: 'draw',
    value: function draw() {}
  }, {
    key: 'drawShadow',
    value: function drawShadow(lightSource) {

      // Shadow props
      var radius = this.scaledR;
      var sX = void 0,
          sY = void 0;
      var shadowRadius = radius * 2.7;
      var shadowLineWidth = radius * 0.81;
      var shadowBlur = shadowRadius * 0.6;

      // Get the angle & distance depending on the reference framework
      var dx = void 0,
          dy = void 0;
      var dist = 0;
      if (this.center) {
        dx = this.x - lightSource.x;
        dy = this.y - lightSource.y;
      } else {
        dx = this.scaledX - lightSource.scaledX;
        dy = this.scaledY - lightSource.scaledY;
        dist = Math.sqrt(dx * dx + dy * dy);
      }

      // Get distance from source
      var angle = Math.atan2(dy, dx);

      // Calculate shadow-circle's coordinates
      var x = lightSource.x + Math.cos(angle) * (dist - shadowRadius + radius * 1);
      var y = lightSource.y + Math.sin(angle) * (dist - shadowRadius + radius * 1);

      // Shadow setup
      this.ctx.save();

      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      this.ctx.shadowBlur = shadowBlur;
      this.ctx.shadowColor = 'rgba(0,0,0,1)';

      //clip range by planet area.
      this.ctx.clip();

      // Draw shadow
      this.ctx.beginPath();
      this.ctx.lineWidth = shadowLineWidth;
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
      this.ctx.arc(x, y, shadowRadius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.stroke();
      this.ctx.stroke();
      this.ctx.stroke();
      this.ctx.stroke();
      this.ctx.stroke();

      this.ctx.restore();
    }
  }, {
    key: 'createGradient',
    value: function createGradient() {
      var grad = this.ctx.createRadialGradient(this.scaledX, this.scaledY, this.scaledR / 4, this.scaledX, this.scaledY, this.scaledR);
      // grad.addColorStop(0,"#FF7");
      // grad.addColorStop(0.6,"#FF4");
      // grad.addColorStop(0.8,"#FF0");
      // grad.addColorStop(1,"#DC0");

      var step1 = {
        r: this.color.r + Math.floor((255 - this.color.r) * 0.26),
        g: this.color.g + Math.floor((255 - this.color.g) * 0.26),
        b: this.color.b + Math.floor((255 - this.color.b) * 0.26)
      };

      var step2 = {
        r: this.color.r + +Math.floor((255 - this.color.r) * 0.17),
        g: this.color.g + +Math.floor((255 - this.color.r) * 0.17),
        b: this.color.b + +Math.floor((255 - this.color.r) * 0.17)
      };

      var step3 = {
        r: this.color.r,
        g: this.color.g,
        b: this.color.b
      };

      grad.addColorStop(0.2, 'rgba(' + step1.r + ', ' + step1.g + ', ' + step1.b + ', 1)');
      grad.addColorStop(0.8, 'rgba(' + step2.r + ', ' + step2.g + ', ' + step2.b + ', 1)');
      grad.addColorStop(1, 'rgba(' + step3.r + ', ' + step3.g + ', ' + step3.b + ', 1)');

      return grad;
    }
  }, {
    key: 'hexToRGB',
    value: function hexToRGB(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  }]);

  return CelestialBody;
}(_Particle3.default);

exports.default = CelestialBody;
;

},{"../../../src/lib/Particle":7}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CelestialBody2 = require("./CelestialBody");

var _CelestialBody3 = _interopRequireDefault(_CelestialBody2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Planet = function (_CelestialBody) {
  _inherits(Planet, _CelestialBody);

  function Planet(settings, world) {
    _classCallCheck(this, Planet);

    var _this = _possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).call(this, settings, world));

    _this.grad = _this.createGradient();
    return _this;
  }

  _createClass(Planet, [{
    key: "draw",
    value: function draw(lightSource, drawShadow) {
      lightSource = lightSource || null;
      drawShadow = drawShadow == false ? false : true;

      this.reScale();

      if (this.world.needsUpdate) {
        this.grad = this.createGradient();
      }

      if (this.scaledR < 0) {
        return;
      }

      var x = void 0,
          y = void 0;
      switch (this.center) {
        case false:
          x = this.scaledX;
          y = this.scaledY;
          break;
        case true:
          x = this.world.center.x;
          y = this.world.center.y;
          break;
      }

      this.ctx.beginPath();
      this.ctx.fillStyle = this.grad;
      this.ctx.arc(x, y, this.scaledR, 0, Math.PI * 2, false);
      this.ctx.fill();

      if (lightSource && drawShadow) {
        this.drawShadow(lightSource);
      }

      // Debug draw orbit
      if (this.debugOrbit && !this.center) {

        // Show orbit prediction
        var predict = new Planet({
          x: this.x,
          y: this.y,
          mass: this.mass,
          direction: this.getHeading(),
          speed: this.getSpeed(),
          color: "#ffffff",
          center: false
        }, this.world);

        for (var pr = 0; pr <= 2000; pr++) {

          predict.update();
          predict.gravitateTo(lightSource);
          predict.draw(lightSource, false);
        }
      }
    }
  }]);

  return Planet;
}(_CelestialBody3.default);

exports.default = Planet;
;

},{"./CelestialBody":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CelestialBody2 = require('./CelestialBody');

var _CelestialBody3 = _interopRequireDefault(_CelestialBody2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Planet = function (_CelestialBody) {
  _inherits(Planet, _CelestialBody);

  function Planet(settings, world) {
    _classCallCheck(this, Planet);

    var _this = _possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).call(this, settings, world));

    _this.grad = _this.createGradient();
    return _this;
  }

  _createClass(Planet, [{
    key: 'draw',
    value: function draw() {
      this.reScale();

      if (this.scaledR < 0) {
        return;
      }

      if (this.world.needsUpdate) {
        this.grad = this.createGradient();
      }

      this.ctx.fillStyle = this.grad;
      this.ctx.beginPath();
      this.ctx.arc(this.scaledX, this.scaledY, this.scaledR, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }]);

  return Planet;
}(_CelestialBody3.default);

exports.default = Planet;
;

},{"./CelestialBody":2}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../../src/feature-toggle":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../src/feature-toggle');

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
        this.positionUpdated = false;
        this.color = settings.color || 'rgba(0,0,0,0.6)';
        this.boxBounce = settings.boxBounce || false;
    }

    /*
     *  Updates the state of the particle
     */


    _createClass(Particle, [{
        key: 'update',
        value: function update() {
            var x = this.x;
            var y = this.y;

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

            if (x !== this.x && y !== this.y) {
                this.positionUpdated = true;
            } else {}
        }

        /*
         *  Gets the length of the velocity vector, which equals to the hypotenuse
         */

    }, {
        key: 'getSpeed',
        value: function getSpeed() {
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        }

        /*
         *  Using the actual Velocity vector's angle, sets a new length for it
         */

    }, {
        key: 'setSpeed',
        value: function setSpeed(speed) {
            var heading = this.getHeading();
            this.vx = Math.cos(heading) * speed;
            this.vy = Math.sin(heading) * speed;
        }

        /*
         *  Gets the angle direction of the velocity vector
         */

    }, {
        key: 'getHeading',
        value: function getHeading() {
            return Math.atan2(this.vy, this.vx);
        }

        /*
         *  Changes the Velocity vector's angle and recalculate coordinates
         */

    }, {
        key: 'setHeading',
        value: function setHeading(heading) {
            var speed = this.getSpeed();
            this.vx = Math.cos(heading) * speed;
            this.vy = Math.sin(heading) * speed;
        }

        /*
         *  Sums to the Velocity vector x and y values
         */

    }, {
        key: 'accelerate',
        value: function accelerate(x, y) {
            this.vx += x;
            this.vy += y;
        }

        /*
        *  Bounce if the particle hits the box (i.e. screen) borders
        */

    }, {
        key: 'checkBorders',
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
        key: 'angleTo',
        value: function angleTo(p2) {
            return Math.atan2(p2.y - this.y, p2.x - this.x);
        }

        /*
         *  Calculates the distance to a given particle
         */

    }, {
        key: 'distanceTo',
        value: function distanceTo(p) {
            var dx = p.x - this.x;
            var dy = p.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /*
         *  Calculates and applies a gravitation vector to a given particle
         */

    }, {
        key: 'gravitateTo',
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
        key: 'addGravitation',
        value: function addGravitation(p) {
            this.removeGravitation(p);
            this.gravitations.push(p);
        }

        /*
         *  Unregisters a gravitation particle
         */

    }, {
        key: 'removeGravitation',
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
        key: 'handleGravitations',
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
        key: 'springTo',
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
        key: 'addSpring',
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
        key: 'removeSpring',
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
        key: 'handleSprings',
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

},{"../../src/feature-toggle":5}]},{},[1])

//# sourceMappingURL=app.js.map
