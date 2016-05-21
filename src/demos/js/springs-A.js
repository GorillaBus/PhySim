var player;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;

    var springPoint = Vector.create({
        x: width / 2,
        y: height / 2
    });

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

        var distance = springPoint.substract(weight.position);
        var force = distance.multiply(k);

        weight.velocity.addTo(force);
        weight.update();

        ctx.beginPath();
        ctx.arc(weight.position.getX(), weight.position.getY(), weight.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(springPoint.getX(), springPoint.getY(), 10, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(weight.position.getX(), weight.position.getY());
        ctx.lineTo(springPoint.getX(), springPoint.getY());
        ctx.stroke();
        ctx.closePath();
    }


    // Animation control: MouseMove
    document.body.addEventListener("mousemove", function(e) {
        springPoint.setX(e.clientX);
        springPoint.setY(e.clientY);
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
