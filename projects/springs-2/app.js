import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();

    let springPoint = {
        x: width / 2,
        y: height / 2,
        radius: 5
    };

    let k = 1.2;
    let sepparation = 3;
    let radius = 3;
    let grav = 3;
    let friction = 0.3;
    let numWeights = 50;
    let weights = chainWeights(springPoint, numWeights, k, sepparation, radius, grav, friction);

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        ctx.beginPath();
        ctx.arc(springPoint.x, springPoint.y, springPoint.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();

        for(let i=0;i<numWeights;i++) {
            let w = weights[i];
            w.update();
            checkEdges(w);

            ctx.beginPath();
            ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.closePath();
        }
    }


    /* Helpers */

    function checkEdges(p) {
        if(p.y + p.radius > height) {
            p.y = height - p.radius;
            p.vy = p.vy * -0.95;
        }
    }

    function chainWeights(springPoint, n, k, sepparation, radius, grav, friction) {
        n = n || 1;
        let arWeights = [];
        for (let i=0;i<n;i++) {
            let w = new Particle({
                x: springPoint.x + (sepparation * (i+1)),
                y: springPoint.y + (sepparation * (i+1)),
                radius: radius,
                gravity: grav,
                friction: friction
            });

            if (arWeights.length === 0) {
                w.addSpring(springPoint, k, sepparation);
            } else {
                w.addSpring(arWeights[i-1], k, sepparation);
            }

            arWeights.push(w);
        }
        return arWeights;
    }


    /* Events */

    // Move last particle with the pointer
    document.body.addEventListener("mousemove", (e) => {
        springPoint.x = e.clientX;
        springPoint.y = e.clientY;
    });

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
            default:
                break;
        }
    });
};
