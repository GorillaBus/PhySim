/*
    Exercise 3.3 -- Approach B

    Create a simulation of a car you can drive around the screen
    using the arrow keys

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
  const UP = 0;
  const DOWN = 1;
  const LEFT = 2;
  const RIGHT = 3;

  canvas.height = height;
  canvas.width = width;

  let mouse = new Vector({
    x: 0,
    y: 0
  });

  let accel = -1;
  let steering = false;
  let mass = 10;
  let w = 40;
  let h = 20;
  let angle = 0;
  let angleSpeed = 0.9;
  let speedIncrement = 2;
  let maxSpeed = 10;

  let mover = new Mover(center.x, center.y, mass, null, maxSpeed);



  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    // Change Velocity's length / speed  (Polar coordinates)
    if (accel > -1) {
      let length = mover.velocity.getLength();
      let mag = accel === UP ? length+1:0;

      let x = Math.cos(angle) * mag;
      let y = Math.sin(angle) * mag;
      mover.velocity.setX(x);
      mover.velocity.setY(y);
    }

    // Change Velocity's angle / direction (Polar coordinates)
    if (steering) {
      let steer = mover.velocity.copy();
      let length = steer.getLength();
      let x = Math.cos(angle) * length;
      let y = Math.sin(angle) * length;
      mover.velocity.setX(x);
      mover.velocity.setY(y);
    }


    mover.update();

    ctx.save();
    ctx.translate(mover.location.getX() + w/2, mover.location.getY() + h/2);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.rect(-w/2, -h/2, w, h);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  });

  // Play a loop function
  player.play();

  document.onmousemove = (e) => {
    mouse.setX(e.clientX);
    mouse.setY(e.clientY);
  };

  // Animation control
  document.onkeydown = (e) => {
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


      // UP
      case 38:
        accel = UP;
      break;

      // DOWN
      case 40:
        accel = DOWN;
      break;

      // LEFT
      case 37:
        steering = true;
        angle -= angleSpeed;
      break;

      // RIGHT
      case 39:
        angle += angleSpeed;
        steering = true;
      break;
    }
  };


  document.onkeyup = (e) => {
    switch (e.keyCode) {

      // UP
      case 38:
        accel = -1;
      break;

      // DOWN
      case 40:
        accel = -1;
      break;

      // LEFT
      case 37:
        steering = false;
      break;

      // RIGHT
      case 39:
        steering = false;
      break;
    }
  };

};
