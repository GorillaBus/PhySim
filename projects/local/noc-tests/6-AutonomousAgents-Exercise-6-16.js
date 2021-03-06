/*

  Exercise 6.16

  Combine flocking with other steering behabiours

*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Boid from './lib/Boid';
import Flock from './lib/Flock';
import FlowField from './lib/FlowField';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;


  /* Flow Field */

  let source = {
    res: {
      x: 0.2,
      y: 0.2,
      z: 0.2
    },
    seed: Math.random()
  };
  let flowField = new FlowField(width, height, 2, 30, source, ctx);


  let elapsedTime = 0;
  let timeStep = 1000;


  /* Flock */

  let flockSettings = {
    separation: 25,
    alignDist: 100,
    cohesion: 50,
    flow: flowField
  };
  let flock = new Flock(flockSettings);


  /* Boids */

  let totalBoids = 200;
  for (let i=0; i<totalBoids; i++) {
    let b = new Boid({
      x: center.x + Utils.mapRange(Math.random(), 0, 1, -100, 100),
      y: center.y + Utils.mapRange(Math.random(), 0, 1, -100, 100),
      mass: null,
      angle: Utils.randomRange(0, Math.PI*2),
      speed: Utils.randomRange(0, 2),
      size: 3,
      maxSpeed: 1, //Utils.randomRange(2.4, 4.2)
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
    elapsedTime += delta;

    let newZ = Math.floor(elapsedTime / timeStep);
    if (newZ > flowField.depth-1) {
      newZ = 0;
      elapsedTime = 0;
    }
    if (newZ != flowField.zIndex) {
      flowField.pushZ();
      flowField.draw();
    }

    flock.run();
  }




  document.onclick = (e) => {
    let boid = new Boid(e.clientX, e.clientY, 5, Math.PI*2, 10, 0);
    boids.push(boid);
    totalBoids++;
  };
};
