/*

    Exercise 6.3

    Persuit a target
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
  let movingTarget = new Vehicle(center.x * 0.8, center.y * 0.8, 3, Math.PI/1.5, 7, 1);
  let attractor = new Attractor(center.x+200, center.y+200, 100, 9.6);
  let wind = new Vector({ x: -0.03, y: -0.01 });

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();


  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    car.update();
    movingTarget.update();

    attractor.attract(car);
    attractor.attract(movingTarget);
    car.applyForce(wind);
    movingTarget.applyForce(wind);

    movingTarget.seek(target);
    car.persuit(movingTarget);

    car.draw(ctx);
    movingTarget.draw(ctx);

    // Draw Target
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    ctx.arc(target.getX(), target.getY(), 5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    // Draw Planet
    ctx.beginPath();
    ctx.fillStyle = "rgba(33,178,0,0.8)";
    ctx.arc(attractor.location.getX(), attractor.location.getY(), 50, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
  }

  document.onclick = (e) => {
    target.setX(e.clientX);
    target.setY(e.clientY);
  };
};
