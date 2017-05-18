import Vector from '../../../../src/lib/Vector';

export default class Pendulum {

  constructor(origin, radio, initAngle, damping, gravity) {
    this.radio = radio || 100;
    this.origin = origin || new Vector(this.radio, 0);
    this.position = new Vector();
    this.angle = initAngle || 0;
    this.angleVelocity = 0;
    this.angleAcceleration = 0;
    this.damping = damping || 0.99;
    this.gravity = gravity || 2;
  }

 update() {
   this.angleAcceleration = this.calcAccel();
   this.angleVelocity += this.angleAcceleration;
   this.angle += this.angleVelocity;
   this.angleVelocity *= this.damping;

   this.calcPosition();
 }

 calcPosition() {
   let x = this.radio * Math.sin(this.angle);
   let y = this.radio * Math.cos(this.angle);

   this.position.setX(x);
   this.position.setY(y);

   this.position.addTo(this.origin);
 }

 calcAccel() {
   return (-1 * this.gravity / this.radio) * Math.sin(this.angle);
 }

}
