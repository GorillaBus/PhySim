/*

  Exercise 6.4

  Write a code for Raynolds Wandering behaviour
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Vehicle from './lib/Vehicle';
import Attractor from './lib/Attractor';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let car = new Vehicle(center.x / 2, center.y, 5, Math.PI*1.5, 10, 0.8);
  let target = new Vector({ x: center.x, y: center.y });

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();


  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    car.update();

    car.wander(null, null, ctx);

    car.draw(ctx);

    // Draw Target
    // ctx.beginPath();
    // ctx.fillStyle = "rgba(0,0,0,0.5)";
    // ctx.arc(target.getX(), target.getY(), 2, 0, Math.PI*2, true);
    // ctx.fill();
    // ctx.closePath();

    //debugger;
  }

  document.onclick = (e) => {
    target.setX(e.clientX);
    target.setY(e.clientY);
  };
};
