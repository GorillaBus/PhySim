
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';
import Utils from '../../src/lib/Utils.js';
import Boid from './lib/Boid';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let desired = new Vector({ x: center.x, y: center.y });
    let totalPonits = 5;
    let points = [];
    for (let i=0; i<totalPonits; i++) {
      let p = new Vector({
        x: Utils.randomRange(0, width),
        y: Utils.randomRange(0, height)
      });
      points.push(p);
    }

    let vehicle = new Boid({
      x: Utils.randomRange(10, width),
      y: Utils.randomRange(10, height),
      brain: {
        n: totalPonits,
        c: 0.01
      },
      maxSpeed: 1,
      maxSteeringForce: 0.001,
      borders: {
        width: width,
        height: height
      },
      ctx: ctx
    });


    let player = new AnimationPlayer();
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
      ctx.clearRect(0,0, width, height);

      vehicle.update();

      vehicle.go(points, desired);

      vehicle.draw();

      for (let i=0; i<totalPonits; i++) {
        let p = points[i];
        ctx.beginPath();
        ctx.arc(p.getX(), p.getY(), 10, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();
      }
    }

};
