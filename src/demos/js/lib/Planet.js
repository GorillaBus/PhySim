'use strict'

var Vector = Vector || require('./Vector');
var Planet = {
    position: null,
    velocity: null,
    mass: null,
    radius: null,
    friction: null,
    gravity: null,
    color: null,

    create: function(planetSettings) {
        planetSettings = arguments[0] || {};
        planetSettings = {
            x: planetSettings.x || 0,
            y: planetSettings.y || 0,
            speed: planetSettings.speed || 0,
            direction: planetSettings.direction || 0,
            mass: planetSettings.mass || 1,
            radius: planetSettings.radius || 10,
            friction: planetSettings.friction || 1,
            gravity:  planetSettings.gravity || 0,
            color: planetSettings.color || '#ffffff'
        };

        var radiusFactor = 0.2;

        var planet = Object.create(this);
        planet.position = Vector.create({ x: planetSettings.x, y: planetSettings.y });
        planet.velocity = Vector.create({ x: 0, y: 0 });
        planet.gravity = Vector.create({ x: 0, y: planetSettings.gravity }),
        planet.velocity.setLength(planetSettings.speed);
        planet.velocity.setAngle(planetSettings.direction);
        planet.mass = planetSettings.mass;
        planet.radius = planetSettings.mass * radiusFactor;
        planet.friction = planetSettings.friction;
        planet.color = planetSettings.color;
        return planet;
    },

    accelerate: function(vector) {
        this.velocity.addTo(vector);
    },

    update: function() {
        this.velocity.addTo(this.gravity);
        this.velocity.multiplyBy(this.friction);
        this.position.addTo(this.velocity);
    },

    angleTo: function(planet) {
        return Math.atan2(planet.position.getY() - this.position.getY(), planet.position.getX() - this.position.getX());
    },

    distanceTo: function(planet) {
        var dx = planet.position.getX() - this.position.getX();
        var dy = planet.position.getY() - this.position.getY();
        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(planet) {
        var gravity = Vector.create({x: 0, y: 0});
        var distance = this.distanceTo(planet);
        var effect = planet.mass / (distance * distance);
        var angle = this.angleTo(planet);
        gravity.setLength(effect);
        gravity.setAngle(angle);
        this.accelerate(gravity);
    }
};

module.exports = Planet;