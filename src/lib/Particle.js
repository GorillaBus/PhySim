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
    springs: null,
    gravitations: null,

    /*
     *  Creates a new particle with the given setup
     */
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
        particle.springs = [];
        particle.gravitations = [];
        return particle;
    },

    /*
     *  Updates the state of the particle
     */
    update: function() {
        this.handleSprings();
        this.handleGravitations();
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    },

    /*
     *  Gets the length of the velocity vector, which equals to the hypotenuse
     */
    getSpeed: function() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    },

    /*
     *  Using the actual Velocity vector's angle, sets a new length for it
     */
    setSpeed: function(speed) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    /*
     *  Gets the angle direction of the velocity vector
     */
    getHeading: function() {
        return Math.atan2(this.vy, this.vx);
    },

    /*
     *  Changes the Velocity vector's angle and recalculate coordinates
     */
    setHeading: function(heading) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    },

    /*
     *  Sums to the Velocity vector x and y values
     */
    accelerate: function(x, y) {
        this.vx += x;
        this.vy += y;
    },

    /*
     *  Calculates the angle between this particle and 'p2'
     */
    angleTo: function(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    },

    /*
     *  Calculates the distance to a given particle
     */
    distanceTo: function(p) {
        var dx = p.x - this.x;
        var dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /*
     *  Calculates and applies a gravitation vector to a given particle
     */
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
    },

    /*
     *  Registers a particle to gravitate to
     */
    addGravitation: function(p) {
        this.removeGravitation(p);
        this.gravitations.push(p);
    },

    /*
     *  Unregisters a gravitation particle
     */
    removeGravitation: function(p) {
        var length = this.gravitations.length;
        for (var i=0; i<length; i++){
            if (this.gravitations[i] === p) {
                this.gravitations.slice(i, 1);
                return true;
            }
        }
    },

    /*
     *  Gravitates to each registered gravitation particle
     */
    handleGravitations: function() {
        var length = this.gravitations.length;
        for (var i=0; i<length; i++){
            this.gravitateTo(this.gravitations[i]);
        }
    },

    /*
     *  Calculates and applies a spring vector to a given point
     */
    springTo: function(point, k, length) {
        var dx = point.x - this.x;
        var dy = point.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var force = (distance - length || 0) * k;
        // Instead of getting cos / sin of angle, divide sides by hypotenuse
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
    },

    /*
     *  Registers a new spring point
     */
    addSpring: function(point, k, length) {
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    },

    /*
     *  Unregisters a spring point
     */
    removeSpring: function(point) {
        var length = this.springs.length;
        for (var i=0; i<length; i++){
            if (this.springs[i].point === point) {
                this.springs.splice(i, 1);
                return true;
            }
        }
    },


    /*
     *  Springs to each registered spring point
     */
    handleSprings: function() {
        var length = this.springs.length;
        for (var i=0; i<length; i++){
            var spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    }
};

module.exports = Particle;