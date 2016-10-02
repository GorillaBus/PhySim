import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';

window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();
    let utils = new Utils();

    // Particles setup
    let particles = [];
    let numParticles = 100;

    for (let i=0;i<numParticles;i++) {
        let particleSettings = {
            x: width/2,
            y: height/2,
            speed: utils.randomRange(0.1, 12),
            direction: Math.random() * Math.PI * 2,
            mass: 0.1,
            radius: 1
        };
        particles.push(new Particle(particleSettings));
    }

    // Demo player
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        for (let i=0;i<numParticles;i++) {
            let p = particles[i];

            // Check particle collisions
            if (i > 0 && p.getSpeed() > 870) {
                for (let x=0;x<numParticles;x++) {
                    if (x===i) { continue; }
                    let z = particles[x];
                    if (utils.circleCollision(
                            {x: p.x, y: p.y, radius: p.radius },
                            {x: z.x, y: z.y, radius: z.radius})) {

                                //p.velocity.addTo(z.velocity);
                                p.radius += z.radius / 2;
                                p.mass += z.mass / 2;
                                particles.splice(x, 1);
                                i--;
                                x--;
                                numParticles--;
                    }
                }
            }


            // Gravitate to with all existing particles
            /*
            if (p.position.getLength() > 870) {
                for (let x=0;x<numParticles;x++) {
                    if (i === x) { continue; }
                    let z = particles[x];
                    p.gravitateTo(z);
                }
            }
            */
            p.update();
        }

        for (let i=0;i<numParticles;i++) {
            let p = particles[i];

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
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
