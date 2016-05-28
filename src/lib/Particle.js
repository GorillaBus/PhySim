'use strict'

var Particle = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    mass: null,
    radius: null,
    friction: null,
    gravity: null,

    create: function(particleSettings) {
        particleSettings = arguments[0] || {};
        particleSettings = {
            x: particleSettings.x || 0,
            y: particleSettings.y || 0,
            speed: particleSettings.speed || 0,
            direction: particleSettings.direction || 0,
            mass: particleSettings.mass || 1,
            radius: particleSettings.radius || 1,
            friction: particleSettings.friction || 1,
            gravity:  particleSettings.gravity || 0
        };

        var particle = Object.create(this);
        particle.x = particleSettings.x;
        particle.y = particleSettings.y;
        particle.vx = Math.cos(particleSettings.direction) * particleSettings.speed;
        particle.vy = Math.sin(particleSettings.direction) * particleSettings.speed;
        particle.gravity = particleSettings.gravity;
        particle.mass = particleSettings.mass;
        particle.radius = particleSettings.radius;
        particle.friction = particleSettings.friction;
        return particle;
    },

    accelerate: function(x, y) {
        this.vx += x;
        this.vy += y;
    },

    update: function() {
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    },

    angleTo: function(particle) {
        return Math.atan2(particle.y - this.y, particle.x - this.x);
    },

    distanceTo: function(particle) {
        var dx = particle.x - this.x;
        var dy = particle.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(particle) {
        var dx = particle.x - this.x;
        var dy = particle.y - this.y;
        var distSQ = (dx * dx) + (dy * dy);
        var dist = Math.sqrt(distSQ);
        var force = particle.mass / distSQ; // Force = mass / square of the distance
        /*
        cos * hypotenuse = opposite side || cos = opposite side / hypotenuse
        sin * hypotenuse = adjacent side || sin = adjacent side / hypotenuse
        
        That being said, we can optimize this:
        var angle = this.angleTo(particle);
        var ax = Math.cos(angle) * force;
        var ay = Math.sin(angle) * force;

        And save three trigo functions
        */
        var ax = (dx / dist) * force;
        var ay = (dy / dist) * force;

        this.vx += ax;
        this.vy += ay;
    }
};

module.exports = Particle;