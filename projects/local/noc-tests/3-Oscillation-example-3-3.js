/*
    Example 3.3

    Pointing in the direction of motion
*/
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let mouse = new Vector({
    x: 0,
    y: 0
  });

  let location = new Vector({
    x: center.x,
    y: center.y
  });

  let velocity = new Vector({
    x: 0,
    y: 0
  });

  let mass = 10;
  let w = 40;
  let h = 20;

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    ctx.clearRect(0,0, width, height);

    let acceleration = mouse.substract(location);
    let length = acceleration.getLength();

    acceleration.normalize();
    acceleration.multiplyBy(mass / length);
    velocity.addTo(acceleration);
    let angle = Math.atan2(velocity.getY(), velocity.getX());

    location.addTo(velocity);

    ctx.save();
    ctx.translate(location.getX() + w/2, location.getY() + h/2);
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
    }
  };

};
