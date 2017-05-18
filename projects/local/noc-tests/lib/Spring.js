import Vector from '../../../../src/lib/Vector';

export default class Spring {

  constructor(x, y, length, k) {
    x = x || 0;
    y = y || 0;
    this.length = length || 200;
    this.k = k || 0.1;
    this.anchor = new Vector({ x: x, y: y });
  }

  connect(bob) {
    let force = bob.location.substract(this.anchor);
    let d = force.getLength();
    let stretch = d - this.length;

    force.normalize();
    force.multiplyBy(-1 * this.k * stretch);

    bob.applyForce(force);
  }
}
