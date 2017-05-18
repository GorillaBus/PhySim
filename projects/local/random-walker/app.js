import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Walker from './lib/Walker';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor="#999999";

    let player = new AnimationPlayer({ fps: 55 });
    let walker = new Walker({
                    x: center.x,
                    y: center.y,
                    stepSize: 10,
                    maxX: width,
                    maxY: height
                });

    // Perlin noise offsets
    let tx = 0;
    let ty = 1000;

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        // Choose a random direction: between 9 posibilities
        //walker.stepMultipleDirections();

        // Choose a random direction: between 4 posibilities, with 40% of chossing the right ->
        //walker.stepProbability();

        // Choose a random direction or jump (using Montecarlo algorithm)
        walker.stepMontecarlo(width, height);

        //walker.stepPerlin(tx, ty);
        tx += 0.01;
        ty += 0.01;


        // Draw walker
        ctx.beginPath();
        ctx.arc(walker.x, walker.y, 4, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
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
