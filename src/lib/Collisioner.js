export default class Collisioner {

  constructor() {

  }

  /*
   *  Get angle from p0's location to p1's location
   */
  distance(p0, p1) {
    return p0.distanceTo(p1);
  }

  /*
   *  Get angle from p0's location to p1's location
   */
  angle(p0, p1) {
    return p0.angleTo(p1);
  }

  /*
   *  Check for collision between two circular particles
   */
  circleCollision(p0, p1) {
    let distance = this.distance(p0, p1);
    let collides = distance <= p0.radius + p1.radius;

    if (!collides) {
      return collides;
    }

    return {
      distance: distance,
      angle: this.angle(p0, p1)
    };
  }

}
