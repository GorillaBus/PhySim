// TODO: Verify if it is OK to pass direction and speed to gravity vector on create, seems it must go to velocity vector.
var Vector = Vector || require('./Vector');
var Particle = {
    position: null,
    velocity: null,
    gravity: null,

    create: function(particleSettings, VectorObject) {
        particleSettings = arguments[0] || {};
        particleSettings = {
            x: particleSettings.x || 100,
            y: particleSettings.y || 100,
            speed: particleSettings.speed || 0,
            direction: particleSettings.direction || 0,
            gravity: particleSettings.gravity || 0
        };

        var particle = Object.create(this);

        particle.position = Vector.create({ x: particleSettings.x, y: particleSettings.y });
        particle.velocity = Vector.create({ x: 0, y: 0 });
        particle.velocity.setAngle(particleSettings.direction);
        particle.velocity.setLength(particleSettings.speed);
        particle.gravity = Vector.create({ x: 0, y: particleSettings.gravity });

        return particle;
    },

    accelerate: function(vector) {
        this.velocity.addTo(vector);
    },

    update: function() {
        this.position.addTo(this.velocity);
        this.accelerate(this.gravity);
    }
};

module.exports = Particle;