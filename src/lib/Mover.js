import Vector from './Vector';
import LineUtils from './LineUtils.js';

export default class Mover {

  constructor(x, y, mass, angle, maxLength, length, radius) {
    this.length = length || 0;
    this.angle = angle || 0
    this.mass = mass || 1;
    this.maxLength = maxLength || 0;
    this.radius = radius || 10;
    this.acceleration = new Vector({ x: 0, y: 0 });
    this.velocity = new Vector({ x: 0, y: 0, length: length, angle: angle });
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

  findIntercept(m) {
    let line1 = LineUtils.vectorLineProps(this);
    let line2 = LineUtils.vectorLineProps(m);
    return LineUtils.intersect(line1.slope, line1.intercept, line2.slope, line2.intercept);
  }

  isInside(liquid) {
    return this.location.getY() > liquid.getY() && this.location.getY() <= liquid.getH() + liquid.getY();
  }

  drag(liquid) {
    let speed = this.velocity.getLength();
    let dragMagnitude = liquid.getC() * speed * speed;
    let drag = this.velocity.multiply(-1);

    drag.normalize();
    drag.multiplyBy(dragMagnitude);
    this.applyForce(drag);
  }

  checkEdges(width, height) {
    if (this.location.getX() >= width - this.radius) {
      this.location.setX(width - this.radius*2);
      this.velocity.setX(this.velocity.getX() *  -1);
    } else if (this.location.getX() <= this.radius) {
      this.location.setX(this.radius);
      this.velocity.setX(this.velocity.getX() *  -1);
    }

    if (this.location.getY() >= height - this.radius) {
      this.location.setY(height - this.radius*2);
      this.velocity.setY(this.velocity.getY() * -1);
    } else if (this.location.getY() <= this.radius) {
      this.location.setY(this.radius);
      this.velocity.setY(this.velocity.getY() * -1);
    }
  }

  resetVelocity() {
    this.velocity.multiplyBy(0);
  }
}
