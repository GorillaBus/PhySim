/*
    Exercise 3.4

    Spiral path made with polar coordinates system
*/
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';
import Mover from './lib/Mover';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let angle = 0;
  let angleSpeed = 0.01;
  let radio = 10;

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    let xN = center.x + Math.cos(angle) * radio;
    let yN = center.y + Math.sin(angle) * radio;

    ctx.closePath();
    ctx.beginPath();
    ctx.arc(xN, yN, 10, 0, 2*Math.PI, true);
    ctx.fill();

    radio += 0.05;
    angle += angleSpeed;
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
