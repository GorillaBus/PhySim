var Particle = {
    position: null,
    velocity: null,
    gravity: null,

    create: function(x, y, speed, direction, gravity) {
        var particle = Object.create(this);
        particle.position = Vector.create(x, y);
        particle.velocity = Vector.create(0, 0);
        particle.gravity = Vector.create(0, gravity);

        particle.velocity.setLength(speed);
        particle.velocity.setAngle(direction);

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
