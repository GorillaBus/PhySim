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
    document.getElementsByTagName("BODY")[0].style = "background: #000000";
    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer();

    // Create dust
    // let dust = new Array(30);
    // for (let i=0;i<dust.length;i++){
    //   let position = {
    //     x: Utils.randomRange(0, width),
    //     y: Utils.randomRange(0, height)
    //   };
    //   let initMass = 1;
    //
    //   dust[i] = new Dust(ctx, position, initMass);
    // }

    // Create dust
    let position1 = {
      x: 100,
      y: center.y,
      length: 3
    };
    let initMass1 = 41;
    let position2 = {
      x: width - 100,
      y: center.y-15,
      length: -2
    };
    let initMass2 = 12;
    let d1 = new Dust(ctx, position1, initMass1);
    let d2 = new Dust(ctx, position2, initMass2);
    let dust = [d1, d2];

    // let direction = dust[1].location.substract(dust[0].location);
    // direction.normalize();
    // direction.multiplyBy(20);
    // dust[0].applyForce(direction);

    // Demo player setup
    player.setUpdateFn(update);
    player.play();
let flag = false;
    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);


        for (let i=0; i<dust.length; i++) {
           dust[i].update();
        }

        for (let i=0; i<dust.length; i++) {
          let d1= dust[i];
          let absorbed = false;

          // Interaction
          for (let x=0; x<dust.length; x++) {
            let d2 = dust[x];

            if (d1.id === d2.id) {
              continue;
            }

            if (d1.collides(d2) && !flag) {
              let recoil = d1.collideElastic(d2);
              flag = true;
              if (recoil) {

                if (d1.mass > d2.mass) {
                  d1.absorb(d2)
                  dust.splice(x, 1);
                } else {
                  d2.absorb(d1);
                  dust.splice(i, 1);
                }

                absorbed = true;
                continue;
              }
            }

          }

          // Update
          //d1.checkEdges(width, height);

          // Draw
          d1.draw();
        }
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
