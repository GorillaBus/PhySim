export default class Collide {

  /*
   *  2D Elastic Collision
   *
   *  Formula used:
   *  Final Vel 1 =  Velocity += (2 * mass2) / (mass1 + mass2)
   *  Final Vel 2 =  Velocity -= (2 * mass1) / (mass1 + mass2)
   *
   */
  elastic2D(p0, p1, collisionV) {

    // 2D-Elastic collision formula
    let combinedMass = p0.mass + p1.mass;
    let collisionWeight0 = 2 * p1.mass / combinedMass;
    let collisionWeight1 = 2 * p0.mass / combinedMass;

    // Adds the computed collision results to the velocities of p0 / p1
    p0.vx += collisionWeight0 * collisionV.x;
    p0.vy += collisionWeight0 * collisionV.y;
    p1.vx -= collisionWeight1 * collisionV.x;
    p1.vy -= collisionWeight1 * collisionV.y;
   }
}
