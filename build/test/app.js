(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _AnimationPlayer = require("../../src/lib/AnimationPlayer");

var _AnimationPlayer2 = _interopRequireDefault(_AnimationPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight - 4;
    var center = { x: width / 2, y: height / 2 };

    canvas.height = height;
    canvas.width = width;

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var world = new b2World(new b2Vec2(0, 10) //gravity
    , true //allow sleep
    );

    var SCALE = 30;

    //create ground
    var fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2CircleShape(10);

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;

    // positions the center of the object (not upper left!)
    bodyDef.position.x = center.x / SCALE;
    bodyDef.position.y = 10 / SCALE;
    bodyDef.userData = "123";

    world.CreateBody(bodyDef).CreateFixture(fixDef);

    var player = new _AnimationPlayer2.default({ fps: 60 });

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0, 0, width, height);

        world.Step(60 / 1000 //frame-rate
        , 10 //velocity iterations
        , 10 //position iterations
        );

        var state = {};
        for (var b = world.GetBodyList(); b; b = b.m_next) {
            if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
                state[b.GetUserData()] = { x: b.GetPosition().x, y: b.GetPosition().y, a: b.GetAngle() };
            }
        }

        // Draw
        ctx.beginPath();
        ctx.arc(state[123].x * SCALE, state[123].y * SCALE, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
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

},{"../../src/lib/AnimationPlayer":3}],2:[function(require,module,exports){
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

},{"../../src/feature-toggle":2}]},{},[1])


//# sourceMappingURL=app.js.map
