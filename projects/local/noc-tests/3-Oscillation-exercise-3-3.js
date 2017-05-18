/*
    Exercise 3.3

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
  let mass = 10;
  let w = 40;
  let h = 20;
  let mover = new Mover(center.x, center.y, mass);

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    if (accel > -1) {
      let v = new Vector();
      switch (accel) {
        case UP:
          v.setY(-1)
        break;

        case DOWN:
          v.setY(1)
        break;

        case LEFT:
          v.setX(-1)
        break;

        case RIGHT:
          v.setX(1)
        break;
      }

      mover.velocity.addTo(v);
      accel = -1;
    }

    mover.update();

    let angle = mover.velocity.getAngle();
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
        accel = LEFT;
      break;

      // RIGHT
      case 39:
        accel = RIGHT;
      break;
    }
  };

};
