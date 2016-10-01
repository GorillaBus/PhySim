import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';

let player;

window.onload = () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth-4;
    let height = canvas.height = window.innerHeight-4;

    // Ship movement & actions
    let angle = 0;
    let turningLeft = false;
    let turningRight = false;
    let thrusting = false;
    let firing = false;

    // Ship drawing
    let shipSettings = {
        x: width / 2,
        y: height / 2,
        friction: 0.99
    };
    let ship = new Particle(shipSettings);
    let thrust = new Vector({ x: 0, y: 0 });
    let bullets = [];
    let numBullets = 0;

    // Demo player
    player = new AnimationPlayer();
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        // Ship movement
        if (turningLeft) {
            angle -= 0.05;
        }

        if (turningRight) {
            angle += 0.05;
        }

        if (thrusting) {
            thrust.setAngle(angle);
            thrust.setLength(0.1);
        } else {
            thrust.setLength(0);
        }

        // Firing adds more bullets
        if (firing) {
            let bulletSettings = {
                x: ship.x,
                y: ship.y,
                speed: 1,
                direction: angle
            };

            let impulseSettings = {
                x: ship.x,
                y: ship.y,
                length: 1,
                angle: angle
            };

            let newBullet = {
                bullet: new Particle(bulletSettings),
                impulse: new Vector(impulseSettings)
            };

            // Add new bullet to the queue
            bullets.push(newBullet);
            numBullets = bullets.length;
        }

        // Update ship position
        ship.accelerate(thrust.getX(), thrust.getY());
        ship.update();

        // Draw ship
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, -7);
        ctx.lineTo(-10, 7);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fillStyle = "#000000";
        ctx.fill();

        // Draw thrust
        if (thrusting) {
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-18, 0);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();

        // Draw bullets
        if (numBullets > 0) {
            for (let i=0;i<numBullets;i++) {
                // Destroy bullet when it goes out of the screen
                if (bullets[i].bullet.x > width || bullets[i].bullet.y > height || bullets[i].bullet.y < 0 || bullets[i].bullet.x < 0) {
                    bullets.splice(i, 1);
                    numBullets--;
                    continue;
                }

                let bullet = bullets[i].bullet;
                let impulse = bullets[i].impulse;

                // Update bullet
                bullet.accelerate(impulse.getX(), impulse.getY());
                bullet.update();

                // Draw bullet
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2, false);
                ctx.fillStyle = "#FF0000";
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            }
        }


        // Handle ship positioning when out of sight
        if (ship.x > width) {
            ship.x = 0;
        }
        if (ship.y > height) {
            ship.y = 0;
        }
        if (ship.x < 0) {
            ship.x = width;
        }
        if (ship.y < 0) {
            ship.y = height;
        }
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

    // Animation control: KeyUp
    document.body.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
            case 38:                        // Up
                thrusting = false;
                break;
            case 37:                        // Left
                turningLeft = false;
                break;
            case 39:                        // Right
                turningRight = false;
                break;
            case 32:                        // Space
                firing = true;
                setTimeout(function() {
                    firing = false;
                }, 20);
                break;
            default:
                break;
        }
    });
};
