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

  let noise = new Noise();
  noise.seed(Math.random());
  let xOff = 0;
  let zOff = 1000;

  let mover = new Mover(center.x, center.y, 10);
  let helio = new Vector({
    x: 0,
    y: -0.1
  });
  let wind = new Vector({
    x: Utils.mapRange(noise.noise(xOff, 0), 0, 1, 0, 3),
    y: 0
  });

  let wind2 = new Vector({
    x: Utils.mapRange(noise.noise(zOff, 0), 0, 1, 0, -3),
    y: 0
  });


  // Demo player
  let player = new AnimationPlayer();

  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    mover.applyForce(helio);

    wind.setX(Utils.mapRange(noise.noise(xOff, 0), 0, 1, 0, 3));
    mover.applyForce(wind);

    wind2.setX(Utils.mapRange(noise.noise(zOff, 0), 0, 1, 0, -3));
    mover.applyForce(wind2);

    mover.checkEdges(width, height);

    mover.update();

    ctx.beginPath();
    ctx.arc(mover.location.getX(), mover.location.getY(), 20, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    xOff += 0.1;
    zOff += 0.1;
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
