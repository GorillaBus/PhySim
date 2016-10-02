import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';

window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;
    var player;

    let particleCfg = {
        x: width / 2,
        y: height / 2,
        speed: 10,
        direction: Math.random() * Math.PI * 2,
        radius: 10,
        friction: 0.97
    };
    let p = new Particle(particleCfg);

    // For a real friction, use this
    let friction = new Vector({ x:0, y:0, length: 0.15 });

    // Demo player
    player = new AnimationPlayer();
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        /*
        // Real friction method (cpu intensive)
        if (p.velocity.getLength() > friction.getLength()) {
            friction.setAngle(p.velocity.getAngle());
            p.velocity.substractFrom(friction);
        } else {
            p.velocity.setLength(0);
        }
        */
        p.update();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    // Animation control: KeyDown
    document.body.addEventListener("keydown", (e) => {
        //console.log("Key pressed: ", e.keyCode);
        switch (e.keyCode) {
            case 38:                        // Up
                thrusting = true;
                break;
            case 37:                        // Left
                turningLeft = true;
                break;
            case 39:                        // Right
                turningRight = true;
                break;
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
