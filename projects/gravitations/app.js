import Utils from '../../src/lib/Utils.js';
import Particle from '../../src/lib/Particle.js';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();

    let sun1 = new Particle({ x: 300, y: 200 });
    let sun2 = new Particle({ x: 800, y: 600 });
    let emitter = {
        x: 100,
        y: 0
    };
    let particles = [];
    let numParticles = 1000;
    let bestTime = 5000;

    sun1.mass = 8000;
    sun1.radius = 10;
    sun2.mass = 15000;
    sun2.radius = 20;

    for (let i=0; i<numParticles; i++) {
        let p = new Particle({
            x: emitter.x,
            y: emitter.y,
            speed: Utils.randomRange(7, 8),
            direction: Math.PI / 2 * Utils.randomRange(-.1, .1)
        });
        p.addGravitation(sun1);
        p.addGravitation(sun2);
        p.radius = 3;
        p.startTime = new Date();
        p.endTime = 0;
        particles.push(p);
    }


    // Demo player
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        draw(sun1, "yellow");
        draw(sun2, "yellow");

        for (let i=0; i<numParticles; i++) {
            let p = particles[i];
            p.timing = new Date() - p.startTime;
                    if (p.timing > bestTime) {
                        bestTime = p.timing;
                        console.log("Best time ever: ", bestTime, " mass: ", p.mass);
                        p.mass += 300;
                        p.isCool = true;
                    }
            p.update();
            draw(p, "black");
            if (p.x > width || p.x < 0 ||
                p.y > height || p.y < 0) {

                    p.x = emitter.x;
                    p.y = emitter.y;
                    p.startTime = new Date();
                    p.setSpeed(Utils.randomRange(7,9));
                    p.setHeading(Math.PI / 2 * Utils.randomRange(-.1, .1));
            }
        }
    }

    function draw(p, color) {
        let radius;
        if (p.isCool) {
            ctx.fillStyle = "red";
            radius = bestTime * 0.0007;
        } else {
            ctx.fillStyle = color;
            radius = p.radius;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }


    /** Events **/

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
