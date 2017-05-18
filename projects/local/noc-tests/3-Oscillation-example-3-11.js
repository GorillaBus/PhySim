/*
    Example 3.11

    Spring and Bob
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Spring from './lib/Spring';
import Mover from './lib/Mover';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let dragging = false;
  let bob = new Mover(center.x, 200, 20);
  let spring = new Spring(center.x, 1, 200, 0.1);
  let gravity = new Vector({ x: 0, y: 1 });

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    if (dragging) {
      bob.resetVelocity();

    } else {

      bob.applyForce(gravity);
      spring.connect(bob);
      bob.update();
    }

    // Draw Spring's anchor
    ctx.beginPath();
    ctx.fillRect(spring.anchor.getX()-10, spring.anchor.getY(), 20, 20);

    // Draw Spring's line
    ctx.beginPath();
    ctx.moveTo(spring.anchor.getX(), spring.anchor.getY());
    ctx.lineTo(bob.location.getX(), bob.location.getY());
    ctx.stroke();

    // Draw bob
    ctx.beginPath();
    ctx.arc(bob.location.getX(), bob.location.getY(), 50, 0, Math.PI * 2, true);
    ctx.fill();
  }

  // Play a loop function
  player.play();


  // Drag the Bob around the screen
  document.onmousedown = (e) => {
      dragging = true;
  };

  document.onmousemove = (e) => {
    if (dragging) {
      bob.location.setX(e.clientX);
      bob.location.setY(e.clientY);
    }
  };

  document.onmouseup = (e) => {
    if (dragging) {
      dragging = false;
    }

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

      case 13:
        //updateFn();
      break;
    }

  };
};
