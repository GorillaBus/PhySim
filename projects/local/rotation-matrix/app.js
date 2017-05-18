
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Particle from '../../../src/lib/Particle.js';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils.js';
import Perlin from '../../../src/lib/Perlin';


window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer();
    let point = { x: 300, y: 200 };
    let delta = 0.1;

    ctx.translate(center.x, center.y);

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(-center.x, -center.y, width, height);

        // Draw
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        let cos = Math.cos(delta);
        let sin = Math.sin(delta);
        let x = point.x * cos - point.y * sin;
        let y = point.y * cos + point.x * sin;

        point.x = x;
        point.y = y;
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
            default:
                break;
        }
    });

};
