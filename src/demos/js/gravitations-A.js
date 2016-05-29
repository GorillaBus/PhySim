var player;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;

    var sun1 = Particle.create({ x: 300, y: 200 });
    var sun2 = Particle.create({ x: 800, y: 600 });
    var emitter = {
        x: 100,
        y: 0
    };
    var particles = [];
    var numParticles = 1000;

    sun1.mass = 10000;
    sun1.radius = 10;
    sun2.mass = 20000;
    sun2.radius = 20;

    for (var i=0; i<numParticles; i++) {
        var p = Particle.create({
            x: emitter.x,
            y: emitter.y,
            speed: Utils.randomRange(7, 8),
            direction: Math.PI / 2 * Utils.randomRange(-.1, .1)
        });
        p.addGravitation(sun1);
        p.addGravitation(sun2);
        p.radius = 3;
        particles.push(p);
    }


    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    /** Frame drawing function **/

    function update(updateFn) {
        ctx.clearRect(0,0, width, height);

        draw(sun1, "yellow");
        draw(sun2, "yellow");

        for (var i=0; i<numParticles; i++) {
            var p = particles[i];
            p.update();
            draw(p, "black");
            if (p.x > width || p.x < 0 ||
                p.y > height || p.y < 0) {

                    p.x = emitter.x;
                    p.y = emitter.y;
                    p.setSpeed(Utils.randomRange(7,9));
                    p.setHeading(Math.PI / 2 * Utils.randomRange(-.1, .1));
            }
        }
    }

    function draw(p, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    
    /** Events **/

    // Animation control: KeyDown
    document.body.addEventListener("keydown", function(e) {
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