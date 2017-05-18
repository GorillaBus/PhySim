import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';
import Vector from '../../src/lib/Vector';
import Mover from './lib/Mover';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };
  const TWO_PI = Math.PI * 2;

  canvas.height = height;
  canvas.width = width;

  let period = 120;
  let amplitude = 500;
  let frameCount = 0;

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    if (amplitude <= 0) {
      player.stop();
      return;
    }
    ctx.clearRect(0, 0, width, height);

    let state = Math.sin(TWO_PI * (frameCount / period));
    let y = Utils.mapRange(state, -1, 1, 1, amplitude);

    ctx.closePath();
    ctx.beginPath();
    ctx.arc(center.x, y, 10, 0, 2*Math.PI, true);
    ctx.fill();

    frameCount++;
    amplitude -= 1.6;
  });

  // Play a loop function
  player.play();

  document.onmousemove = (e) => {
    // mouse.setX(e.clientX);
    // mouse.setY(e.clientY);
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
