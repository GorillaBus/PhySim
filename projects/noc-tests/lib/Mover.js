import Vector from '../../../src/lib/Vector';

export default class Mover {

  constructor(x, y, mass) {
    this.mass = mass || 1;
    this.acceleration = new Vector({ x: 0, y: 0 });
    this.velocity = new Vector({ x: 0, y: 0 });
    this.location = new Vector({ x: x, y: y });
  }

  applyForce(force) {
    // Acceleration = mass / force: create a new vector with it
    let f = force.divide(this.mass);
    this.acceleration.addTo(f);
  }

  update() {
    this.velocity.addTo(this.acceleration);
    this.location.addTo(this.velocity);
    // Reset acceleration vector
    this.acceleration.multiplyBy(0);
  }

  checkEdges(width, height) {
    if (this.location.getX() >= width) {
      this.location.setX(width);
      this.velocity.setX(this.velocity.getX() *  -0.4);
    } else if (this.location.getX() <= 0) {
      this.location.setX(0);
      this.velocity.setX(this.velocity.getX() *  -0.4);
    }

    if (this.location.getY() >= height) {
      this.location.setY(height);
      this.velocity.setY(this.velocity.getY() * -0.4);
    } else if (this.location.getY() <= 0) {
      this.location.setY(0);
      this.velocity.setY(this.velocity.getY() * -0.4);
    }
  }
}
