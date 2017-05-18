import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Noise from '../../src/lib/Perlin';
import Utils from '../../src/lib/Utils';
import Vector from '../../src/lib/Vector';
import Mover from './lib/Mover.js';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  // Create movers
  let movers = new Array(50);
  for (let i=0;i<movers.length;i++) {
    movers[i] = new Mover(Utils.randomRange(100,width-100), 100, Utils.randomRange(1,50));
  }

  let gravCoefficient = 0.1;
  let gravity = new Vector({
    x: 0,
    y: gravCoefficient
  });
  let wind = new Vector({
    x: 0.005,
    y: 0
  });


  // Friction settings
  let frictionCoefficient = 0.1;
  let normalForce = 1;

  // Demo player
  let player = new AnimationPlayer();

  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    for (let i=0;i<movers.length;i++) {
      let mover = movers[i];

      // Aply gravity force
      gravity.setY(gravCoefficient * mover.mass);

      mover.applyForce(gravity);

      // Apply wind force
      mover.applyForce(wind);

      /*
            Apply friction force using the formula:
            Friction -> =  -1 * v-> * u * N

            where:
                  v-> : velocity unit vector, (*-1 means inverted)
                  u   : friction coefficient, strength of the friction force for a given surface
                  N   : normal force, force of gravity over the body that interacts with the surface (just 1 for now...)
      */
      let frictionMagnitude = frictionCoefficient * normalForce;
      let friction = mover.velocity.multiply(-1);
      friction.normalize();
      friction.multiplyBy(frictionMagnitude);
      mover.applyForce(friction);

      mover.checkEdges(width, height);
      mover.update();

      ctx.beginPath();
      ctx.arc(mover.location.getX(), mover.location.getY(), mover.mass, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  });

  // Play a loop function
  player.play();


  document.onmousemove = (e) => {
    //mouse.setX(e.clientX);
    //mouse.setY(e.clientY);
  };

  // Animation control
  document.onkeyup = (e) => {
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
    }
  };

};
