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
    var springPoint2 = {
        x: Utils.randomRange(0, width),
        y: Utils.randomRange(0, height)
    };
    var weight = Particle.create({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 20,
        friction: 0.9
    });
    var k = 0.1;
    var springLength = 100;

    weight.addSpring(springPoint, k, springLength);
    weight.addSpring(springPoint2, k, springLength);

    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update(updateFn) {
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
