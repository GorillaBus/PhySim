import Vector from '../../../../src/lib/Vector';

export default class Particle {
  constructor(l, m, lifeSpan) {
    l = l || { x:0, y:0 };

    this.location = new Vector(l);
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.mass = m || 1;
    this.lifeSpan = lifeSpan || 0;
    this.angle = 0;
    this.angleSpeed = 0.1;
  }

  update() {
    this.velocity.addTo(this.acceleration);
    this.location.addTo(this.velocity);
    this.lifeSpan -= 1;
    this.angle += this.angleSpeed;
  }

  rotate(angleSpeed) {
    this.angleSpeed += angleSpeed;
  }

  applyForce(v) {
    v.divideBy(this.mass);
    this.acceleration.addTo(v);
  }

  isDead() {
    return this.lifeSpan > 0;
  }
}
