var player;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;

    var springPoint = {
        x: width / 2,
        y: height / 2
    };

    var weight = Particle.create({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 20,
        friction: 0.9
    });

    var k = 0.1;


    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update(updateFn) {
        ctx.clearRect(0,0, width, height);    

        var dx = springPoint.x - weight.x;
        var dy = springPoint.y - weight.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var force = distance * k;
        // Instead of getting cos / sin of angle, divide sides by hypotenuse
        var ax = (dx / distance) * force;
        var ay = (dy / distance) * force;

        weight.vx += ax;
        weight.vy += ay;

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
        ctx.moveTo(weight.x, weight.y);
        ctx.lineTo(springPoint.x, springPoint.y);
        ctx.stroke();
        ctx.closePath();
    }


    // Animation control: MouseMove
    document.body.addEventListener("mousemove", function(e) {
        springPoint.x = e.clientX;
        springPoint.y = e.clientY;
    });

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
