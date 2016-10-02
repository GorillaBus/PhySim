import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();
    let utils = new Utils();

    let springPoint = {
        x: width / 2,
        y: height / 2
    };
    let springPoint2 = {
        x: utils.randomRange(0, width),
        y: utils.randomRange(0, height)
    };
    let weight = new Particle({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 20,
        friction: 0.9
    });
    let k = 0.1;
    let springLength = 100;

    weight.addSpring(springPoint, k, springLength);
    weight.addSpring(springPoint2, k, springLength);

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        weight.update();

        ctx.beginPath();
        ctx.arc(weight.x, weight.y, weight.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(springPoint.x, springPoint.y, 10, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(springPoint2.x, springPoint2.y, 10, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint.x, springPoint.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint2.x, springPoint2.y);
        ctx.stroke();
        ctx.closePath();
    }


    // Animation control: MouseMove
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
