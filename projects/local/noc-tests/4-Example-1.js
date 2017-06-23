/*
    Example Example 4.1

    Single Particle Trail
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Monitor from '../../../src/lib/Monitor';

import Particle from './lib/Particle';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let pos = {
    x: center.x,
    y: center.y
  };
  let p = new Particle(pos, 50, 255, 0.1);
  let force = new Vector({
    x: Utils.randomRange(-1, 1),
    y: Utils.randomRange(-1, 1)
  });

  p.applyForce(force);


  // Demo player
  let player = new AnimationPlayer();
  let mon = new Monitor();
  let chan1 = mon.newOutput("Example 1");
  let chan2 = mon.newOutput("Example 2");

  player.setUpdateFn(updateFn);

  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    p.rotate(0.001);
    p.update();

    mon.out(chan1, p.angle)
    mon.out(chan2, p.lifeSpan)

    // Draw
    let alpha = Utils.mapRange(p.lifeSpan, 0, 255, 0.0, 1.0);
    ctx.fillStyle = "rgba(0,0,0,"+ alpha +")";


    ctx.save();
    ctx.beginPath();
    ctx.translate(p.location.getX(), p.location.getY());
    ctx.rotate(p.angle);

    ctx.rect(-10, -10, 20, 20);
    ctx.fill();
    ctx.restore();
  }

  // Play a loop function
  player.play();

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

      case 13:
        //updateFn();
      break;
    }

  };
};
