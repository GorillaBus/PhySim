import FEATURE_TOGGLE from '../../../src/feature-toggle';
import Particle from '../../../src/lib/Particle';
import Matter from '../matter.js';


export default class ParticleExt extends Particle {

    constructor(settings) {
      super(settings);

      this.matter = Matter[settings.matter] || Matter.neutral;
      this.color = this.matter.color;
      this.radius = this.mass / this.matter.density;
      this.mapperData = [];
      this.points = settings.points || [];
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

    /*
        Check for Circle-Circle collisions and return details
    */
    collisionCheck(p) {
      // Get the Distance vector (difference in position)
      let xDist = this.x - p.x;
      let yDist = this.y - p.y;

      // We'll save a Math.sqrt() to verify distances like this:
      let distSquared = xDist*xDist + yDist*yDist;
      let radiusSquared = (this.radius + p.radius) * (this.radius + p.radius);

      // Collision check
      if (distSquared < radiusSquared) {

        // Once collided, get the Displacement vector (difference in velocity)
        let xVelocity = p.vx - this.vx;
        let yVelocity = p.vy - this.vy;

        // Project the Collision vector over the Distance vector
        let dotProduct = xDist*xVelocity + yDist*yVelocity;


        /*
         *
         *
         *  Hi, welcome to this "Dot Product" implementation 101.
         *
         *    Dot Product will tell if both particles ara heading one to the other, and if they are
         *    actually colliding or will collide in the future.
         *
         *    Think of it as if we where calculating the difference in Distance (or position) and
         *    the difference in Speed (lenth) of both objects. To do this, we substract vector values.
         *
         *    When the difference in angles and speeds between the two moving objects are both:
         *
         *    Negative: NO collision; maybe exact oposite direction but still yet
         *              too far to collide -at this time (maybe next tick)
         *
         *    Cero:     COLLISION; a perfect collision in direction, acceleration and time
         *
         *    Positive: COLLISION; exact direction; and the resulting force from the collision
         *
         *
         */
        if (dotProduct > 0) {

          // The resulting force from the collision (angle difference + velocity difference)
          let collisionScale = dotProduct / distSquared;

          // // Collision Vector:
          let collision = {
            x: xDist * collisionScale,
            y: yDist * collisionScale
          };

          return collision;
        }
      }

      return false;
    }

    /*
        2D Elastic collision handling
    */
    collisionHandle(p, collisionVector) {

      // 2D-Elastic collision formula
      let combinedMass = this.mass + p.mass;
      let collisionWeight0 = (2 * p.mass / combinedMass) * p.matter.restitution;
      let collisionWeight1 = (2 * this.mass / combinedMass) * this.matter.restitution;

      // Adds the computed collision results to the velocities of this / p
      this.vx += collisionWeight0 * collisionVector.x;
      this.vy += collisionWeight0 * collisionVector.y;
      p.vx -= collisionWeight1 * collisionVector.x;
      p.vy -= collisionWeight1 * collisionVector.y;
    }
}
