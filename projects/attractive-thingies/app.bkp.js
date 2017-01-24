import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Monitor from '../../src/lib/Monitor';
import Vector from '../../src/lib/Vector';
import Utils from '../../src/lib/Utils.js';

import Dust from './lib/Dust.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    // Playback, Monitoring, Settings...
    let player = new AnimationPlayer({ fps: 30 });
    let mon = new Monitor();
    let chan1 = mon.newOutput("Collision");
    let chan2 = mon.newOutput("p1 IN");
    let chan3 = mon.newOutput("p2 IN");

    // Create dust
    let position1 = {
      x: center.x,
      y: center.y,
      direction: Utils.randomRange(-1, 1)
    };
    let initMass1 = 41;
    let position2 = {
      x: center.x + 190,
      y: height,
      direction: Math.PI * 2
    };
    let initMass2 = 0.6;
    let d1 = new Dust(ctx, position1, initMass1);
    let d2 = new Dust(ctx, position2, initMass2);
    let particles = [d1, d2];

    let direction = d1.location.substract(d2.location);
    direction.normalize();
    direction.multiplyBy(100);
    d2.applyForce(direction);


    // Demo player setup
    player.setUpdateFn(update);
    player.play();
    let flag = true;

    // Frame drawing function
    function update() {
      ctx.clearRect(0,0, width, height);

      // Interaction
      let direction = d1.location.substract(d2.location);
      let distance = direction.getLength();

      for (let i=0; i<particles.length; i++) {
        let p1 = particles[i];

        p1.update();

        for (let x=0; x<particles.length; x++) {
          if (p1.id === particles[x].id) {
            continue;
          }

          let p2 = particles[x];
          if (p1.interact(p2)) {
            mon.out(chan1, "true")
          }
        }

        p1.draw();
      }

      // mon.out(chan2, d1.collisions.indexOf(d2.id));
      // mon.out(chan3, d2.collisions.indexOf(d1.id));
    }

    // Animation control: KeyDown
    document.body.addEventListener("keydown", (e) => {
        //console.log("Key pressed: ", e.keyCode);
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
            player.stop();
            player.play();
            player.stop();
            console.log("> Step forward");
            break;

            default:
                break;
        }
    });

};
