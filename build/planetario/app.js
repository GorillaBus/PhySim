(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Particle = require('../../src/lib/Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _AnimationPlayer = require('../../src/lib/AnimationPlayer');

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth - 4;
    var height = canvas.height = window.innerHeight - 4;

    var player = new _AnimationPlayer2.default();

    var startY = height / 2;
    var baseX = width / 2;
    var _sunCfg = {
        x: baseX,
        y: startY,
        mass: 3000,
        speed: 0,
        gravity: 0
    };
    var sun = new _Particle2.default(_sunCfg);
    var planetsSetup = [{
        x: baseX - 100,
        y: startY,
        speed: 5.5,
        direction: -Math.PI / 2,
        color: '#0007FF',
        mass: 4.5
    }, {
        x: baseX + 104,
        y: startY,
        speed: 5.5,
        direction: Math.PI / 2,
        color: '#F3F972',
        mass: 4.5
    }, {
        x: baseX - 170,
        y: startY,
        speed: 4.1,
        direction: -Math.PI / 2,
        color: '#FF3500',
        mass: 11
    }, {
        x: baseX + 163,
        y: startY,
        speed: 4.1,
        direction: Math.PI / 2,
        color: '#E1EA43',
        mass: 11
    }, {
        x: baseX - 230,
        y: startY,
        speed: 3.8,
        direction: -Math.PI / 2,
        color: '#30AD1F',
        mass: 18
    }, {
        x: baseX - 290,
        y: startY,
        speed: 3.4,
        direction: -Math.PI / 2,
        color: '#F0C65A',
        mass: 27
    }, {
        x: baseX + 292,
        y: startY,
        speed: 3.4,
        direction: Math.PI / 2,
        color: '#9E51C9',
        mass: 27
    }, {
        x: baseX - 360,
        y: startY,
        speed: 2.9,
        direction: -Math.PI / 2,
        color: '#3582AF',
        mass: 43
    }, {
        x: baseX + 349,
        y: startY,
        speed: 2.9,
        direction: Math.PI / 2,
        color: '#C951A9',
        mass: 43
    }];
    var planets = createPlanets(planetsSetup);
    var scale = {
        x: 1,
        y: 1,
        increment: 0.1
    };
    var pos = {
        x: 0,
        y: 0,
        increment: 1
    };

    // TODO: Look for a better implementation
    updateStyle();

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0, 0, width, height);

        sun.update();

        ctx.beginPath();
        ctx.fillStyle = "#FFE500";
        ctx.arc(sun.x, sun.y, 32, 0, Math.PI * 2, false);
        ctx.shadowBlur = 54;
        ctx.shadowColor = '#E8FF00';
        ctx.fill();
        ctx.closePath();

        var total = planets.length;
        for (var i = 0; i < total; i++) {
            planets[i].gravitateTo(sun);
            planets[i].update();

            ctx.beginPath();
            ctx.fillStyle = planets[i].color;
            ctx.arc(planets[i].x, planets[i].y, planets[i].radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255,255,255,0.5)';
            ctx.fill();
            ctx.closePath();
        }
    }

    /** Helpers **/

    function createPlanets(config) {
        var total = config.length;
        var planets = [];
        for (var i = 0; i < total; i++) {
            var p = new _Particle2.default(config[i]);
            p.color = config[i].color;
            p.radius = p.mass * 0.2;
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
            default:
                break;
        }
        updateStyle();
    });

    document.body.addEventListener("mousewheel", MouseWheelHandler, false);

    function MouseWheelHandler(e) {
        var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
        if (delta > 0) {
            scale.x += scale.increment;
            scale.y += scale.increment;
        } else {
            scale.x = scale.x > 0 ? scale.x - scale.increment : 0;
            scale.y = scale.y > 0 ? scale.y - scale.increment : 0;
        }
        updateStyle();
    }

    function updateStyle() {
        canvas.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) scale(' + scale.x + ',' + scale.y + ')';
    }
};

},{"../../src/lib/AnimationPlayer":3,"../../src/lib/Particle":4}],2:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}]},{},[1])


//# sourceMappingURL=app.js.map
