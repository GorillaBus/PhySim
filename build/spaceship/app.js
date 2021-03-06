(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Particle = require('../../src/lib/Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

var _Vector = require('../../src/lib/Vector');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth - 4;
    var height = canvas.height = window.innerHeight - 4;

    var player = new _AnimationPlayer2.default();

    // Ship movement & actions
    var angle = 0;
    var turningLeft = false;
    var turningRight = false;
    var thrusting = false;
    var firing = false;

    // Ship drawing
    var shipSettings = {
        x: width / 2,
        y: height / 2,
        friction: 0.99
    };
    var ship = new _Particle2.default(shipSettings);
    var thrust = new _Vector2.default({ x: 0, y: 0 });
    var bullets = [];
    var numBullets = 0;

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0, 0, width, height);

        // Ship movement
        if (turningLeft) {
            angle -= 0.05;
        }

        if (turningRight) {
            angle += 0.05;
        }

        if (thrusting) {
            thrust.setAngle(angle);
            thrust.setLength(0.1);
        } else {
            thrust.setLength(0);
        }

        // Firing adds more bullets
        if (firing) {
            var bulletSettings = {
                x: ship.x,
                y: ship.y,
                speed: 1,
                direction: angle
            };

            var impulseSettings = {
                x: ship.x,
                y: ship.y,
                length: 1,
                angle: angle
            };

            var newBullet = {
                bullet: new _Particle2.default(bulletSettings),
                impulse: new _Vector2.default(impulseSettings)
            };

            // Add new bullet to the queue
            bullets.push(newBullet);
            numBullets = bullets.length;
        }

        // Update ship position
        ship.accelerate(thrust.getX(), thrust.getY());
        ship.update();

        // Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, -7);
        ctx.lineTo(-10, 7);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

        // Draw thrust
        if (thrusting) {
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-18, 0);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();

        // Draw bullets
        if (numBullets > 0) {
            for (var i = 0; i < numBullets; i++) {
                // Destroy bullet when it goes out of the screen
                if (bullets[i].bullet.x > width || bullets[i].bullet.y > height || bullets[i].bullet.y < 0 || bullets[i].bullet.x < 0) {
                    bullets.splice(i, 1);
                    numBullets--;
                    continue;
                }

                var bullet = bullets[i].bullet;
                var impulse = bullets[i].impulse;

                // Update bullet
                bullet.accelerate(impulse.getX(), impulse.getY());
                bullet.update();

                // Draw bullet
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2, false);
                ctx.fillStyle = "#FF0000";
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            }
        }

        // Handle ship positioning when out of sight
        if (ship.x > width) {
            ship.x = 0;
        }
        if (ship.y > height) {
            ship.y = 0;
        }
        if (ship.x < 0) {
            ship.x = width;
        }
        if (ship.y < 0) {
            ship.y = height;
        }
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

    // Animation control: KeyUp
    document.body.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 38:
                // Up
                thrusting = false;
                break;
            case 37:
                // Left
                turningLeft = false;
                break;
            case 39:
                // Right
                turningRight = false;
                break;
            case 32:
                // Space
                firing = true;
                setTimeout(function () {
                    firing = false;
                }, 20);
                break;
            default:
                break;
        }
    });
};

},{"../../src/lib/AnimationPlayer":3,"../../src/lib/Particle":4,"../../src/lib/Vector":5}],2:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}],4:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}],5:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}]},{},[1])

//# sourceMappingURL=app.js.map
