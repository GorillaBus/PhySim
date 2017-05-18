/*
    Example 3.10

    Pendulum example
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Pendulum from './lib/Pendulum';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let origin = new Vector({ x: center.x, y: 100 });
  let pendulum = new Pendulum(origin, 200, 2.2*Math.PI);

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    pendulum.update();

    ctx.beginPath();
    ctx.moveTo(origin.getX(), origin.getY());
    ctx.lineTo(pendulum.position.getX(), pendulum.position.getY());
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pendulum.position.getX(), pendulum.position.getY(), 30, 0, 2*Math.PI, false);
    ctx.fill();
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
