(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Utils = require('../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _ParticleManager = require('./lib/ParticleManager');

var _ParticleManager2 = _interopRequireDefault(_ParticleManager);

var _matter = require('./matter');

var _matter2 = _interopRequireDefault(_matter);

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
  var G = 9.8;
  var world = {
    G: G
  };

  var player = new _AnimationPlayer2.default({ fps: 60 });

  // Create particle fixtures
  var particlesFixtures = new Array(500);
  var matterTypes = Object.keys(_matter2.default);
  var neutralTypeIndex = matterTypes.indexOf('neutral');
  matterTypes.splice(neutralTypeIndex, 1);
  var totalMatterTypes = matterTypes.length;

  for (var i = 0; i < particlesFixtures.length; i++) {

    var randomMatter = Math.floor(Math.random() * totalMatterTypes) + 0;
    var matterType = matterTypes[randomMatter];

    var p = {
      x: _Utils2.default.randomRange(50, width - 50),
      y: _Utils2.default.randomRange(50, height - 50),
      mass: _Utils2.default.randomRange(1, 5),
      direction: _Utils2.default.randomRange(-1, 1),
      //speed: Utils.randomRange(0.5, 1),
      matter: matterType,
      boxBounce: { w: width, h: height }
    };

    particlesFixtures[i] = p;
  }

  // particlesFixtures[0] = {
  //   x: center.x-40,
  //   y: center.y,
  //   mass: 148,
  //   matter: "iron",
  //   direction: Math.PI*2,
  //   //speed: 0.9,
  //   boxBounce: { w: width, h: height }
  // };
  //
  // particlesFixtures[1] = {
  //   x: center.x+100,
  //   y: center.y,
  //   mass: 3,
  //   matter: "air",
  //   direction: Math.PI,
  //   //speed: 1.3,
  //   boxBounce: { w: width, h: height }
  // };

  var pmanager = new _ParticleManager2.default({
    debug: false
  }, world, ctx);

  // Create interaction maps
  // TODO: Check what happens with duplicated layers.
  var collisionRegionSize = 200;
  var gravityRegionSize = width;
  pmanager.addInteractionMap('collision', collisionRegionSize, 'collision');
  pmanager.addInteractionMap('gravity', gravityRegionSize, 'gravity');

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

},{"../../src/lib/AnimationPlayer":10,"../../src/lib/Utils":12,"./lib/ParticleManager":7,"./matter":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  'gravity': function gravity(a, b) {
    a.gravitateTo(b);
  },
  'collision': function collision(a, b) {
    var collision = a.collisionCheck(b);
    if (collision) {
      a.collisionHandle(b, collision);
    }
  }
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interactions = require('../interactions');

var _interactions2 = _interopRequireDefault(_interactions);

var _Utils = require('../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _MapperLayer = require('./MapperLayer');

var _MapperLayer2 = _interopRequireDefault(_MapperLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mapper = function () {
  function Mapper() {
    _classCallCheck(this, Mapper);

    this.layers = [];
    this.layerIndex = {};
  }

  /*
   *  Creates a new Layer in the Mapper
   */


  _createClass(Mapper, [{
    key: 'addLayer',
    value: function addLayer(id, regionSize, interactionFn) {

      if (typeof interactionFn === 'string' && _interactions2.default.hasOwnProperty(interactionFn)) {
        interactionFn = _interactions2.default[interactionFn];
      } else {
        console.warn('Mapper.addLayer: ' + interactionFn + ' is not a predefined Interaction');
      }

      var layer = new _MapperLayer2.default({
        id: id,
        regionSize: regionSize,
        interactionFn: interactionFn
      });

      this.layers.push(layer);
      this.layerIndex[id] = layer;

      return this.layerIndex[id];
    }

    /*
     *  Registers a particle in all the qualified regions of each Mapper Layer
     */

  }, {
    key: 'register',
    value: function register(p) {
      var mapperData = [];
      var totalLayers = this.layers.length;
      var points = _Utils2.default.getCirclePoints(p);
      var totalPoints = points.length;

      for (var x = 0; x < totalLayers; x++) {
        var layer = this.layers[x];
        var qualifiedRegions = [];

        this.unregister(p);

        for (var i = 0; i < totalPoints; i++) {
          var regionData = this.qualifyPoint(points[i], layer.id);
          var totalQualified = qualifiedRegions.length;
          var exists = false;

          for (var z = 0; z < totalQualified; z++) {
            if (qualifiedRegions[z].id === regionData.id) {
              exists = true;
              continue;
            }
          }

          if (!exists) {
            if (!layer.regionIndex.hasOwnProperty(regionData.id)) {
              layer.addRegion(regionData);
            }

            var region = layer.regionIndex[regionData.id];
            region.subscribe(p);
            qualifiedRegions.push(region);
          }
        }

        mapperData.push({
          id: layer.id,
          regions: qualifiedRegions
        });
      }

      p.mapperData = mapperData;
    }

    /*
     *  Unsubscribe particle from every Layer/Region and reset particle's mapper data
     */

  }, {
    key: 'unregister',
    value: function unregister(p) {
      var totalLayers = p.mapperData.length;
      for (var i = 0; i < totalLayers; i++) {
        var layerID = p.mapperData[i].id;
        var totalRegions = p.mapperData[i].regions.length;
        for (var r = 0; r < totalRegions; r++) {
          p.mapperData[i].regions[r].unsubscribe(p);
        }
      }

      this.reset(p);
    }

    /*
     *  Deletes all mapepr data from Particle
     */

  }, {
    key: 'reset',
    value: function reset(p) {
      p.mapperData = [];
    }

    /*
     *  Qualifies a single point into a Layer Region
     */

  }, {
    key: 'qualifyPoint',
    value: function qualifyPoint(pt, layerId) {
      var regionSize = this.layerIndex[layerId].regionSize;
      var xComponent = pt.x > regionSize ? Math.floor(Math.abs(pt.x / regionSize)) : 0;
      var yComponent = pt.y > regionSize ? Math.floor(Math.abs(pt.y / regionSize)) : 0;
      var data = {
        id: null,
        x: xComponent * regionSize,
        y: yComponent * regionSize
      };
      data.id = xComponent + "_" + yComponent;
      return data;
    }
  }]);

  return Mapper;
}();

exports.default = Mapper;

},{"../../../src/lib/Utils":12,"../interactions":2,"./MapperLayer":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapperRegion = require('./MapperRegion');

var _MapperRegion2 = _interopRequireDefault(_MapperRegion);

var _Utils = require('../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapperLayer = function () {
  function MapperLayer(settings) {
    _classCallCheck(this, MapperLayer);

    this.id = settings.id;
    this.regionSize = settings.regionSize;
    this.regions = [];
    this.regionIndex = {};
    this.interaction = settings.interactionFn;
    this.color = _Utils2.default.randomColor();
  }

  /*
   *  Creates a new Region in the Mapper
   */


  _createClass(MapperLayer, [{
    key: 'addRegion',
    value: function addRegion(regionData) {
      var region = new _MapperRegion2.default({
        id: regionData.id,
        x: regionData.x,
        y: regionData.y,
        size: this.regionSize,
        layer: this
      });

      this.regions.push(region);
      this.regionIndex[regionData.id] = region;
    }

    /*
     *  Iterates all Layer Regions and fires it's interaction function
     */

  }, {
    key: 'iterate',
    value: function iterate() {
      var totalRegions = this.regions.length;
      for (var x = 0; x < totalRegions; x++) {
        this.regions[x].interact();
      }
    }
  }]);

  return MapperLayer;
}();

exports.default = MapperLayer;

},{"../../../src/lib/Utils":12,"./MapperRegion":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapperRegion = function () {
  function MapperRegion(settings) {
    _classCallCheck(this, MapperRegion);

    this.id = settings.id;
    this.x = settings.x;
    this.y = settings.y;
    this.size = settings.size;
    this.layer = settings.layer;
    this.particles = [];
    this.totalParticles = 0;
    this.particleIndex = {};
  }

  /*
   *  Subscribes a Particle to the Region
   */


  _createClass(MapperRegion, [{
    key: "subscribe",
    value: function subscribe(p) {
      this.particles.push(p.id);
      this.particleIndex[p.id] = p;
      this.totalParticles++;
    }

    /*
     *  Unsubscribes a Particle from the Region
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe(p) {
      delete this.particleIndex[p.id];
      var index = this.particles.indexOf(p.id);
      this.particles.splice(index, 1);
      this.totalParticles--;
    }

    /*
     *  Iterates through al particles running the interaction function
     */

  }, {
    key: "interact",
    value: function interact() {
      for (var i = 0; i < this.totalParticles; i++) {
        var A = this.particleIndex[this.particles[i]];
        for (var y = 0; y < this.totalParticles; y++) {
          var B = this.particleIndex[this.particles[y]];
          if (A.id === B.id) {
            continue;
          }
          this.layer.interaction(A, B);
        }
      }
    }

    /*
     *  Draws the region on screen (debugging)
     */

  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.strokeStyle = "#FFFFFF";
      ctx.fillStyle = this.layer.color;
      ctx.rect(this.x, this.y, this.layer.regionSize, this.layer.regionSize);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }]);

  return MapperRegion;
}();

exports.default = MapperRegion;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

var _Particle2 = require('../../../src/lib/Particle');

var _Particle3 = _interopRequireDefault(_Particle2);

var _matter = require('../matter.js');

var _matter2 = _interopRequireDefault(_matter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleExt = function (_Particle) {
  _inherits(ParticleExt, _Particle);

  function ParticleExt(settings) {
    _classCallCheck(this, ParticleExt);

    var _this = _possibleConstructorReturn(this, (ParticleExt.__proto__ || Object.getPrototypeOf(ParticleExt)).call(this, settings));

    _this.matter = _matter2.default[settings.matter] || _matter2.default.neutral;
    _this.color = _this.matter.color;
    _this.radius = _this.mass / _this.matter.density;
    _this.mapperData = [];
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

    /*
     *  Adds to the velocity vector dividing by the mass
     */

  }, {
    key: 'applyForce',
    value: function applyForce(f) {
      this.vx += f.x / this.mass;
      this.vy += f.y / this.mass;
    }

    /*
     *  Calculates and applies a gravitation vector to a given particle
     */

  }, {
    key: 'gravitateTo',
    value: function gravitateTo(p, gravityFactor) {
      gravityFactor = gravityFactor || 0.1;

      var radiusSum = this.radius + p.radius;
      var massFactor = this.mass * p.mass;

      var dx = p.x - this.x;
      var dy = p.y - this.y;
      var distSQ = dx * dx + dy * dy;
      var dist = Math.sqrt(distSQ);
      var surfaceDist = dist - radiusSum;

      // Cancel gravitation once objects collide
      // TODO: Verify if we can save the Math.sqrt() comparing squares
      if (dist < radiusSum) {
        return;
      }

      var force = gravityFactor * massFactor / (dist * dist);

      var gravityVector = {
        x: dx / dist * force,
        y: dy / dist * force
      };

      this.applyForce(gravityVector);
    }

    /*
        Check for Circle-Circle collisions and return details
    */

  }, {
    key: 'collisionCheck',
    value: function collisionCheck(p) {
      // Get the Distance vector (difference in position)
      var xDist = this.x - p.x;
      var yDist = this.y - p.y;

      // We'll save a Math.sqrt() to verify distances like this:
      var distSquared = xDist * xDist + yDist * yDist;
      var radiusSquared = (this.radius + p.radius) * (this.radius + p.radius);

      // Collision check
      if (distSquared < radiusSquared) {

        // Once collided, get the Displacement vector (difference in velocity)
        var xVelocity = p.vx - this.vx;
        var yVelocity = p.vy - this.vy;

        // Project the Collision vector over the Distance vector
        var dotProduct = xDist * xVelocity + yDist * yVelocity;

        /*
         *
         *
         *  Hi, welcome to this "Dot Product" implementation 101.
         *
         *    Dot Product will tell if both particles ara heading one to the other, and if they are
         *    actually colliding or will collide in the future.
         *
         *    Think of it as if we where calculating the difference in Distance (or position) and
         *    the difference in Speed (lenth) of both objects. To do this, we substract vector values.
         *
         *    When the difference in angles and speeds between the two moving objects are both:
         *
         *    Negative: NO collision; maybe exact oposite direction but still yet
         *              too far to collide -at this time (maybe next tick)
         *
         *    Cero:     COLLISION; a perfect collision in direction, acceleration and time
         *
         *    Positive: COLLISION; exact direction; and the resulting force from the collision
         *
         *
         */
        if (dotProduct > 0) {

          // The resulting force from the collision (angle difference + velocity difference)
          var collisionScale = dotProduct / distSquared;

          // // Collision Vector:
          var collision = {
            x: xDist * collisionScale,
            y: yDist * collisionScale
          };

          return collision;
        }
      }

      return false;
    }

    /*
        2D Elastic collision handling
    */

  }, {
    key: 'collisionHandle',
    value: function collisionHandle(p, collisionVector) {

      // 2D-Elastic collision formula
      var combinedMass = this.mass + p.mass;
      var collisionWeight0 = 2 * p.mass / combinedMass * p.matter.restitution;
      var collisionWeight1 = 2 * this.mass / combinedMass * this.matter.restitution;

      // Adds the computed collision results to the velocities of this / p
      this.vx += collisionWeight0 * collisionVector.x;
      this.vy += collisionWeight0 * collisionVector.y;
      p.vx -= collisionWeight1 * collisionVector.x;
      p.vy -= collisionWeight1 * collisionVector.y;
    }
  }]);

  return ParticleExt;
}(_Particle3.default);

exports.default = ParticleExt;

},{"../../../src/feature-toggle":9,"../../../src/lib/Particle":11,"../matter.js":8}],7:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleManager = function () {
  function ParticleManager(settings, world, ctx) {
    _classCallCheck(this, ParticleManager);

    this.world = world;
    this.ctx = ctx;
    this.mapper = new _Mapper2.default();
    this.interactionMaps = [];
    this.particles = [];
    this.DEBUG_MODE = settings.debug || false;
  }

  /*
   *  General Mapper update method
   */


  _createClass(ParticleManager, [{
    key: 'update',
    value: function update() {
      this.updateParticles();
      this.runInteractions();
    }

    /*
     *  Debugging: draws all regions and total particles on screen
     */

  }, {
    key: 'debugDrawRegions',
    value: function debugDrawRegions(displayParticleCount) {
      var totalLayers = this.mapper.layers.length;
      var body = document.getElementsByTagName("BODY")[0];

      for (var i = 0; i < totalLayers; i++) {
        var layer = this.mapper.layers[i];
        var totalRegions = layer.regions.length;

        for (var x = 0; x < totalRegions; x++) {
          var region = layer.regions[x];

          // Skip empty regions
          if (region.totalParticles > 0) {
            region.draw(this.ctx);

            if (displayParticleCount) {
              var docFragment = document.createDocumentFragment();
              var obj = void 0;

              if (!(obj = document.getElementById(region.id))) {
                obj = document.createElement("p");
                obj.innerHTML = region.totalParticles;
                obj.id = region.id;
                obj.style.position = "absolute";
                obj.style.left = region.x + 2 + "px";
                obj.style.top = region.y - 5 + "px";
                obj.style.fontSize = "0.5em";
                obj.style.color = "#FFFFFF";

                docFragment.appendChild(obj);
                body.appendChild(docFragment);
              }

              obj.innerHTML = region.totalParticles;
            }
          }
        }
      }
    }

    /*
     *  Update particle's state
     */

  }, {
    key: 'updateParticles',
    value: function updateParticles() {
      var totalParticles = this.particles.length;
      for (var i = 0; i < totalParticles; i++) {
        var p = this.particles[i];

        // Update particle position
        p.update();

        // Register particle in the Mapper
        this.mapper.register(p);
      }
    }

    /*
     *  Creates a new mapper layer.
     *  @interaction:   predefined interaction | callbackFn(a, b);
     */

  }, {
    key: 'addInteractionMap',
    value: function addInteractionMap(id, size, interactionFn) {
      this.mapper.addLayer(id, size, interactionFn);
    }

    /*
     *  Force interaction loop
     */

  }, {
    key: 'runInteractions',
    value: function runInteractions() {
      var totalInteractions = this.mapper.layers.length;
      for (var i = 0; i < totalInteractions; i++) {
        this.mapper.layers[i].iterate();
      }
    }

    /*
     *  Draw loop
     */

  }, {
    key: 'draw',
    value: function draw() {
      // Draw mapper regions (debugging)
      if (this.DEBUG_MODE) {
        this.debugDrawRegions(true);
      }

      // Draw particles
      var totalParticles = this.particles.length;
      for (var i = 0; i < totalParticles; i++) {
        this.particles[i].draw(this.ctx);
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
        this.particles.push(particle);
      }
    }
  }]);

  return ParticleManager;
}();

exports.default = ParticleManager;

},{"../../../src/lib/Utils":12,"./Mapper":3,"./ParticleExt":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  neutral: {
    density: 1,
    color: "rgba(255,255,255,0.6)",
    restitution: 1
  },
  iron: {
    density: 1.7874,
    color: "#434b9d",
    restitution: 0.85
  },
  sand: {
    density: 1.1553,
    color: "rgba(194, 178, 128, 0.8)",
    restitution: 0.31
  },
  water: {
    density: 0.9997,
    color: "rgba(64, 164, 223, 0.6)",
    restitution: 0.13
  },
  air: {
    density: 0.1257,
    color: "rgba(115, 216, 237, 0.3)",
    restitution: 0.3
  }
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../../src/feature-toggle":9}],11:[function(require,module,exports){
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

},{"../../src/feature-toggle":9}],12:[function(require,module,exports){
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

},{"../../src/feature-toggle":9}]},{},[1])


//# sourceMappingURL=app.js.map
