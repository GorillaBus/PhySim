(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Utils = require('../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _ParticleManager = require('./lib/ParticleManager');

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

  // World settings
  var G = 0.4;
  var world = {
    G: G
  };

  var player = new _AnimationPlayer2.default({ fps: 60 });

  // Create particle fixtures
  var particlesFixtures = new Array(100);

  for (var i = 0; i < particlesFixtures.length; i++) {
    var p = {
      x: _Utils2.default.randomRange(50, width - 50),
      y: _Utils2.default.randomRange(50, height - 50),
      mass: _Utils2.default.randomRange(1, 3),
      // direction: Utils.randomRange(-1, 1),
      // speed: Utils.randomRange(0.5, 1),
      boxBounce: { w: width, h: height }
    };

    particlesFixtures[i] = p;
  }

  var regionSize = 15 * 4;
  var pmanager = new _ParticleManager2.default({
    regionDraw: false,
    mapper: {
      collision: {
        regionSize: regionSize
      },
      gravity: {
        regionSize: 500
      }
    }
  }, world, ctx);

  // Add particlesFixtures into the Mapper
  pmanager.addParticles(particlesFixtures);

  // Demo player setup
  player.setUpdateFn(update);
  player.play();

  // Frame drawing function
  function update() {

    // Update particle's state
    pmanager.update();

    // Clear full screen
    ctx.clearRect(0, 0, width, height);

    // Global draw
    pmanager.draw();
  }
};

},{"../../src/lib/AnimationPlayer":8,"../../src/lib/Utils":10,"./lib/ParticleManager":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collide = function () {
  function Collide() {
    _classCallCheck(this, Collide);
  }

  _createClass(Collide, [{
    key: "elastic2D",


    /*
     *  2D Elastic Collision
     *
     *  Formula used:
     *  Final Vel 1 =  Velocity += (2 * mass2) / (mass1 + mass2)
     *  Final Vel 2 =  Velocity -= (2 * mass1) / (mass1 + mass2)
     *
     */
    value: function elastic2D(p0, p1, collisionV) {

      // 2D-Elastic collision formula
      var combinedMass = p0.mass + p1.mass;
      var collisionWeight0 = 2 * p1.mass / combinedMass;
      var collisionWeight1 = 2 * p0.mass / combinedMass;

      // Adds the computed collision results to the velocities of p0 / p1
      p0.vx += collisionWeight0 * collisionV.x;
      p0.vy += collisionWeight0 * collisionV.y;
      p1.vx -= collisionWeight1 * collisionV.x;
      p1.vy -= collisionWeight1 * collisionV.y;
    }
  }]);

  return Collide;
}();

exports.default = Collide;

},{}],3:[function(require,module,exports){
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
      // Calculate the Distance Vector
      var xDist = p0.x - p1.x;
      var yDist = p0.y - p1.y;
      var distSquared = xDist * xDist + yDist * yDist;
      var radiusSquared = (p0.radius + p1.radius) * (p0.radius + p1.radius);

      // Check collision: using squared distances, same result and saves one Math.sqrt()
      if (distSquared < radiusSquared) {

        // Calculate if particles are moving towards each other or away (after a previous collision)
        var xVelocity = p1.vx - p0.vx;
        var yVelocity = p1.vy - p0.vy;
        var dotProduct = xDist * xVelocity + yDist * yVelocity;

        // If particles are moving away (already collided) return
        if (dotProduct <= 0) {
          return false;
        }

        // Collision Vector: the speed difference projected over the Distance Vector
        // This is the component for the speed difference for the collision
        var collisionScale = dotProduct / distSquared;
        var collision = {
          x: xDist * collisionScale,
          y: yDist * collisionScale
        };

        return collision;
      }

      return false;
    }
  }]);

  return Collisioner;
}();

exports.default = Collisioner;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = function () {

  /*
   *  Each layer holds regions in which particles may subscribe to interact with other particles
   *
   */
  function Mapper(settings) {
    _classCallCheck(this, Mapper);

    this.layers = {};

    // GRAVITY layer
    if (settings.hasOwnProperty('gravity')) {
      this.layers.gravity = {
        regionSize: settings.gravity.regionSize || 500,
        regions: {}
      };
    }

    // COLLISION layer
    if (settings.hasOwnProperty('collision')) {
      this.layers.collision = {
        regionSize: settings.collision.regionSize || 100,
        regions: {}
      };
    }
  }

  /*
   *  Subscribes particle 'p' to region 'rLabel'
   */


  _createClass(Mapper, [{
    key: 'subscribe',
    value: function subscribe(p, layer, rLabel) {
      this.layers[layer].regions[rLabel].particles[p.id] = p;
    }

    /*
     *  Unsubscribe particle 'p' from region 'rLabel'
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(p, layer, rLabel) {
      delete this.layers[layer].regions[rLabel].particles[p.id];
    }

    /*
     *  Update map state
     */

  }, {
    key: 'update',
    value: function update(p) {

      // Qualify particle in the mapper and get the layer => region data
      var rData = this.qualifyParticle(p);

      for (var layer in rData.layerRegionData) {
        if (rData.layerRegionData.hasOwnProperty(layer)) {

          if (!p.mapperRegions.hasOwnProperty(layer)) {
            p.mapperRegions[layer] = [];
          }

          if (this.regionsCompare(layer, rData.layerRegionData, p.mapperRegions)) {
            continue;
          }

          // Areas have changed: unsubscribe particle from any region
          // TODO: Can we remove validation?
          for (var i = 0; i < p.mapperRegions[layer].length; i++) {
            this.unsubscribe(p, layer, p.mapperRegions[layer][i]);
          }

          // Create regions if they doesn't exist already
          for (var reg in rData.layerRegionData[layer].regions) {

            if (!this.layers[layer].regions.hasOwnProperty(reg)) {
              this.createRegion(layer, reg, rData.layerRegionData[layer].regions[reg]);
            }

            // Insert particle into the region stack if it's not already inside
            this.subscribe(p, layer, reg);
          }

          // Update particle regions register
          p.mapperRegions[layer] = rData.ptLabels[layer].regions;
        }
      }
    }

    /*
     *  Get particle's region data.
     *  NOTE: For now we'll consider that every particle is circular
     */

  }, {
    key: 'qualifyParticle',
    value: function qualifyParticle(p) {
      var points = _Utils2.default.getCirclePoints(p);
      var layers = {};
      var layerRegionData = {};

      for (var layer in this.layers) {
        if (this.layers.hasOwnProperty(layer)) {
          var tempRegions = [];
          var regionLabels = [];

          if (!layers.hasOwnProperty(layer)) {
            // Holds the structure to update particle's subscribbed regions (array of region labels)
            layers[layer] = {
              regions: []
            };

            // Holds the structure with data to identify region boundries
            layerRegionData[layer] = {
              regions: {}
            };
          }

          for (var i = 0; i < points.length; i++) {
            var ptRegion = this.qualilyPoint(points[i], layer);

            if (regionLabels.indexOf(ptRegion.rLabel) === -1) {
              regionLabels.push(ptRegion.rLabel);

              layerRegionData[layer].regions[ptRegion.rLabel] = {
                rX: ptRegion.rX,
                rY: ptRegion.rY
              };
            }
          }

          layers[layer].regions = regionLabels;
          //layerRegionData[layer].regions[] = tempRegions;
        }
      }

      // Save points on particle for debugging
      if (!p.points.length) {
        p.points = points;
      }

      return { ptLabels: layers, layerRegionData: layerRegionData };
    }

    /*
     *  Qualify a single point within a region
     */

  }, {
    key: 'qualilyPoint',
    value: function qualilyPoint(p, layer) {
      var regionSize = this.layers[layer].regionSize;

      var rData = {
        rX: p.x > regionSize ? Math.floor(Math.abs(p.x / regionSize)) : 0,
        rY: p.y > regionSize ? Math.floor(Math.abs(p.y / regionSize)) : 0,
        rLabel: ""
      };
      rData.rLabel = rData.rX + "_" + rData.rY;

      return rData;
    }

    /*
     *  Create a new region
     */

  }, {
    key: 'createRegion',
    value: function createRegion(layer, label, rData) {
      var layerObj = this.layers[layer];

      // Pre-calculate region offset
      var rOffsetX = rData.rX * layerObj.regionSize;
      var rOffsetY = rData.rY * layerObj.regionSize;

      layerObj.regions[label] = {
        color: "#000000".replace(/0/g, function () {
          return (~~(Math.random() * 16)).toString(16);
        }),
        particles: {},
        beginsAtX: rOffsetX,
        beginsAtY: rOffsetY,
        endsAtX: rOffsetX + layerObj.regionSize,
        endsAtY: rOffsetY + layerObj.regionSize
      };
    }

    /*
     *  Helper: Compares two region array structures, returns true when equal
     */

  }, {
    key: 'regionsCompare',
    value: function regionsCompare(layer, reg1, reg2) {

      if (!reg2.hasOwnProperty(layer)) {
        return false;
      }

      if (Object.keys(reg1[layer].regions).length !== reg2[layer].length) {
        return false;
      }

      for (var region in reg1[layer].regions) {

        if (!reg2[layer].indexOf(region) === -1) {
          return false;
        }

        // for(let i = Object(reg1[label].regions).keys.length; i--;) {
        //     if(reg1[label].regions[i] !== reg2[label].regions[i]) {
        //       return false;
        //     }
        // }
      }

      return true;
    }
  }]);

  return Mapper;
}();

exports.default = Mapper;

},{"../../../src/lib/Utils":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

var _Particle2 = require('../../../src/lib/Particle');

var _Particle3 = _interopRequireDefault(_Particle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleExt = function (_Particle) {
  _inherits(ParticleExt, _Particle);

  function ParticleExt(settings) {
    _classCallCheck(this, ParticleExt);

    var _this = _possibleConstructorReturn(this, (ParticleExt.__proto__ || Object.getPrototypeOf(ParticleExt)).call(this, settings));

    _this.mapperRegions = settings.mapperRegions || {};
    _this.points = settings.points || [];
    return _this;
  }

  _createClass(ParticleExt, [{
    key: 'draw',
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }]);

  return ParticleExt;
}(_Particle3.default);

exports.default = ParticleExt;

},{"../../../src/feature-toggle":7,"../../../src/lib/Particle":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = require('../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _ParticleExt = require('./ParticleExt');

var _ParticleExt2 = _interopRequireDefault(_ParticleExt);

var _Mapper = require('./Mapper');

var _Mapper2 = _interopRequireDefault(_Mapper);

var _Collisioner = require('./Collisioner');

var _Collisioner2 = _interopRequireDefault(_Collisioner);

var _Collide = require('./Collide');

var _Collide2 = _interopRequireDefault(_Collide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleManager = function () {
  function ParticleManager(settings, world, ctx) {
    _classCallCheck(this, ParticleManager);

    this.world = world;
    this.ctx = ctx;
    this.mapper = new _Mapper2.default(settings.mapper);
    this.collisioner = new _Collisioner2.default();
    this.collide = new _Collide2.default();
    this.regionDraw = settings.regionDraw || false;
    this.particles = [];
    this.greaterRadius = 0;
  }

  /*
  *  Update loop - general
  */


  _createClass(ParticleManager, [{
    key: 'update',
    value: function update() {
      this.updateParticles();
      this.interact();
    }

    /*
    *  Update particle's state and force regions
    */

  }, {
    key: 'updateParticles',
    value: function updateParticles() {
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];

        // Update particle position
        p.update();

        // Update region status
        this.mapper.update(p);
      }
    }

    /*
    *  Force interaction loop
    */

  }, {
    key: 'interact',
    value: function interact() {
      for (var i = 0; i < this.particles.length; i++) {
        var p0 = this.particles[i];

        // Check collisions with particles from the same region
        this.handleCollisions(p0);

        // Apply gravity force to neighbour particles
        this.handleAttraction(p0);
      }
    }

    /*
    *  Draw loop
    */

  }, {
    key: 'draw',
    value: function draw() {

      // Draw mapper regions (debugging)
      if (this.regionDraw) {
        this.drawMappgerRegions();
      }

      // Draw particles
      for (var i = 0; i < this.particles.length; i++) {
        var p0 = this.particles[i];

        // Draw particle
        p0.draw(this.ctx);
      }
    }

    /*
    *  Add particles to the system - if total length is > 150000 or so, check:
    */

  }, {
    key: 'addParticles',
    value: function addParticles(settings) {

      for (var i = 0; i < settings.length; i++) {
        var particle = new _ParticleExt2.default(settings[i]);

        particle.id = _Utils2.default.uniqueID();

        if (particle.radius > this.greaterRadius) {
          this.greaterRadius = particle.radius;
        }

        this.particles.push(particle);
      }
    }
  }, {
    key: 'handleAttraction',
    value: function handleAttraction(p0) {
      // TODO: Is this really necesary?
      if (!p0.mapperRegions.hasOwnProperty('gravity')) {
        return false;
      }

      for (var i = 0; i < p0.mapperRegions['gravity'].length; i++) {
        var rLabel = p0.mapperRegions['gravity'][i];
        var region = this.mapper.layers['gravity'].regions[rLabel];
        for (var r in region.particles) {

          if (region.particles.hasOwnProperty(r)) {
            var p1 = region.particles[r];

            if (p0.id === p1.id) {
              continue;
            }

            p0.gravitateTo(p1, this.world.G);
          }
        }
      }
    }

    /*
    *  Check and resolve collisions within a particle's mapper region
    */

  }, {
    key: 'handleCollisions',
    value: function handleCollisions(p0) {
      // TODO: Is this really necesary?
      if (!p0.mapperRegions.hasOwnProperty('collision')) {
        return false;
      }

      for (var i = 0; i < p0.mapperRegions['collision'].length; i++) {
        var rLabel = p0.mapperRegions['collision'][i];
        var region = this.mapper.layers['collision'].regions[rLabel];
        for (var r in region.particles) {

          if (region.particles.hasOwnProperty(r)) {
            var p1 = region.particles[r];

            if (p0.id === p1.id) {
              continue;
            }

            var collision = this.collisioner.circleCollision(p0, p1);

            // Reslve collision
            if (collision) {
              this.collide.elastic2D(p0, p1, collision);
            }
          }
        }
      }
    }

    /*
    *  Draw Mappger Regions (for debugging)
    */

  }, {
    key: 'drawMappgerRegions',
    value: function drawMappgerRegions() {

      // Draw layer regions
      for (var layer in this.mapper.layers) {
        if (this.mapper.layers.hasOwnProperty(layer)) {
          var layerObj = this.mapper.layers[layer];

          for (var r in layerObj.regions) {
            if (layerObj.regions.hasOwnProperty(r)) {

              var mRegion = layerObj.regions[r];
              this.ctx.beginPath();
              this.ctx.strokeStyle = mRegion.color;
              this.ctx.rect(mRegion.beginsAtX, mRegion.beginsAtY, layerObj.regionSize - 2, layerObj.regionSize - 2);
              this.ctx.stroke();
              this.ctx.closePath();
            }
          }
        }
      }
    }
  }]);

  return ParticleManager;
}();

exports.default = ParticleManager;

},{"../../../src/lib/Utils":10,"./Collide":2,"./Collisioner":3,"./Mapper":4,"./ParticleExt":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

        // FPS control
        if (_featureToggle2.default.FPS_CONTROL) {
          _this2.now = Date.now();
          _this2.delta = _this2.now - _this2.lastTime;

          if (_this2.delta > _this2.interval) {
            _this2.lastTime = _this2.now - _this2.delta % _this2.interval;
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

},{"../../src/feature-toggle":7}],9:[function(require,module,exports){
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

        this.color = settings.color || 'rgba(0,0,0,0.6)';
        this.boxBounce = settings.boxBounce || false;
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

            if (this.boxBounce) {
                this.checkBorders(this.boxBounce.w, this.boxBounce.h);
            }
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

},{"../../src/feature-toggle":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require("../../src/feature-toggle");

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.cache = {};
  }

  _createClass(Utils, [{
    key: "cacheStore",
    value: function cacheStore(caller, key, value) {
      if (!this.cache.hasOwnProperty(caller)) {
        this.cache[caller] = {};
      }
      this.cache[caller][key] = value;
    }
  }, {
    key: "cacheRetrieve",
    value: function cacheRetrieve(caller, key) {
      var fnCache = this.cache[caller] || [];
      var value = fnCache[key] || false;
      return value;
    }

    /*
     *  Get 'n' points from a circular shaped 'Particle' object
     */

  }, {
    key: "getCirclePoints",
    value: function getCirclePoints(p, n, radius) {
      n = n || 8;
      radius = radius || p.radius || 0;

      var angle = -1;
      var angleStep = Math.PI * 2 / n;
      var points = [];

      for (var i = 0; i < n; i++) {
        var cData = this.cacheRetrieve("getCirclePoints", angle);
        var cos = cData.cos || Math.cos(angle);
        var sin = cData.sin || Math.sin(angle);
        var pt = {
          x: p.x + cos * p.radius,
          y: p.y + sin * p.radius
        };
        points.push(pt);
        if (!cData) {
          this.cacheStore("getCirclePoints", angle, { cos: cos, sin: sin });
        }
        angle += angleStep;
      }

      // Add the center point
      return points;
    }
  }, {
    key: "montecarlo",
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
    key: "lerp",
    value: function lerp(norm, min, max) {
      return (max - min) * norm + min;
    }
  }, {
    key: "quadraticBezier",
    value: function quadraticBezier(p0, p1, p2, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
      pFinal.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
      return pFinal;
    }
  }, {
    key: "cubicBezier",
    value: function cubicBezier(p0, p1, p2, p3, t, pFinal) {
      pFinal = pFinal || {};
      pFinal.x = Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x;
      pFinal.y = Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y;
      return pFinal;
    }
  }, {
    key: "distance",
    value: function distance(p0, p1) {
      var dx = p0.x - p1.x;
      var dy = p0.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }, {
    key: "distanceXY",
    value: function distanceXY(x0, y0, x1, y1) {
      var dx = x1 - x0;
      var dy = y1 - y0;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // TODO: Check if and why we need to parseInt() the result

  }, {
    key: "mapRange",
    value: function mapRange(value, low1, high1, low2, high2) {
      return result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      var result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      if (low2 === parseInt(low2, 10) || high2 === parseInt(high2, 10)) {
        result = parseInt(result);
      }
      return result;
    }
  }, {
    key: "inRange",
    value: function inRange(value, min, max) {
      return value >= Math.min(min, max) && value <= Math.max(min, max);
    }
  }, {
    key: "rangeIntersect",
    value: function rangeIntersect(min0, max0, min1, max1) {
      return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    }
  }, {
    key: "randomRange",
    value: function randomRange(min, max) {
      return min + Math.random() * (max - min);
    }
  }, {
    key: "circleCollision",
    value: function circleCollision(c0, c1) {
      return this.distance(c0, c1) <= c0.radius + c1.radius;
    }
  }, {
    key: "rectangleCollision",
    value: function rectangleCollision(r0, r1) {
      return this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) && this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }
  }, {
    key: "circlePointCollision",
    value: function circlePointCollision(px, py, circle) {
      return this.distanceXY(px, py, circle.x, circle.y) < circle.radius;
    }
  }, {
    key: "rectanglePointCollision",
    value: function rectanglePointCollision(px, py, rect) {
      return this.inRange(px, rect.x, rect.x + rect.width) && this.inRange(py, rect.y, rect.y + rect.height);
    }
  }, {
    key: "uniqueID",
    value: function uniqueID() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }, {
    key: "randomColor",
    value: function randomColor() {
      return "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
      });
    }
  }]);

  return Utils;
}();

var instance = new Utils();

exports.default = instance;

},{"../../src/feature-toggle":7}]},{},[1])


//# sourceMappingURL=app.js.map
