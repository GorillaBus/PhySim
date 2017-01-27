(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Particle = require('../../src/lib/Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _Utils = require('../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _ParticleManager = require('../../src/lib/ParticleManager');

var _ParticleManager2 = _interopRequireDefault(_ParticleManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight - 4;
  var center = { x: width / 2, y: height / 2 };

  canvas.height = height;
  canvas.width = width;

  var player = new _AnimationPlayer2.default({ fps: 60 });

  var monOutputs = {};
  var pmanager = new _ParticleManager2.default({
    regionDraw: false,
    regionSize: 10,
    regionMon: false
  }, ctx);

  // Create particles
  var particles = new Array(1000);
  for (var i = 0; i < particles.length; i++) {
    particles[i] = new _Particle2.default({
      x: _Utils2.default.randomRange(0, width),
      y: _Utils2.default.randomRange(0, height),
      radius: 2,
      direction: Math.random() * Math.PI * 2,
      speed: 2
    });

    var p = particles[i];
    p.id = uuid();
    p.mapperRegion = null;
    p.color = "#000000";
  }

  // Inject particles into the Mapper
  pmanager.injectParticles(particles);

  // Demo player setup
  player.setUpdateFn(update);
  player.play();

  // Frame drawing function
  function update() {

    // Global update
    pmanager.update();

    // Global draw
    pmanager.draw();
  }

  function uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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

},{"../../src/lib/AnimationPlayer":3,"../../src/lib/Particle":7,"../../src/lib/ParticleManager":8,"../../src/lib/Utils":9}],2:[function(require,module,exports){
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

var Collisioner = function () {
  function Collisioner() {
    _classCallCheck(this, Collisioner);
  }

  /*
   *  Get angle from p0's location to p1's location
   */


  _createClass(Collisioner, [{
    key: "distance",
    value: function distance(p0, p1) {
      return p0.distanceTo(p1);
    }

    /*
     *  Get angle from p0's location to p1's location
     */

  }, {
    key: "angle",
    value: function angle(p0, p1) {
      return p0.angleTo(p1);
    }

    /*
     *  Check for collision between two circular particles
     */

  }, {
    key: "circleCollision",
    value: function circleCollision(p0, p1) {
      var distance = this.distance(p0, p1);
      var collides = distance <= p0.radius + p1.radius;

      if (!collides) {
        return collides;
      }

      return {
        distance: distance,
        angle: this.angle(p0, p1)
      };
    }
  }]);

  return Collisioner;
}();

exports.default = Collisioner;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = function () {
  function Mapper(regionSize) {
    _classCallCheck(this, Mapper);

    this.regionSize = regionSize || 400;
    this.regions = {};
  }

  /*
   *  Subscribes particle 'p' to region 'rLabel'
   */


  _createClass(Mapper, [{
    key: "subscribe",
    value: function subscribe(p, rLabel) {
      var region = this.regions[rLabel];
      if (!region.particles.hasOwnProperty(p.id)) {

        // Delete particle from previous region
        if (p.mapperRegion !== null) {
          this.unsubscribe(p, p.mapperRegion);
        }

        region.particles[p.id] = p;
        p.mapperRegion = rLabel;
      }
    }

    /*
     *  Unsubscribe particle 'p' from region 'rLabel'
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe(p, rLabel) {
      delete this.regions[rLabel].particles[p.id];
    }

    /*
     *  Update map state
     */

  }, {
    key: "update",
    value: function update(rData, p) {
      if (p.mapperRegion === rData.rLabel) {
        return;
      }

      // Create the region if it doesn't exist already
      if (!this.regions.hasOwnProperty(rData.rLabel)) {
        this.createRegion(rData);
      }

      // Insert particle into the region stack if it's not already inside
      this.subscribe(p, rData.rLabel);
    }

    /*
     *  Get particle's region data
     */

  }, {
    key: "qualifyParticle",
    value: function qualifyParticle(p) {
      var pX = p.x;
      var pY = p.y;

      var rData = {
        rX: pX > this.regionSize ? Math.floor(Math.abs(pX / this.regionSize)) : 0,
        rY: pY > this.regionSize ? Math.floor(Math.abs(pY / this.regionSize)) : 0
      };
      rData.rLabel = rData.rX + "_" + rData.rY;
      return rData;
    }

    /*
     *  Create a new region
     */

  }, {
    key: "createRegion",
    value: function createRegion(rData) {

      // Pre-calculate region offset
      var rOffsetX = rData.rX * this.regionSize;
      var rOffsetY = rData.rY * this.regionSize;

      this.regions[rData.rLabel] = {
        color: "#000000".replace(/0/g, function () {
          return (~~(Math.random() * 16)).toString(16);
        }),
        particles: {},
        beginsAtX: rOffsetX,
        beginsAtY: rOffsetY,
        endsAtX: rOffsetX + this.regionSize,
        endsAtY: rOffsetY + this.regionSize
      };
    }
  }]);

  return Mapper;
}();

exports.default = Mapper;

},{}],6:[function(require,module,exports){
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
    this.outputs = {};
  }

  _createClass(Monitor, [{
    key: "out",
    value: function out(t, v) {
      if (!this.outputs[t]) {
        console.warn("Monitor > no output '" + t + "'");
        return false;
      }
      this.outputs[t].innerHTML = v;
    }
  }, {
    key: "newOutput",
    value: function newOutput(title) {
      title = this.sanitize(title);
      var e = this.createOutput(title);
      var v = e.getElementsByTagName("SPAN")[0];
      this.outputs[title] = v;
      this.HTMLObject.appendChild(e);
      return Object.keys(this.outputs).length;
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

},{}],7:[function(require,module,exports){
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
    function Particle(settings) {
        _classCallCheck(this, Particle);

        this.x = settings.x || 0;
        this.y = settings.y || 0;
        this.vx = Math.cos(settings.direction) * settings.speed || 0;
        this.vy = Math.sin(settings.direction) * settings.speed || 0;
        this.gravity = settings.gravity || 0;
        this.mass = settings.mass || 1;
        this.radius = settings.radius || 1;
        this.friction = settings.friction || 1;
        this.springs = [];
        this.gravitations = [];
    }

    /*
     *  Updates the state of the particle
     */


    _createClass(Particle, [{
        key: 'update',
        value: function update() {
            this.handleSprings();
            this.handleGravitations();
            this.vy += this.gravity;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
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
            if (this.x < 0 || this.x > width) {
                this.vx *= -1;
            }

            if (this.y < 0 || this.y > height) {
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

},{"../../src/feature-toggle":2}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mapper = require('./Mapper');

var _Mapper2 = _interopRequireDefault(_Mapper);

var _Monitor = require('./Monitor');

var _Monitor2 = _interopRequireDefault(_Monitor);

var _Collisioner = require('./Collisioner');

var _Collisioner2 = _interopRequireDefault(_Collisioner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleManager = function () {
  function ParticleManager(settings, ctx) {
    _classCallCheck(this, ParticleManager);

    settings = settings || {};
    settings = {
      particles: settings.particles || [],
      boxWidth: settings.boxWidth || window.innerWidth,
      boxHeight: settings.boxHeight || window.innerHeight - 4,
      regionDraw: settings.regionDraw || false,
      regionSize: settings.regionSize || null,
      regionMon: settings.regionMon || false
    };

    this.ctx = ctx;
    this.mapper = new _Mapper2.default(settings.regionSize);
    this.collisioner = new _Collisioner2.default();
    this.regionMon = settings.regionMon;
    this.regionDraw = settings.regionDraw;
    this.monitor = settings.regionMon ? new _Monitor2.default() : null;
    this.particles = settings.particles;
    this.boxWidth = settings.boxWidth;
    this.boxHeight = settings.boxHeight;
  }

  /*
   *  Update loop
   */


  _createClass(ParticleManager, [{
    key: 'update',
    value: function update() {

      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];

        // Update particle position
        p.update();
        p.checkBorders(this.boxWidth, this.boxHeight);

        // Qualify particle in the mapper and get the region data
        var rData = this.mapper.qualifyParticle(p);

        // Update region status
        this.mapper.update(rData, p);
      }
    }

    /*
     *  Draw loop
     */

  }, {
    key: 'draw',
    value: function draw() {

      // Clear full screen
      this.ctx.clearRect(0, 0, this.boxWidth, this.boxHeight);

      // Draw map regions (debugging)
      if (this.regionDraw) {
        this.drawMappgerRegions();
      }

      // Draw particles
      for (var i = 0; i < this.particles.length; i++) {
        var p0 = this.particles[i];

        // Check collisions with particles from the same region
        this.checkCollisions(p0);

        this.drawParticle(p0);
      }
    }

    /*
     *  Add particles to the system - if total length is > 150000 or so, check:
     *  -- http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating/17368101#17368101
     */

  }, {
    key: 'injectParticles',
    value: function injectParticles(particles) {
      Array.prototype.push.apply(this.particles, particles);
    }

    /*
     *  Check and resolve collisions within a particle's mapper region
     */

  }, {
    key: 'checkCollisions',
    value: function checkCollisions(p0) {
      var region = this.mapper.regions[p0.mapperRegion];

      for (var r in region.particles) {
        if (region.particles.hasOwnProperty(r)) {
          var p1 = region.particles[r];

          if (p0.id === p1.id) {
            continue;
          }

          var result = this.collisioner.circleCollision(p0, p1);

          // Reslve collision
          if (result) {
            p0.color = p1.color = "red";
          }
        }
      }
    }

    /*
     *  Draw a single particle
     */

  }, {
    key: 'drawParticle',
    value: function drawParticle(p) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = p.color || '#000000';
      this.ctx.fill();
      this.ctx.closePath();
    }

    /*
     *  Draw Mappger Regions (for debugging)
     */

  }, {
    key: 'drawMappgerRegions',
    value: function drawMappgerRegions() {
      // Draw regions
      for (var r in this.mapper.regions) {
        if (this.mapper.regions.hasOwnProperty(r)) {

          if (this.regionMon) {
            if (!this.monitor.outputs.hasOwnProperty(r)) {
              this.monitor.newOutput(r);
            }

            this.monitor.out(r, Object.keys(_mRegion.particles).length);
          }

          var _mRegion = this.mapper.regions[r];
          this.ctx.beginPath();
          this.ctx.strokeStyle = _mRegion.color;
          this.ctx.rect(_mRegion.beginsAtX, _mRegion.beginsAtY, this.mapper.regionSize - 2, this.mapper.regionSize - 2);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }]);

  return ParticleManager;
}();

exports.default = ParticleManager;

},{"./Collisioner":4,"./Mapper":5,"./Monitor":6}],9:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}]},{},[1])


//# sourceMappingURL=app.js.map
