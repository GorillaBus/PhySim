var player;

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;

    var particleA = Particle.create({
        x: width / 2,
        y: height / 2,
        radius: 20,
        direction: Utils.randomRange(0, Math.PI * 2),
        friction: 0.9,
        speed: 50,
        gravity: 0.1
    });

    var particleB = Particle.create({
        x: width / 2,
        y: height / 2,
        radius: 20,
        direction: Utils.randomRange(0, Math.PI * 2),
        friction: 0.9,
        speed: 50,
        gravity: 0.1
    });

    var particleC = Particle.create({
        x: width / 2,
        y: height / 2,
        radius: 20,
        direction: Utils.randomRange(0, Math.PI * 2),
        friction: 0.9,
        speed: 50,
        gravity: 0.1
    });

    var particleD = Particle.create({
        x: width / 2,
        y: height / 2,
        radius: 20,
        direction: Utils.randomRange(0, Math.PI * 2),
        friction: 0.9,
        speed: 50,
        gravity: 0.1
    });

    var particleE = Particle.create({
        x: width / 2,
        y: height / 2,
        radius: 20,
        direction: Utils.randomRange(0, Math.PI * 2),
        friction: 0.9,
        speed: 50
    });

    var k = 0.5;
    var sepparation = 30;

    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update(updateFn) {
        ctx.clearRect(0,0, width, height);    

        spring(particleA, particleB, sepparation, k);
        spring(particleB, particleC, sepparation, k);
        spring(particleC, particleD, sepparation, k);
        spring(particleD, particleE, sepparation, k);

        checkEdges(particleA);
        checkEdges(particleB);
        checkEdges(particleC);
        checkEdges(particleD);
        checkEdges(particleE);

        particleA.update();
        particleB.update();
        particleC.update();
        particleD.update();
        //particleE.update();

        ctx.beginPath();
        ctx.arc(particleA.position.getX(), particleA.position.getY(), particleA.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(particleB.position.getX(), particleB.position.getY(), particleB.radius , 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(particleC.position.getX(), particleC.position.getY(), particleC.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(particleD.position.getX(), particleD.position.getY(), particleD.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(particleE.position.getX(), particleE.position.getY(), particleE.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(particleA.position.getX(), particleA.position.getY());
        ctx.lineTo(particleB.position.getX(), particleB.position.getY());
        ctx.lineTo(particleC.position.getX(), particleC.position.getY());
        ctx.lineTo(particleD.position.getX(), particleD.position.getY());
        ctx.lineTo(particleE.position.getX(), particleE.position.getY());
        ctx.stroke(); 
        ctx.closePath();
    }


    // Animation control: MouseMove

    document.body.addEventListener("mousemove", function(e) {
        particleE.position.setX(e.clientX);
        particleE.position.setY(e.clientY);
    });


    function spring(p0, p1, sepparation, k) {
        var distance = p0.position.substract(p1.position);
        distance.setLength(distance.getLength() - sepparation);
        var springForce = distance.multiply(k);
        p1.velocity.addTo(springForce);
        p0.velocity.substractFrom(springForce);
    }

    function checkEdges(p) {
        if(p.position.getY() + p.radius > height) {
            p.position.setY(height - p.radius);
            p.velocity.setY(p.velocity.getY() * -0.95);
        }
    }

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
