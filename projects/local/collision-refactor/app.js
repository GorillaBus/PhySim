
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Particle from './lib/Particle';


window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });

    // Particles
    let planet = new Particle({
      x: center.x,
      y: center.y,
      mass: 150,
      // speed: 1,
      // direction: Math.PI * 2,
      color: 'green'
    });

    planet.radius = 500;

    // Adjust planet to make surface visible
    planet.x = center.x;
    planet.y = center.y + planet.radius;


    let ball = new Particle({
      x: center.x,
      y: 400,
      mass: 0.3,
      // speed: -4,
      // direction: Math.PI * 2,
      color: 'red'
    });

    ball.radius = 3;

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update(delta) {
      ctx.clearRect(0,0, width, height);


      planet.update();
      ball.update();


      // Detect collision
      handleCollisions(ball, planet);
      //detectCollision(planet, ball);

      //planet.gravitateTo(ball);
      ball.gravitateTo(planet);



      // planet.checkBorders(width, height);
      ball.checkBorders(width, height);



      // Draw planet
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = planet.color;
      ctx.fill();

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = ball.color;
      ctx.fill();
    }

    // Detect collision
    function detectCollision(p1, p2) {
      var dx = p1.x - p2.x;
      var dy = p1.y - p2.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      let radiusSum = p1.radius + p2.radius;
      let overlap = 0;
      let forceFactor = 0.28;

      if (distance < radiusSum) {

        overlap = radiusSum - distance;

        let newVelX1 = (p1.vx * (p1.mass - p2.mass) + (2 * p2.mass * p2.vx)) / (p1.mass + p2.mass);
        let newVelY1 = (p1.vy * (p1.mass - p2.mass) + (2 * p2.mass * p2.vy)) / (p1.mass + p2.mass);
        let newVelX2 = (p2.vx * (p2.mass - p1.mass) + (2 * p1.mass * p1.vx)) / (p1.mass + p2.mass);
        let newVelY2 = (p2.vy * (p2.mass - p1.mass) + (2 * p1.mass * p1.vy)) / (p1.mass + p2.mass);

        p1.x = p1.x + newVelX1;
        p1.y = p1.y + newVelY1;
        p2.x = p2.x + newVelX2;
        p2.y = p2.y + newVelY2;

        p1.vx = newVelX1 * forceFactor;
        p1.vy = newVelY1 * forceFactor;
        p2.vx = newVelX2 * forceFactor;
        p2.vx = newVelY2 * forceFactor;
      }
    }


    function handleCollisions(p1, p2) {
        let xDist, yDist;
        xDist = p1.x -  p2.x;
        yDist = p1.y -  p2.y;

        let distSquared = xDist*xDist + yDist*yDist;

        //Check the squared distances instead of the the distances, same result, but avoids a square root.
        if(distSquared <= (p1.radius + p2.radius)*(p1.radius + p2.radius)){
            let xVelocity = p2.vx - p1.vx;
            let yVelocity = p2.vy - p1.vy;
            let dotProduct = xDist*xVelocity + yDist*yVelocity;

            //Neat vector maths, used for checking if the objects moves towards one another.
            if(dotProduct > 0){

              let collisionScale = dotProduct / distSquared;
              let xCollision = xDist * collisionScale;
              let yCollision = yDist * collisionScale;

              //The Collision vector is the speed difference projected on the Dist vector,
              //thus it is the component of the speed difference needed for the collision.
              let combinedMass = p1.mass + p2.mass;
              let collisionWeightA = 2 * p2.mass / combinedMass;
              let collisionWeightB = 2 * p1.mass / combinedMass;

              p1.vx += collisionWeightA * xCollision * 0.73;
              p1.vy += collisionWeightA * yCollision * 0.73;
              p2.vx -= collisionWeightB * xCollision * 0.73;
              p2.vy -= collisionWeightB * yCollision * 0.73;
            }
        }

    }


    // Animation control: KeyDown
    document.body.addEventListener("keydown", (e) => {
        //console.log("Key pressed: ", e.keyCode);
        switch (e.keyCode) {
            case 27:                        // Esc
              if (player.playing) {
                  player.stop();
                  console.log("> Scene stopped");
              } else {
                  player.play();
                  console.log("> Playing scene");
              }
            break;

            case 13:
              player.stop();
              player.play();
              player.stop();
              console.log("> Step forward");
            break;

            default:
              break;
        }
    });

};
