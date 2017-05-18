import FEATURE_TOGGLE from '../../../src/feature-toggle';
import Particle from '../../../src/lib/Particle';

export default class ParticleExt extends Particle {

    constructor(settings) {
      super(settings);

      this.mapperRegions = settings.mapperRegions || {};
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

      // Calculate the Distance Vector
      let xDist = this.x - p.x;
      let yDist = this.y - p.y;
      let distSquared = xDist*xDist + yDist*yDist;
      let radiusSquared = (this.radius + p.radius) * (this.radius + p.radius);

      // Check collision: using squared distances, same result and saves one Math.sqrt()
      if (distSquared < radiusSquared) {

        // Calculate if particles are moving towards each other or away (after a previous collision)
        let xVelocity = p.vx - this.vx;
        let yVelocity = p.vy - this.vy;
        let dotProduct = xDist*xVelocity + yDist*yVelocity;

        // If particles are moving away (already collided) return
        if (dotProduct > 0) {

          let collisionScale = dotProduct / distSquared;
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
      let collisionWeight0 = 2 * p.mass / combinedMass;
      let collisionWeight1 = 2 * this.mass / combinedMass;

      // Adds the computed collision results to the velocities of this / p
      this.vx += collisionWeight0 * collisionVector.x;
      this.vy += collisionWeight0 * collisionVector.y;
      p.vx -= collisionWeight1 * collisionVector.x;
      p.vy -= collisionWeight1 * collisionVector.y;
    }
}
