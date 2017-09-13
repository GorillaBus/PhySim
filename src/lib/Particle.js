import FEATURE_TOGGLE from '../../src/feature-toggle';

export default class Particle {

  /*
   *   Pass 'boxBounce' as { w: <with>, h: <height> } to make particle bounce inside a box
   *
   **/
    constructor(settings) {
        this.x = settings.x || 0;
        this.y = settings.y || 0;
        this.vx = (Math.cos(settings.direction) * settings.speed) || 0;
        this.vy = (Math.sin(settings.direction) * settings.speed) || 0;
        this.gravity = settings.gravity || 0;
        this.mass = settings.mass || 1;
        this.radius = settings.radius || settings.mass * 0.87;
        this.friction = settings.friction || 1;
        this.springs = [];
        this.gravitations = [];
        this.positionUpdated = false;
        this.color = settings.color || 'rgba(0,0,0,0.6)';
        this.boxBounce = settings.boxBounce || false;
    }

    /*
     *  Updates the state of the particle
     */
    update() {
        let x = this.x;
        let y = this.y;

        this.handleSprings();
        this.handleGravitations();
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;

        if (this.boxBounce) {
          this.checkBorders(this.boxBounce.w, this.boxBounce.h);
        }

        if (x !== this.x && y !== this.y) {
          this.positionUpdated = true;
        } else {

        }
    }

    /*
     *  Gets the length of the velocity vector, which equals to the hypotenuse
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /*
     *  Using the actual Velocity vector's angle, sets a new length for it
     */
    setSpeed(speed) {
        let heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /*
     *  Gets the angle direction of the velocity vector
     */
    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }

    /*
     *  Changes the Velocity vector's angle and recalculate coordinates
     */
    setHeading(heading) {
        let speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /*
     *  Sums to the Velocity vector x and y values
     */
    accelerate(x, y) {
        this.vx += x;
        this.vy += y;
    }

    /*
    *  Bounce if the particle hits the box (i.e. screen) borders
    */
    checkBorders(width, height) {
      if (this.x + this.radius >= width) {
        this.x = width - this.radius;
        this.vx *=  -1;
      } else if (this.x - this.radius <= 0) {
        this.x = this.radius;
        this.vx *= -1;
      }

      if (this.y + this.radius >= height) {
        this.y = height - this.radius;
        this.vy *=  -1;
      } else if (this.y - this.radius <= 0) {
        this.y = this.radius;
        this.vy *= -1;
      }
    }

    /*
     *  Calculates the angle between this particle and 'p2'
     */
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }

    /*
     *  Calculates the distance to a given particle
     */
    distanceTo(p) {
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /*
     *  Calculates and applies a gravitation vector to a given particle
     */
     gravitateTo(p, gravityFactor) {
         gravityFactor = gravityFactor || 0.04;

         let radiusSum = this.radius + p.radius;
         let massFactor = this.mass * p.mass;

         let dx = p.x - this.x;
         let dy = p.y - this.y;
         let distSQ = (dx * dx) + (dy * dy);
         let dist = Math.sqrt(distSQ);
         let surfaceDist = dist - radiusSum;

         // Cancel gravitation once objects collide
         // TODO: Verify if we can save the Math.sqrt() comparing squares
         if (dist < radiusSum + 5) {
           return;
         }

         //let force = (p.mass) / distSQ; // Force = mass / square of the distance
         let force = gravityFactor * massFactor / (surfaceDist * surfaceDist);

         let ax = (dx / surfaceDist) * force;
         let ay = (dy / surfaceDist) * force;

         this.vx += ax;
         this.vy += ay;
     }

    /*
     *  Registers a particle to gravitate to
     */
    addGravitation(p) {
        this.removeGravitation(p);
        this.gravitations.push(p);
    }

    /*
     *  Unregisters a gravitation particle
     */
    removeGravitation(p) {
        let length = this.gravitations.length;
        for (let i=0; i<length; i++){
            if (this.gravitations[i] === p) {
                this.gravitations.slice(i, 1);
                return true;
            }
        }
    }

    /*
     *  Gravitates to each registered gravitation particle
     */
    handleGravitations() {
        let length = this.gravitations.length;
        for (let i=0; i<length; i++){
            this.gravitateTo(this.gravitations[i]);
        }
    }

    /*
     *  Calculates and applies a spring vector to a given point
     */
    springTo(point, k, length) {
        let dx = point.x - this.x;
        let dy = point.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let force = (distance - length || 0) * k;
        // Instead of getting cos / sin of angle, divide sides by hypotenuse
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
    }

    /*
     *  Registers a new spring point
     */
    addSpring(point, k, length) {
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    }

    /*
     *  Unregisters a spring point
     */
    removeSpring(point) {
        let length = this.springs.length;
        for (let i=0; i<length; i++){
            if (this.springs[i].point === point) {
                this.springs.splice(i, 1);
                return;
            }
        }
    }


    /*
     *  Springs to each registered spring point
     */
    handleSprings() {
        let length = this.springs.length;
        for (let i=0; i<length; i++){
            let spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    }
}
