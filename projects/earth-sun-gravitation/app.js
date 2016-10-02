import Particle from '../../src/lib/Particle.js';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();

    ctx.scale(.1, .1);

    /*
        We know that the SUN is:

        * 109 times the diameter of the earth:          if earth radius is 1, sun radius should be 109
        * 332,900 times the mass of the earth:          if earth mass is 1, sun mass should be 332900
        * 108.5 times its diameter distant to the earth:  distance is 109 * 108

    */
    const SUN_MASS = 332900;
    const SUN_SIZE = 109;
    const EARTH_POSITION = SUN_SIZE * 108.5;
    const EARTH_MASS = 1;
    const EARTH_SIZE = 100;

    let sun = new Particle({ x: SUN_SIZE / 2, y: height / 2 });
    let earth = new Particle({ x: EARTH_POSITION, y: height / 2,  });
    let bestTime = null;

    // Sun settings
    sun.mass = SUN_MASS;
    sun.radius = SUN_SIZE;

    // Earth settings
    earth.mass = EARTH_MASS;
    earth.radius = EARTH_SIZE;
    earth.setSpeed(6);
    earth.setHeading(Math.PI / 2);

    // Gravitations
    sun.addGravitation(earth);
    earth.addGravitation(sun);

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        sun.update();
        earth.update();

        draw(sun, "yellow");
        draw(earth, "blue");
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
