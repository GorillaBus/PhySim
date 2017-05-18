import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';
import Vector from '../../src/lib/Vector';
import Mover from './lib/Mover.js';
import Attractor from './lib/Attractor.js';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let clicking = false;
  let utils = new Utils();

  // Create objects
  let attractor = new Attractor(center.x, center.y, 20);
  let movers = [];

  // Demo player
  let player = new AnimationPlayer();

  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    for (let i=0; i<movers.length; i++) {
      let mover = movers[i];

      // Aply gravity force
      // let gForce = attractor.attract(mover);
      // mover.applyForce(gForce);

      // Aply repel force
      let gForce = attractor.repel(mover);
      mover.applyForce(gForce);

      // Aply spring force
      //let gForce = attractor.attractFarthest(mover);
      //mover.applyForce(gForce);

      mover.checkEdges(width, height);
      mover.update();

      // Draw Mover
      ctx.beginPath();
      ctx.arc(mover.location.getX(), mover.location.getY(), mover.mass * 1.5, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }

    // Draw Atractor
    ctx.beginPath();
    ctx.arc(attractor.location.getX(), attractor.location.getY(), 30, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  });

  // Play a loop function
  player.play();

  document.onmousedown = (e) => {
    clicking = true
  };

  document.onmouseup = (e) => {
    clicking = false
  };

  document.onmousemove = (e) => {
    if (!clicking) {
      return false;
    }

    // Create objects
    let mover = new Mover(e.clientX, e.clientY, 3);
    movers.push(mover);

    return;

    let moverAccel = new Vector({
      x: 0,
      y: -12
    });
    mover.applyForce(moverAccel);
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
