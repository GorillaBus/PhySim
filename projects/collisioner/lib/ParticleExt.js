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
      this.cache = {
        // <id>: {
        //   particle: <ref to particle>,
        //   cached: {
        //     <method1>: <value1>,
        //     <method2>: <value2>
        //   }
        // }
      };
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
      let distUnSQ = this.distanceToUnsquared(p);
      let xDist = distUnSQ.dx * -1;
      let yDist = distUnSQ.dy * -1;
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


    /*
     *  Calculates and applies a gravitation vector to a given particle
     */
     gravitateTo(p, gravityFactor) {
         gravityFactor = gravityFactor || 0.04;

         let radiusSum = this.radius + p.radius;
         let massFactor = this.mass * p.mass;

         let distUnSQ = this.distanceToUnsquared(p);
         let xDist = distUnSQ.dx;
         let yDist = distUnSQ.dy;

        //  let xDist = p.x - this.x;
        //  let yDist = p.y - this.y;

         let distSQ = (xDist * xDist) + (yDist * yDist);
         let dist = Math.sqrt(distSQ);
         let surfaceDist = dist - radiusSum;

         // Cancel gravitation once objects collide
         // TODO: Verify if we can save the Math.sqrt() comparing squares
         if (dist < radiusSum + 5) {
           return;
         }

         //let force = (p.mass) / distSQ; // Force = mass / square of the distance
         let force = gravityFactor * massFactor / (surfaceDist * surfaceDist);

         let ax = (xDist / surfaceDist) * force;
         let ay = (yDist / surfaceDist) * force;

         this.vx += ax;
         this.vy += ay;
     }

    /*
     *  Calculates the distance to a given particle
     */
    distanceToUnsquared(p) {
      let result;
      if ((result = this.getCached(p.id, 'distanceToUnsquared'))) {
        return result;
      }
      result = {
        dx: p.x - this.x,
        dy: p.y - this.y
      };
      this.setCached(p, 'distanceToUnsquared', result);
      return result;
    }

    setCached(particle, method, value) {

      let peerValue = value;
      switch (method) {
        case 'distanceToUnsquared':
          peerValue *= -1;
        break;
      }

      this.registerCache(particle, method, value);
      particle.registerCache(this, method, peerValue);
    }

    getCached(particleId, method) {
      if (this.isCached(particleId, method)) {
        return this.cache[particleId].cached[method];
      }
      return false;
    }

    registerCache(p, method, value) {
      if (typeof this.cache[p.id] === 'undefined') {
        this.cache[p.id] = {
          particle: p,
          cached: {}
        };
      }
      this.cache[p.id].cached[method] = value;
    }

    resetCache() {
      this.cache = {};
    }

    delCached(particleId) {
      delete this.cache[particleId];
    }

    isCached(particleId, method) {
      let particleCached = typeof this.cache[particleId] !== 'undefined';
      if (particleCached) {
        let imCached = typeof this.cache[particleId].particle.cache[this.id] !== 'undefined';
        if (imCached) {
          let methodCached = typeof this.cache[particleId].cached[method] !== 'undefined';
          if (methodCached) {
            return true;
          }
        }
        // If particleId is cached but self is not cached in particleId, then delete local cache
        this.delCached(particleId);
      }

      return false;
    }
}
