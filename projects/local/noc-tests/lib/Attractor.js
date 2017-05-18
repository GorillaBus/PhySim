import Vector from '../../../../src/lib/Vector';

export default class Attractor {
  constructor(x, y, m) {
    this.location = new Vector({
      x: x,
      y: y
    });

    this.mass = m;
    this.G = 0.4;
  }

  /*
      Calculate gravitational attraction as:
      ( (G * m1 * m2) / (speed * speed) ) * <- velocity unit vector

  */
  attract(mover) {
    let mass = this.G * this.mass * mover.mass;
    let direction = this.location.substract(mover.location);
    let distance = Math.max(5, direction.getLength());  // Lets say that it will never be less thatn 5 to avoid problems (by now)
    let force = (mass / (distance * distance))
    direction.normalize();
    direction.multiplyBy(force);
    return direction;
  }

  /*
      Same as gravity but force increases as distance do.
      - Like spring force -
  */
  attractFarthest(mover) {
    let mass = this.mass * mover.mass;
    let direction = this.location.substract(mover.location);
    let distance = Math.max(5, direction.getLength());  // Lets say that it will never be less thatn 5 to avoid problems (by now)
    let force = distance / (mass * mass);
    direction.normalize();
    direction.multiplyBy(force);
    return direction;
  }

  repel(mover) {
    let mass = this.G * this.mass * mover.mass;
    let direction = this.location.substract(mover.location);
    let distance = Math.max(5, direction.getLength());  // Lets say that it will never be less thatn 5 to avoid problems (by now)
    let force = mass / (distance * distance);
    direction.normalize();
    direction.multiplyBy(-force);
    return direction;
  }
}
