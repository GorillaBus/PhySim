var Vector = Vector || require('./Vector');
var Particle = {
    position: null,
    velocity: null,
    mass: null,

    create: function(particleSettings) {
        particleSettings = arguments[0] || {};
        particleSettings = {
            x: particleSettings.x || 0,
            y: particleSettings.y || 0,
            speed: particleSettings.speed || 0,
            direction: particleSettings.direction || 0,
            mass: particleSettings.mass || 1
        };

        var particle = Object.create(this);

        particle.position = Vector.create({ x: particleSettings.x, y: particleSettings.y });
        particle.velocity = Vector.create({ x: 0, y: 0 });
        particle.velocity.setLength(particleSettings.speed);
        particle.velocity.setAngle(particleSettings.direction);
        particle.mass = particleSettings.mass;

        return particle;
    },

    accelerate: function(vector) {
        this.velocity.addTo(vector);
    },

    update: function() {
        this.position.addTo(this.velocity);
    },

    angleTo: function(particle) {
        return Math.atan2(particle.position.getY() - this.position.getY(), particle.position.getX() - this.position.getX());
    },

    distanceTo: function(particle) {
        var dx = particle.position.getX() - this.position.getX();
        var dy = particle.position.getY() - this.position.getY();
        return Math.sqrt(dx * dx + dy * dy);
    },

    gravitateTo: function(particle) {
        var gravity = Vector.create();
        var distance = this.distanceTo(particle);
        var effect = particle.mass / (distance * distance);
        var angle = this.angleTo(particle);
        gravity.setLength(effect);
        gravity.setAngle(angle);
        this.accelerate(gravity);
    }
};

module.exports = Particle;