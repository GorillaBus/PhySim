import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';
import Vector from '../../src/lib/Vector';
import Mover from './lib/Mover.js';
import Liquid from './lib/Liquid.js';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let utils = new Utils();
  let movers = [];

  // Create movers
  movers[0] = new Mover(300, 50, 5);
  movers[1] = new Mover(900, 400, 5);

  // Cerate a liquid
  let water = new Liquid(0, center.y, width, height/2, 0.1);

  // Gravity force
  let gravCoefficient = 0.1;
  let gravity = new Vector({
    x: 0,
    y: gravCoefficient
  });


  // Demo player
  let player = new AnimationPlayer();

  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    ctx.fillStyle = "#000000";

    for (let i=0;i<movers.length;i++) {
      let mover = movers[i];

      // Aply gravity force
      gravity.setY(gravCoefficient * mover.mass);
      mover.applyForce(gravity);

      /*
          Apply water drag force

      */
      if (mover.isInside(water)) {
        mover.drag(water);
      }

      mover.checkEdges(width, height);
      mover.update();

      ctx.beginPath();
      ctx.arc(mover.location.getX(), mover.location.getY(), mover.mass * 16, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }

    // Draw Liquid
    ctx.beginPath();
    ctx.fillStyle = "rgba(63, 127, 191, 0.76)";
    ctx.fillRect(water.getX(), water.getY(), water.getW(), water.getH());
    ctx.closePath();
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
