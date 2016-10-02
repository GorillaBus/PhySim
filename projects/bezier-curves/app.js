import Utils from '../../src/lib/Utils';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let increment = 0.01;
    let player = new AnimationPlayer();;
    let utils = new Utils();

    let t = 0;
    let direction = true;
    let p0 = {
        x: 100,
        y: height / 2
    };
    let p1 = {
        x: width - 100,
        y: height / 2
    };
    // Curve point for cuadratic bezier
    let p2 = {
        x: width - 850,
        y: height - 150
    };
    // An extra point to use with cubic bezier
    let p3 = {
        x: width - 400,
        y: height - 750
    };
    let pResult = {
        x: 0,
        y: 0
    };


    // Demo player
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        // Calculate a quadratic bezier
        utils.quadraticBezier(p0, p2, p1, t, pResult);

        // Replace with this for Cubic Bezier
        //utils.cubicBezier(p0, p2, p3, p1, t, pResult);

        t += increment;

        if (t >= 1) {
            t = 1;
            increment *= -1;
        } else if (t <= 0) {
            t = 0;
            increment *= -1;
        }

        ctx.beginPath();
        ctx.arc(p0.x, p0.y, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();

        // Uncomment to test the Cubic Bezier
        /*
        ctx.beginPath();
        ctx.arc(p3.x, p3.y, 10, 0, Math.PI * 2, false);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        */

        ctx.beginPath();
        ctx.arc(pResult.x, pResult.y, 5, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }


    // Mouse click: sets the bezier curve point position
    document.body.addEventListener("click", (e) => {
        p2.x = e.clientX;
        p2.y = e.clientY;
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
