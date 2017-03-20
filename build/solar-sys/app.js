(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
        lastScale: 1,
        trans_x: 0,
        trans_y: 0,
        update: function update() {
            this.lastScale = this.scale;
        }
    };

    var player = new _AnimationPlayer2.default();

    var sunSetup = {
        x: center.x,
        y: center.y,
        mass: 300,
        speed: 0,
        color: "yellow",
        type: "sun",
        center: false
    };

    var planetsSetup = [{
        x: center.x + 104,
        y: center.y,
        speed: 1.5,
        direction: Math.PI / 2,
        color: '#46A543',
        mass: 4.5,
        type: "planet",
        center: false
    }, {
        x: center.x - 170,
        y: center.y,
        speed: 1.2,
        direction: -Math.PI / 2,
        color: 'CornflowerBlue',
        mass: 11,
        type: "planet",
        center: false
    }, {
        x: center.x - 230,
        y: center.y,
        speed: 1,
        direction: -Math.PI / 2,
        color: 'DarkGoldenRod',
        mass: 18,
        type: "planet",
        center: false
    }, {
        x: center.x - 290,
        y: center.y,
        speed: 0.9,
        direction: -Math.PI / 2,
        color: 'maroon',
        mass: 27,
        type: "planet",
        center: true
    }, {
        x: center.x + 292,
        y: center.y,
        speed: 0.9,
        direction: Math.PI / 2,
        color: '#9E51C9',
        mass: 27,
        type: "planet",
        center: false
    }, {
        x: center.x - 460,
        y: center.y,
        speed: 0.8,
        direction: -Math.PI / 2,
        color: 'DarkOliveGreen',
        mass: 173,
        type: "planet",
        center: false
    }, {
        x: center.x + 549,
        y: center.y,
        speed: 0.8,
        direction: Math.PI / 2,
        color: 'DarkGray',
        mass: 43,
        type: "planet",
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

    //update();

    //test();


    // Reference framework
    var ctxX = void 0;
    var ctxY = void 0;
    var centerObject = void 0;

    // Frame drawing function
    function update() {
        ctx.clearRect(-world.width, -world.height, world.width * 2, world.height * 2);

        var totalPlanets = planets.length;

        // Update planets
        for (var i = 0; i < totalPlanets; i++) {
            var p = planets[i];
            p.update();

            if (p.type === "planet") {
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
    }

    /** Helpers **/

    function createSun(config) {
        return new _Planet2.default(config, world);
    }

    function createPlanets(config) {
        var total = config.length;
        var planets = [];

        for (var i = 0; i < total; i++) {
            var p = new _Planet2.default(config[i], world);
            planets.push(p);
        }
        return planets;
    }

    function test() {
        var canvas2 = document.createElement("canvas");
        var ctx2 = canvas2.getContext("2d");

        // External shape props
        var x = 200;
        var y = world.center.y;
        var radius = 150;

        // Internal shape props
        var intPosX = radius;
        var intPosY = radius;
        canvas2.width = radius * 12;
        canvas2.height = radius * 12;

        // Distance and angle to the light source
        var dx = x - world.center.x;
        var dy = y - world.center.y;
        var angle = Math.atan2(dy, dx);

        // Shadow shape props
        var sRadius = radius * 2;
        var shadowLineWidth = radius;
        // let sX = intPosX + sRadius - (shadowLineWidth/2);
        // let sY = intPosY;
        var sX = radius;
        var sY = radius;

        // Draw external shape mask
        ctx2.fillStyle = "rgba(0,0,0,0)";
        ctx2.arc(intPosX, intPosY, radius, 0, Math.PI * 2, true);
        ctx2.fill();

        // Create shadow shape
        ctx2.save();

        //clip range by planet area.
        //ctx2.clip();

        // Draw shadow
        ctx2.beginPath();
        ctx2.lineWidth = shadowLineWidth;
        ctx2.strokeStyle = 'rgba(0,0,0,1)';
        ctx2.arc(sX, sY, sRadius, 0, Math.PI * 2);
        ctx2.stroke();
        ctx2.stroke();

        ctx2.restore();

        ctx.fillStyle = "green";
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.save();
        ctx.drawImage(canvas2, x - radius, y - radius);
        ctx.restore();
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

},{"../../src/lib/AnimationPlayer":4,"./lib/Planet":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Particle2 = require("../../../src/lib/Particle");

var _Particle3 = _interopRequireDefault(_Particle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Planet = function (_Particle) {
  _inherits(Planet, _Particle);

  function Planet(settings, world) {
    _classCallCheck(this, Planet);

    var _this = _possibleConstructorReturn(this, (Planet.__proto__ || Object.getPrototypeOf(Planet)).call(this, settings));

    _this.world = world;
    _this.ctx = world.ctx;

    _this.color = settings.color;
    _this.radius = settings.mass * 0.2;
    _this.type = settings.type;
    _this.center = settings.center;

    _this.scaledX = 0;
    _this.scaledY = 0;
    _this.scaledR = 0;

    _this.reScale();

    _this.grad = _this.type === "sun" ? _this.createGradient() : null;
    return _this;
  }

  _createClass(Planet, [{
    key: "reScale",
    value: function reScale() {
      this.scaledX = (this.x - this.world.center.x) * this.world.scale + this.world.center.x + this.world.trans_x;
      this.scaledY = (this.y - this.world.center.y) * this.world.scale + this.world.center.y + this.world.trans_y;
      this.scaledR = this.radius * this.world.scale;
    }
  }, {
    key: "draw",
    value: function draw(sun) {
      this.reScale();

      if (this.scaledR < 0) {
        return;
      }

      switch (this.type) {
        case "planet":
          this.drawPlanet(sun);
          break;

        case "sun":
          this.drawSun();
          break;
      }
    }
  }, {
    key: "drawSun",
    value: function drawSun() {
      if (this.world.scale != this.world.lastScale) {
        this.grad = this.createGradient();
        this.world.update();
      }

      this.ctx.fillStyle = this.grad;
      this.ctx.beginPath();
      this.ctx.arc(this.scaledX, this.scaledY, this.scaledR, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }, {
    key: "drawPlanet",
    value: function drawPlanet(lightSource) {
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
      this.ctx.fillStyle = this.color;
      this.ctx.arc(x, y, this.scaledR, 0, Math.PI * 2, false);
      this.ctx.fill();

      this.drawShadow(lightSource);
    }
  }, {
    key: "drawShadow",
    value: function drawShadow(lightSource) {

      // Get distance from source
      var dx = this.scaledX - lightSource.scaledX;
      var dy = this.scaledY - lightSource.scaledY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var angle = void 0;

      // Get the angle depending on the reference framework
      if (this.center) {
        dx = this.x - lightSource.x;
        dy = this.y - lightSource.y;
        angle = Math.atan2(dy, dx);
      } else {
        angle = Math.atan2(dy, dx);
      }

      // Shape props
      var radius = this.scaledR;

      // Shadow props
      var sX = void 0,
          sY = void 0;
      var shadowRadius = radius * 6.4;
      var shadowLineWidth = radius * 1.1;
      var shadowBlur = shadowRadius * 0.04;

      // Calculate shadow-circle's coordinates
      var x = lightSource.x + Math.cos(angle) * (dist - shadowRadius + radius * 0.58);
      var y = lightSource.y + Math.sin(angle) * (dist - shadowRadius + radius * 0.58);

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

      this.ctx.restore();
    }
  }, {
    key: "createGradient",
    value: function createGradient() {
      var grad = this.ctx.createRadialGradient(this.scaledX, this.scaledY, this.scaledR / 4, this.scaledX, this.scaledY, this.scaledR);
      grad.addColorStop(0, "#FF7");
      grad.addColorStop(0.6, "#FF4");
      grad.addColorStop(0.8, "#FF0");
      grad.addColorStop(1, "#DC0");
      return grad;
    }
  }]);

  return Planet;
}(_Particle3.default);

exports.default = Planet;
;

},{"../../../src/lib/Particle":5}],3:[function(require,module,exports){
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

var _featureToggle = require("../../src/feature-toggle");

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
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

        this.shape = settings.shape || "circle";
        this.mapperRegions = settings.mapperRegions || {};
        this.color = settings.color || "#000000";
        this.points = settings.points || [];
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
        value: function gravitateTo(p) {
            var dx = p.x - this.x;
            var dy = p.y - this.y;
            var distSQ = dx * dx + dy * dy;
            var dist = Math.sqrt(distSQ);
            var force = p.mass / distSQ; // Force = mass / square of the distance
            /*
            cos * hypotenuse = opposite side || cos = opposite side / hypotenuse
            sin * hypotenuse = adjacent side || sin = adjacent side / hypotenuse
             That being said, we can optimize this:
            let angle = this.angleTo(p);
            let ax = Math.cos(angle) * force;
            let ay = Math.sin(angle) * force;
             And save three trigo functions
            */
            var ax = dx / dist * force;
            var ay = dy / dist * force;

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

},{"../../src/feature-toggle":3}]},{},[1])


//# sourceMappingURL=app.js.map
