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
     // Calculate the Distance Vector
     let xDist = p0.x - p1.x;
     let yDist = p0.y - p1.y;
     let distSquared = xDist*xDist + yDist*yDist;
     let radiusSquared = (p0.radius + p1.radius) * (p0.radius + p1.radius);

     // Check collision: using squared distances, same result and saves one Math.sqrt()
     if (distSquared < radiusSquared) {

       // Calculate if particles are moving towards each other or away (after a previous collision)
       let xVelocity = p1.vx - p0.vx;
       let yVelocity = p1.vy - p0.vy;
       let dotProduct = xDist*xVelocity + yDist*yVelocity;

       // If particles are moving away (already collided) return
       if (dotProduct > 0) {


         // Collision Vector: the speed difference projected over the Distance Vector
         // This is the component for the speed difference for the collision
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

}
