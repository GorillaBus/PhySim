import Utils from '../../../src/lib/Utils.js';
import Mover from '../../../src/lib/Mover.js';

export default class Dust extends Mover {

  constructor(ctx, position, mass, G) {
    super(position.x, position.y, mass, null, null, position.length);

    this.ctx = ctx;
    this.id = this.uuid();
    this.mass = mass || 1;
    this.radius = this.calcRadius();
    this.G = G || 0.9;
    this.fillStyle = "#ffffff";
  }

  calcRadius() {
    return this.mass > 1 ? this.mass*0.4:1;
  }

  collides(dust) {
    let direction = dust.location.substract(this.location);
    let distance = direction.getLength();

    // Check collision
    let collidingArea = this.radius + dust.radius;
    if (distance <= collidingArea) {
      // let overlap = collidingArea - distance + 0.3;
      // direction.normalize();
      // direction.multiplyBy(overlap * -1);
      // dust.location.substractFrom(direction);

      return true;
    }

    return false;
  }

  absorb(dust) {
    // let direction = dust.location.substract(this.location);
    // let pRatio = dust.radio / this.radio;
    //
    // // Re-position the absorber
    // direction.normalize();
    // direction.multiplyBy(pRatio);
    // this.location.addTo(direction);

    this.mass += dust.mass;
    this.radius = this.calcRadius();

    if (this.fillStyle === "#ffffff") {
      this.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
    }
  }

  attract(dust) {
    // Attract
    let collidingArea = this.radius + dust.radius;
    let direction = dust.location.substract(this.location);
    let realDistance = direction.getLength();
    if (realDistance <= collidingArea) {

      let overlap = collidingArea - realDistance;
      direction.normalize();
      direction.multiplyBy(overlap);
      this.velocity.substractFrom(direction);
      return false;
    }

    let masPower = this.G * this.mass * dust.mass;
    let distance = Math.max(100, realDistance);
    let force = (masPower / (distance * distance));

    direction.normalize();
    direction.multiplyBy(force);
    this.applyForce(direction);
  }


  collideElastic(mover) {
    // Simulates the lost of Kinetic Energy
    let KE_LOOSE_RATIO = 0.76;

    /*
     *    Vf~1 = (mass1 - mass2) * Vi~1 / mass1 + mass2
     *    Vf~2 = 2 * mass1 * Vi~1 / mass1 + mass2
     */
     let Vf1 = this.velocity.copy();
     let Vf2 = this.velocity.copy();
     let diffMass = (this.mass - mover.mass);
     let totalMass = (this.mass + mover.mass);

     // Calculate 'final velocity 1'
     this.velocity.multiplyBy(0);
     Vf1.multiplyBy(diffMass);
     Vf1.divideBy(totalMass);
     Vf1.multiplyBy(KE_LOOSE_RATIO);



     // Calculate 'final velocity 2'
     mover.velocity.multiplyBy(0);
     Vf2.multiplyBy(2 * this.mass);
     Vf2.divideBy(totalMass);
     Vf2.multiplyBy(KE_LOOSE_RATIO);

     let recoil = Vf1.getLength() + Vf2.getLength();
     if (recoil < 0.1) {
       return recoil;
     }

     this.velocity = Vf1;
     mover.velocity = Vf2;


     /*
      let Vf1 = this.velocity.copy();
      let Vf2 = this.velocity.copy();
      let diffMass = (this.mass - mover.mass);
      let totalMass = (this.mass + mover.mass);

      // Calculate 'final velocity 1'
      this.velocity.multiplyBy(0);
      Vf1.multiplyBy(diffMass);
      Vf1.divideBy(totalMass);
      Vf1.multiplyBy(KE_LOOSE_RATIO);



      // Calculate 'final velocity 2'
      mover.velocity.multiplyBy(0);
      Vf2.multiplyBy(2 * this.mass);
      Vf2.divideBy(totalMass);
      Vf2.multiplyBy(KE_LOOSE_RATIO);

      let recoil = Vf1.getLength() + Vf2.getLength();
      if (recoil < 0.1) {
        return recoil;
      }

      this.velocity = Vf1;
      mover.velocity = Vf2;
     */
  }

  collideInelastic(mover) {
    /*
     *
     *
     */
     let Vf1 = this.velocity.copy();
     let Vf2 = this.velocity.copy();
     let diffMass = (this.mass - mover.mass);
     let totalMass = (this.mass + mover.mass);

     // Calculate 'final velocity 1'
     this.velocity.multiplyBy(0);
     Vf1.multiplyBy(diffMass);
     Vf1.divideBy(totalMass);
     this.velocity = Vf1;

     // Calculate 'final velocity 2'
     mover.velocity.multiplyBy(0);
     Vf2.multiplyBy(2 * this.mass);
     Vf2.divideBy(totalMass);
     mover.velocity = Vf2;
  }


  draw() {
    let x = this.location.getX();
    let y = this.location.getY();

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fill();
  }

  uuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}
