
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Particle from '../../src/lib/Particle.js';
import Vector from '../../src/lib/Vector';
import Utils from '../../src/lib/Utils.js';
import Perlin from '../../src/lib/Perlin';


window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        let x = center.x;
        let y = center.y;

        // Draw
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

};
