/*

  Example 6.9 - Flocking

  
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Boid from './lib/Boid';
import Flock from './lib/Flock';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let flock = new Flock();
  let totalBoids = 250;
  for (let i=0; i<totalBoids; i++) {
    let b = new Boid({
      x: center.x,
      y: center.y,
      mass: null,
      angle: Utils.randomRange(0, Math.PI*2),
      speed: Utils.randomRange(0, 2),
      size: 3,
      maxSpeed: 3, //Utils.randomRange(2.4, 4.2)
      maxSteeringForce: 0.05,
      borders: { width: width, height: height },
      ctx: ctx
    });

    flock.addBoid(b);
  }

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();

  function updateFn(delta, elapsed) {
    ctx.clearRect(0, 0, width, height);

    flock.run();
  }


  document.onclick = (e) => {
    let boid = new Boid(e.clientX, e.clientY, 5, Math.PI*2, 10, 0);
    boids.push(boid);
    totalBoids++;
  };
};
