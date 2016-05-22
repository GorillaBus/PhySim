var player;

// Browser compatibility hack
var module = function() {
    this.exports = function() { };
};

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth-4;
    var height = canvas.height = window.innerHeight-4;

    var startY = height / 2;
    var baseX = width / 2;
    
    var _sunCfg = {
        x: baseX,
        y: startY,
        mass: 3000,
        direction: -Math.PI * 360,
        speed: 0
    };

    var planetsSetup = [{
        x: baseX - 100,
        y: startY,
        speed: 5.5,
        direction: -Math.PI / 2,
        color: '#0007FF',
        mass: 4.5
    },{
        x: baseX - 170,
        y: startY,
        speed: 4.1,
        direction: -Math.PI / 2,
        color: '#FF3500',
        mass: 11
    },{
        x: baseX - 230,
        y: startY,
        speed: 3.8,
        direction: -Math.PI / 2,
        color: '#30AD1F',
        mass: 18
    },{
        x: baseX - 290,
        y: startY,
        speed: 3.4,
        direction: -Math.PI / 2,
        color: '#F0C65A',
        mass: 27
    },{
        x: baseX - 360,
        y: startY,
        speed: 2.9,
        direction: -Math.PI / 2,
        color: '#3582AF',
        mass: 43
    }];

    var sun = Particle.create(_sunCfg);
    var planets = createPlanets(planetsSetup);



    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update(updateFn) {
        ctx.clearRect(0,0, width, height);

        var total = planets.length;
        for (var i=0; i<total; i++) {
            planets[i].gravitateTo(sun);
            planets[i].update();

            ctx.beginPath();
            ctx.fillStyle = planets[i].color;
            ctx.arc(planets[i].position.getX(), planets[i].position.getY(), planets[i].radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255,255,255,0.5)';
            ctx.fill();
            ctx.closePath();

            if (i === total-1) {
                sun.update();

                ctx.beginPath();
                ctx.fillStyle = "#FFE500";
                ctx.arc(sun.position.getX(), sun.position.getY(), 32, 0, Math.PI * 2, false);
                ctx.shadowBlur = 54;
                ctx.shadowColor = '#E8FF00';
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    function createPlanets(config) {
        var total = config.length;
        var planets = [];
        for (var i=0; i<total; i++) {
            planets.push(Planet.create(config[i]));
        }
        return planets;
    }

    // Animation control: KeyDown
    document.body.addEventListener("keydown", function(e) {
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
    document.body.addEventListener("keyup", function(e) {
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