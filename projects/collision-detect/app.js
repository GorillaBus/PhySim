import Utils from '../../src/lib/Utils.js';
import Particle from '../../src/lib/Particle.js';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;

    let player = new AnimationPlayer();;
    let utils = new Utils();

    let demoType = getUrllet()['collision-type'];
    let figure0 = null,
        figure1 = null;
    let mousePos = {
        x: 0,
        y: 0
    };

    // Select DEMO TYPE:
    switch (demoType) {
        case 'circle-circle':
            figure0 = {
                x: width / 2,
                y: height / 2,
                radius: 300
            };

            figure1 = {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 50 + Math.random() * 100
            };
        break;

        case 'circle-point':
            figure0 = {
                x: width / 2,
                y: height / 2,
                radius: 300
            };
        break;

        case 'rectangle-point':
            figure0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };
        break;

        case 'rectangle-rectangle':
            figure0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };

            figure1 = {
                x: 100,
                y: 50,
                width: 100,
                height: 100
            };
        break;

        default:
            figure0 = {
                x: 300,
                y: 200,
                width: 200,
                height: 200
            };
        break;
    }

    // Demo player
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        // Draw mouse pointer position
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        // Render DEMO by TYPE:
        switch (demoType) {

            // Detects CIRCLE - CIRCLE collisions
            case 'circle-circle':
                figure1.x = mousePos.x;
                figure1.y = mousePos.y;

                if (utils.circleCollision(figure0, figure1)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.arc(figure0.x, figure0.y, figure0.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(figure1.x, figure1.y, figure1.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            break;

            // Detects CIRCLE - POINT collisions
            case 'circle-point':
                if (utils.circlePointCollision(mousePos.x, mousePos.y, figure0)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.arc(figure0.x, figure0.y, figure0.radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            break;

            // Detects RECTANGLE - POINT collisions
            case 'rectangle-rectangle':
                figure1.x = mousePos.x;
                figure1.y = mousePos.y;

                if (utils.rectangleCollision(figure0, figure1)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.fillRect(figure0.x, figure0.y, figure0.width, figure0.height);
                ctx.closePath();

                ctx.beginPath();
                ctx.fillRect(figure1.x, figure1.y, figure1.width, figure1.height);
                ctx.beginPath();
            break;

            // Detects RECTANGLE - POINT collisions
            default:
                if (utils.rectanglePointCollision(mousePos.x, mousePos.y, figure0)) {
                    ctx.fillStyle = "#f66";
                } else {
                    ctx.fillStyle = "#999";
                }

                ctx.beginPath();
                ctx.fillRect(figure0.x, figure0.y, figure0.width, figure0.height);
                ctx.closePath();
            break;
        }
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

    // Update mouse position
    document.body.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
};


/* Helpers */
function getUrllet() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
