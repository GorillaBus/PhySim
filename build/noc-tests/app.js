(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _AnimationPlayer = require('../../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Vector = require('../../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

var _Utils = require('../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Vehicle = require('./lib/Vehicle');

var _Vehicle2 = _interopRequireDefault(_Vehicle);

var _FlowField = require('./lib/FlowField');

var _FlowField2 = _interopRequireDefault(_FlowField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight - 4;
  var center = { x: width / 2, y: height / 2 };

  canvas.height = height;
  canvas.width = width;

  var source = {
    res: {
      x: 0.08,
      y: 0.08,
      z: 0.08
    },
    seed: Math.random()
  };
  var flowField = new _FlowField2.default(width, height, 100, 60, source, ctx);

  var elapsedTime = 0;
  var timeStep = 3000;
  var cars = [];
  var totalCars = 10;

  for (var i = 0; i < totalCars; i++) {
    cars[i] = new _Vehicle2.default(_Utils2.default.randomRange(0, width), _Utils2.default.randomRange(0, height), _Utils2.default.randomRange(2, 5), Math.PI * 2, _Utils2.default.randomRange(3, 5), _Utils2.default.randomRange(0.8, 7), _Utils2.default.randomRange(0.05, 2));
  }

  // Demo player
  var player = new _AnimationPlayer2.default();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();

  function updateFn(delta, elapsed) {
    ctx.clearRect(0, 0, width, height);

    elapsedTime += delta;

    var newZ = Math.floor(elapsedTime / timeStep);
    if (newZ > flowField.depth - 1) {
      newZ = 0;
      elapsedTime = 0;
    }
    if (newZ !== flowField.zIndex) {
      flowField.pushZ();
    }

    flowField.draw();

    for (var _i = 0; _i < totalCars; _i++) {
      var car = cars[_i];
      car.update();

      if (car.location.getY() > flowField.height || car.location.getY() < 0 || car.location.getX() > flowField.width || car.location.getX() < 0) {
        car.location.setY(_Utils2.default.randomRange(0, flowField.height));
        car.location.setX(0);
        car.velocity.multiplyBy(0);
      }

      car.follow(flowField);
      car.draw(ctx);
    }
  }

  document.onclick = function (e) {
    var car = new _Vehicle2.default(e.clientX, e.clientY, 5, Math.PI * 2, 10, 0);
    cars.push(car);
    totalCars++;
  };
};

},{"../../../src/lib/AnimationPlayer":5,"../../../src/lib/Utils":9,"../../../src/lib/Vector":10,"./lib/FlowField":2,"./lib/Vehicle":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require('../../../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

var _Utils = require('../../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

var _Perlin = require('../../../../src/lib/Perlin');

var _Perlin2 = _interopRequireDefault(_Perlin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowField = function () {
  function FlowField(w, h, z, resolution, source) {
    _classCallCheck(this, FlowField);

    this.ctx;
    this.width = w;
    this.height = h;
    this.field = [];
    this.resolution = resolution || 10;
    this.rows = Math.round(w / this.resolution);
    this.cols = Math.round(h / this.resolution);
    this.depth = z >= 1 ? z : 1;
    this.zIndex = 0;
    this.mustRedraw = false;
    this.isReady = false;
    this.initField(source);
  }

  _createClass(FlowField, [{
    key: 'pushZ',
    value: function pushZ() {
      this.zIndex++;
      if (this.zIndex >= this.depth) {
        this.zIndex = 0;
      }
      this.mustRedraw = true;
    }
  }, {
    key: 'lookup',
    value: function lookup(vector) {
      var x = vector.getX() / this.resolution;
      var y = vector.getY() / this.resolution;
      var col = parseInt(_Utils2.default.constrain(y, 0, this.cols - 1));
      var row = parseInt(_Utils2.default.constrain(x, 0, this.rows - 1));
      return this.field[this.zIndex][col][row].copy();
    }
  }, {
    key: 'initField',
    value: function initField(source) {
      var type = typeof source === 'undefined' ? 'undefined' : _typeof(source);

      switch (type) {
        case 'string':

          if (source === 'special') {
            this.gridFromSpecial();
          } else {
            this.gridFromImage(source);
          }
          break;

        case 'object':
          this.gridFromPerlin(source);
          break;

        default:
          console.error("FlowField :: createField: invalid source.");
          return false;
      }
    }
  }, {
    key: 'createGrid',
    value: function createGrid(vectors) {
      if (!this.ctx) {
        this.ctx = this.createCanvas();
      }

      this.field = vectors;
      this.mustRedraw = true;
      this.isReady = true;
    }
  }, {
    key: 'gridFromImage',
    value: function gridFromImage(imageSrc) {
      var _this = this;

      this.getVectorsFromImage(imageSrc, function (vectors) {
        _this.createGrid(vectors);
      });
    }
  }, {
    key: 'gridFromPerlin',
    value: function gridFromPerlin(source) {
      source = source || {};
      var vectors = this.getVectorsFromPerlinNoise(source.seed, source.res);
      this.createGrid(vectors);
    }
  }, {
    key: 'gridFromSpecial',
    value: function gridFromSpecial() {
      var vectors = this.getSpecialVectors();
      this.createGrid(vectors);
    }
  }, {
    key: 'getSpecialVectors',
    value: function getSpecialVectors() {
      var vectors = [];
      for (var z = 0; z < this.depth; z++) {
        vectors[z] = [];
        for (var i = 0; i < this.cols; i++) {
          vectors[z][i] = new Array(this.rows);
          for (var j = 0; j < this.rows; j++) {

            var angle = void 0;
            var prob = Math.random();
            if (prob < 0.85) {
              angle = _Utils2.default.randomRange(0.2, 0.6);
            } else {
              angle = _Utils2.default.randomRange(-0.9, 0.1);
            }

            var vector = new _Vector2.default({
              x: Math.cos(angle),
              y: Math.sin(angle)
            });
            vectors[z][i][j] = vector;
          }
        }
      }

      return vectors;
    }
  }, {
    key: 'getVectorsFromPerlinNoise',
    value: function getVectorsFromPerlinNoise(seed, res) {
      res = res || {};
      res = {
        x: res.x || 0.02,
        y: res.y || 0.02,
        z: res.z || 0.02
      };
      seed = seed || Math.random();

      var noise = new _Perlin2.default();
      noise.seed(seed);
      var xOff = 0;
      var yOff = 0;
      var zOff = 0;
      var vectors = [];

      for (var z = 0; z < this.depth; z++) {
        vectors[z] = [];
        for (var i = 0; i < this.cols; i++) {
          yOff = 0;
          vectors[z][i] = new Array(this.rows);
          for (var j = 0; j < this.rows; j++) {
            var noiseVal = noise.noise(xOff, yOff, zOff);
            var angle = _Utils2.default.mapRange(noiseVal, 0, 1, -1, 1);
            var vector = new _Vector2.default({
              x: Math.cos(angle),
              y: Math.sin(angle)
            });
            vectors[z][i][j] = vector;
            yOff += res.y;
          }
          xOff += res.x;
        }
        zOff += res.z;
      }

      return vectors;
    }
  }, {
    key: 'getVectorsFromImage',
    value: function getVectorsFromImage(imageSrc, cb) {
      var image = new Image();

      image.src = imageSrc;
      image.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = this.width;
        canvas.height = this.height;
        document.getElementsByTagName("BODY")[0].appendChild(canvas);
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, this.width, this.height);
        var vectors = [[]];

        for (var i = 0; i < this.cols; i++) {
          vectors[0][i] = new Array(this.rows);

          for (var j = 0; j < this.rows; j++) {
            var brightness = this.imageGetBlockValue(imageData, i, j);
            var angle = _Utils2.default.mapRange(brightness, 0, 255, -1, 1);
            var vector = new _Vector2.default({
              x: Math.cos(angle),
              y: Math.sin(angle)
            });

            vectors[0][i][j] = vector;
          }
        }

        cb(vectors);
      }.bind(this);
    }
  }, {
    key: 'imageGetBlockValue',
    value: function imageGetBlockValue(imageData, col, row) {
      var pixelData = 4;
      var blockSize = this.resolution * pixelData;
      var blockSizeSquare = this.resolution * blockSize;
      var start = col * blockSize + row * this.width * blockSize;
      var end = start + blockSize;
      var nextOffset = this.cols * blockSize;
      var cut = start + nextOffset * this.resolution;
      var acum = 0;
      var y = 0;
      while (start < cut) {
        for (var i = start; i < end; i++) {
          acum += imageData.data[i];
          y++;
        }

        start += nextOffset;
        end = start + blockSize;
      }

      return acum / blockSizeSquare;
    }
  }, {
    key: 'debugPaintImageBlock',
    value: function debugPaintImageBlock(imageData, col, row) {
      var pixelData = 4;
      var blockSize = this.resolution * pixelData;
      var blockSizeSquare = this.resolution * blockSize;
      var start = col * blockSize + row * this.width * blockSize;
      var end = start + blockSize;
      var nextOffset = this.cols * blockSize;
      var cut = start + nextOffset * this.resolution;
      var acum = 0;
      var y = 0;
      while (start < cut) {
        for (var i = start; i < end; i++) {
          acum += imageData.data[i];
          imageData.data[i] = 255;
          y++;
        }

        start += nextOffset;
        end = start + blockSize;
      }
    }
  }, {
    key: 'drawCell',
    value: function drawCell(x, y, a) {
      var arrowSize = this.resolution / 1.5;
      var halfRes = this.resolution / 2;
      var xOffset = (this.resolution - arrowSize) / 2;
      var arrowColor = "#a3a3a3";
      var arrowHeadSize = arrowSize * 10 / 100;

      // this.ctx.lineWidth = 1;
      //
      // this.ctx.setLineDash([5, 15]);
      // this.ctx.beginPath();
      // this.ctx.rect(x, y, this.resolution , this.resolution);
      // this.ctx.stroke();
      // this.ctx.closePath();

      this.ctx.save();
      this.ctx.translate(x + halfRes, y + halfRes);
      this.ctx.rotate(a);

      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = arrowColor;
      this.ctx.fillStyle = arrowColor;

      this.ctx.beginPath();
      this.ctx.moveTo(-(arrowSize / 2), 0);
      this.ctx.lineTo(arrowSize / 2 - arrowHeadSize, 0);
      this.ctx.closePath();
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(arrowSize / 2 - arrowHeadSize, -arrowHeadSize);
      this.ctx.lineTo(arrowSize / 2 - arrowHeadSize, arrowHeadSize);
      this.ctx.lineTo(arrowSize / 2, 0);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }
  }, {
    key: 'draw',
    value: function draw() {
      if (!this.mustRedraw) {
        return;
      }

      var x = 0;
      var y = 0;

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (var i = 0; i < this.cols; i++) {
        y = i * this.resolution;
        for (var j = 0; j < this.rows; j++) {
          x = j * this.resolution;
          var v = this.field[this.zIndex][i][j];
          var angle = v.getAngle();
          this.drawCell(x, y, angle);
        }
      }

      this.mustRedraw = false;
    }
  }, {
    key: 'createCanvas',
    value: function createCanvas() {
      var canvas = document.createElement("canvas");
      var width = window.innerWidth;
      var height = window.innerHeight - 4;
      canvas.height = height;
      canvas.width = width;
      canvas.setAttribute("id", "flowField");
      canvas.style = "position: absolute; background:transparent; top:0; left:0; z-index:-1";
      document.getElementsByTagName("BODY")[0].appendChild(canvas);
      return canvas.getContext("2d");
    }
  }]);

  return FlowField;
}();

exports.default = FlowField;

},{"../../../../src/lib/Perlin":8,"../../../../src/lib/Utils":9,"../../../../src/lib/Vector":10}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mover2 = require('../../../../src/lib/Mover');

var _Mover3 = _interopRequireDefault(_Mover2);

var _Vector = require('../../../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

var _Utils = require('../../../../src/lib/Utils');

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Vehicle = function (_Mover) {
  _inherits(Vehicle, _Mover);

  function Vehicle(x, y, mass, angle, size, speed, force) {
    _classCallCheck(this, Vehicle);

    var _this = _possibleConstructorReturn(this, (Vehicle.__proto__ || Object.getPrototypeOf(Vehicle)).call(this, x, y, mass, angle, 0, speed));

    _this.radius = size || 3;
    _this.maxSpeed = speed || 4;
    _this.maxSteeringForce = force || 2;
    _this.elapsedTime = 0;
    _this.wanderRandomPoint = null;
    return _this;
  }

  _createClass(Vehicle, [{
    key: 'stayWithinWalls',
    value: function stayWithinWalls(d) {
      d = d || 100;

      var width = window.innerWidth;
      var height = window.innerHeight - 4;

      if (this.location.getX() <= d) {
        var desired = new _Vector2.default({ x: this.maxSpeed, y: this.velocity.y });
        var steer = desired.substract(this.velocity);
        steer.limit(this.maxSteeringForce);
        this.applyForce(steer);
      }

      if (this.location.getX() >= width - d) {
        var _desired = new _Vector2.default({ x: -this.maxSpeed, y: this.velocity.y });
        var _steer = _desired.substract(this.velocity);
        _steer.limit(this.maxSteeringForce);
        this.applyForce(_steer);
      }

      if (this.location.getY() <= d) {
        var _desired2 = new _Vector2.default({ x: this.velocity.x, y: this.maxSpeed });
        var _steer2 = _desired2.substract(this.velocity);
        _steer2.limit(this.maxSteeringForce);
        this.applyForce(_steer2);
      }

      if (this.location.getY() > height - d) {
        var _desired3 = new _Vector2.default({ x: this.velocity.x, y: -this.maxSpeed });
        var _steer3 = _desired3.substract(this.velocity);
        _steer3.limit(this.maxSteeringForce);
        this.applyForce(_steer3);
      }
    }
  }, {
    key: 'follow',
    value: function follow(field, z) {
      if (!field.isReady) {
        console.warn("Vehicle :: follow: FollowField is not ready");
        return;
      }
      z = z || false;
      var desired = field.lookup(this.location, z);
      desired.multiplyBy(this.maxSpeed);

      var steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);

      this.applyForce(steer);
    }
  }, {
    key: 'wander',
    value: function wander(wanderDist, wanderRadius, delta, ctx) {
      wanderRadius = wanderRadius || 50;
      wanderDist = wanderDist || 150;

      var interval = 500;
      var nextPosition = this.nextPosition(wanderDist);

      this.elapsedTime += delta;
      if (this.elapsedTime >= interval || this.wanderRandomPoint === null) {
        this.elapsedTime = 0;

        var angle = Math.random() * Math.PI * 2;
        var x = Math.cos(angle) * wanderRadius;
        var y = Math.sin(angle) * wanderRadius;
        this.wanderRandomPoint = new _Vector2.default({ x: x, y: y });
      }

      var target = nextPosition.add(this.wanderRandomPoint);

      // Draw circle
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(192, 11, 67, 0.3);";
        ctx.arc(nextPosition.getX(), nextPosition.getY(), wanderRadius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();

        // Draw point
        ctx.beginPath();
        ctx.fillStyle = "rgba(192, 11, 67, 1);";
        ctx.fillRect(target.getX(), target.getY(), 4, 4);
        ctx.fill();
        ctx.closePath();
      }

      this.seek(target);
    }
  }, {
    key: 'persuit',
    value: function persuit(target) {
      var nextPosition = target.nextPosition();

      this.seek(nextPosition);
    }
  }, {
    key: 'seek',
    value: function seek(target) {
      // Calculate desired velocity
      var desired = target.substract(this.location);
      var d = desired.getLength();

      desired.normalize();

      if (d < 100) {
        var m = _Utils2.default.mapRange(d, 0, 100, 0, this.maxSpeed);
        desired.multiplyBy(m);
      } else {
        desired.multiplyBy(this.maxSpeed);
      }

      var steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);

      this.applyForce(steer);
    }
  }, {
    key: 'flee',
    value: function flee(target) {
      // Calculate desired velocity
      var desired = target.substract(this.location);
      desired.normalize();
      desired.multiplyBy(this.maxSpeed);
      desired.multiplyBy(-1);

      var steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);

      this.applyForce(steer);
    }
  }, {
    key: 'nextPosition',
    value: function nextPosition(length) {
      var v = this.velocity.copy();
      if (length) {
        v.setLength(length);
      }
      return this.location.add(v);
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      var theta = this.velocity.getAngle() + Math.PI / 2;

      ctx.save();
      ctx.translate(this.location.getX(), this.location.getY());
      ctx.rotate(theta);
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.beginPath();
      ctx.lineTo(0, -this.radius * 2);
      ctx.lineTo(-this.radius, this.radius * 2);
      ctx.lineTo(this.radius, this.radius * 2);
      ctx.fill();
      ctx.closePath();

      // ctx.beginPath();
      // ctx.strokeStyle = "red";
      // ctx.moveTo(0,0);
      // ctx.lineTo(0, -this.radius*2);
      // ctx.stroke();
      // ctx.closePath();

      ctx.restore();
    }
  }]);

  return Vehicle;
}(_Mover3.default);

exports.default = Vehicle;
;

},{"../../../../src/lib/Mover":7,"../../../../src/lib/Utils":9,"../../../../src/lib/Vector":10}],4:[function(require,module,exports){
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

},{"../../src/feature-toggle":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _featureToggle = require('../../src/feature-toggle');

var _featureToggle2 = _interopRequireDefault(_featureToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LineUtils = function () {
  function LineUtils() {
    _classCallCheck(this, LineUtils);
  }

  _createClass(LineUtils, [{
    key: 'vectorLineProps',


    /*
     *  Given a vector will return: { endpoint, slope, intercept }
     *  1- Find missing segment points adding velocity to location on
     *     both vectors.
     *  2- Find the slope value for both lines
     *  3- Find the y-intercept value for both lines.
     */
    value: function vectorLineProps(v) {
      var e = v.location.add(v.velocity);
      var s = this.slope(v.location.getY(), e.getY(), v.location.getX(), e.getX());
      var i = this.yIntercept(e.getX(), e.getY(), s);
      return { endpoint: e, slope: s, intercept: i };
    }
  }, {
    key: 'intersect',
    value: function intersect(m1, b1, m2, b2) {
      var x = (b2 - b1) / (m1 - m2);
      var y = this.lineEq(x, m1, b1);
      return { x: x, y: y };
    }
  }, {
    key: 'lineEq',
    value: function lineEq(x, m, b) {
      return m * x + b;
    }
  }, {
    key: 'slope',
    value: function slope(y1, y2, x1, x2) {
      return (y1 - y2) / (x1 - x2);
    }
  }, {
    key: 'yIntercept',
    value: function yIntercept(x, y, m) {
      return y - m * x;
    }
  }, {
    key: 'xIntercept',
    value: function xIntercept(x, y, m) {
      return x - m / x;
    }
  }]);

  return LineUtils;
}();

var instance = new LineUtils();

exports.default = instance;

},{"../../src/feature-toggle":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require('./Vector');

var _Vector2 = _interopRequireDefault(_Vector);

var _LineUtils = require('./LineUtils.js');

var _LineUtils2 = _interopRequireDefault(_LineUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mover = function () {
  function Mover(x, y, mass, angle, maxLength, length, radius) {
    _classCallCheck(this, Mover);

    this.length = length || 0;
    this.angle = angle || 0;
    this.mass = mass || 1;
    this.maxLength = maxLength || 0;
    this.radius = radius || 10;
    this.acceleration = new _Vector2.default({ x: 0, y: 0 });
    this.velocity = new _Vector2.default({ x: 0, y: 0, length: length, angle: angle });
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
      this.velocity.addTo(this.acceleration);

      this.location.addTo(this.velocity);
      // Reset acceleration vector
      this.acceleration.multiplyBy(0);
    }
  }, {
    key: 'findIntercept',
    value: function findIntercept(m) {
      var line1 = _LineUtils2.default.vectorLineProps(this);
      var line2 = _LineUtils2.default.vectorLineProps(m);
      return _LineUtils2.default.intersect(line1.slope, line1.intercept, line2.slope, line2.intercept);
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

},{"./LineUtils.js":6,"./Vector":10}],8:[function(require,module,exports){
'use strict';

module.exports = Perlin;

function Perlin() {
  this.p = [];
  for (var i = 0; i < 256; i++) {
    this.p[256 + i] = this.p[i] = this.permutation[i];
  }
};

Perlin.prototype.p;
Perlin.prototype.permutation = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

Perlin.prototype.noise = function (x, y, z) {

  // This is probably not how you are supposed to do this
  y = y || 0;
  z = z || 0;

  var X = Math.floor(x) & 255; // FIND UNIT CUBE THAT
  var Y = Math.floor(y) & 255; // CONTAINS POINT.
  var Z = Math.floor(z) & 255;
  x -= Math.floor(x); // FIND RELATIVE X,Y,Z
  y -= Math.floor(y); // OF POINT IN CUBE.
  z -= Math.floor(z);

  var u = this.fade(x); // COMPUTE FADE CURVES
  var v = this.fade(y); // FOR EACH OF X,Y,Z.
  var w = this.fade(z);
  var A = this.p[X] + Y,
      AA = this.p[A] + Z,
      AB = this.p[A + 1] + Z; // HASH COORDINATES OF
  var B = this.p[X + 1] + Y,
      BA = this.p[B] + Z,
      BB = this.p[B + 1] + Z; // THE 8 CUBE CORNERS,

  return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), // AND ADD
  this.grad(this.p[BA], x - 1, y, z)), // BLENDED
  this.lerp(u, this.grad(this.p[AB], x, y - 1, z), // RESULTS
  this.grad(this.p[BB], x - 1, y - 1, z))), // FROM  8
  this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), // CORNERS
  this.grad(this.p[BA + 1], x - 1, y, z - 1)), // OF CUBE
  this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)))) * 0.5 + 0.5;
};

Perlin.prototype.fade = function (t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
};
Perlin.prototype.lerp = function (t, a, b) {
  return a + t * (b - a);
};
Perlin.prototype.grad = function (hash, x, y, z) {
  var h = hash & 15; // CONVERT LO 4 BITS OF HASH CODE
  var u = h < 8 ? x : y; // INTO 12 GRADIENT DIRECTIONS.
  var v = h < 4 ? y : h == 12 || h == 14 ? x : z;
  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
};

// Seeding needs to be implemented
// This is from: https://gist.github.com/leegrey/3253283
// Based on: http://techcraft.codeplex.com/discussions/264014

Perlin.prototype.seed = function (seed) {
  seed = seed || 1337;
  this.permutation = []; //make permutation unique between instances
  if (SeededRandomNumberGenerator == undefined) {
    console.log('Perlin.setSeed() - warning,' + ' SeededRandomNumberGenerator is undefined');
    return;
  }
  var seedRND = new SeededRandomNumberGenerator();
  seedRND.seed = seed;
  var i;
  for (i = 0; i < 256; i++) {
    this.permutation[i] = i;
  }
  for (i = 0; i < 256; i++) {
    var k = seedRND.randomIntRange(0, 256 - i) + i; //(256 - i) + i;
    var l = this.permutation[i];
    this.permutation[i] = this.permutation[k];
    this.permutation[k] = l;
    this.permutation[i + 256] = this.permutation[i];
  }
  for (var i = 0; i < 256; i++) {
    this.p[256 + i] = this.p[i] = this.permutation[i];
  }
};

var SeededRandomNumberGenerator = function SeededRandomNumberGenerator(seed, m, n) {
  if (!(this instanceof SeededRandomNumberGenerator)) {
    return new SeededRandomNumberGenerator(seed, m, n);
  }
  this.m = m || 82947121839;
  this.n = n || 328347242343;
  this.seed = seed || 1337;
};

SeededRandomNumberGenerator.prototype.randomIntRange = function (start, end) {
  this.seed = this.seed * this.n % this.m;
  return this.seed % (start - end) + start;
};

},{}],9:[function(require,module,exports){
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
    key: "constrain",
    value: function constrain(e, t, r) {
      return e > r ? r : e < t ? t : e;
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
  }, {
    key: "rad2deg",
    value: function rad2deg(r) {
      return r * 180 / Math.PI;
    }
  }, {
    key: "deg2rad",
    value: function deg2rad(d) {
      return d * Math.PI / 180;
    }
  }]);

  return Utils;
}();

var instance = new Utils();

exports.default = instance;

},{"../../src/feature-toggle":4}],10:[function(require,module,exports){
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
    key: 'dot',
    value: function dot(p) {
      return this._x * p._x + this._y * p._y;
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
  }, {
    key: 'limit',
    value: function limit(n) {
      if (this.getLength() > n) {
        this.setLength(n);
      }
    }
  }]);

  return Vector;
}();

exports.default = Vector;
;

},{"../../src/feature-toggle":4}]},{},[1])

//# sourceMappingURL=app.js.map
