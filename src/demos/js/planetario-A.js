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
        speed: 0
    };    
    var sun = Particle.create(_sunCfg);
    var planetsSetup = [{
        x: baseX - 100,
        y: startY,
        speed: 5.5,
        direction: -Math.PI / 2,
        color: '#0007FF',
        mass: 4.5
    },{
        x: baseX + 104,
        y: startY,
        speed: 5.5,
        direction: Math.PI / 2,
        color: '#F3F972',
        mass: 4.5
    },{
        x: baseX - 170,
        y: startY,
        speed: 4.1,
        direction: -Math.PI / 2,
        color: '#FF3500',
        mass: 11
    },{
        x: baseX + 163,
        y: startY,
        speed: 4.1,
        direction: Math.PI / 2,
        color: '#E1EA43',
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
        x: baseX + 292,
        y: startY,
        speed: 3.4,
        direction: Math.PI / 2,
        color: '#9E51C9',
        mass: 27
    },{
        x: baseX - 360,
        y: startY,
        speed: 2.9,
        direction: -Math.PI / 2,
        color: '#3582AF',
        mass: 43
    },{
        x: baseX + 349,
        y: startY,
        speed: 2.9,
        direction: Math.PI / 2,
        color: '#C951A9',
        mass: 43
    }];
    var planets = createPlanets(planetsSetup);

    // Movement of the Sun
    var sunMovement = Vector.create({ x: 0, y: 0 });
    var sunMovementing = false;
    var angle = 0;
    var scale = {
        x: 1,
        y: 1,
        increment: 0.1
    }
    var pos = {
        x: 0,
        y: 0,
        increment: 1
    }

    // Demo player
    player = AnimationPlayer.create();        
    player.setUpdateFn(update);
    player.play();


    /** Frame drawing function **/

    function update(updateFn) {
        ctx.clearRect(0,0, width, height);

        var total = planets.length;
        for (var i=0; i<total; i++) {
            planets[i].gravitateTo(sun);
            planets[i].update();

            ctx.beginPath();
            ctx.fillStyle = planets[i].color;
            ctx.arc(planets[i].x, planets[i].y, planets[i].radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255,255,255,0.5)';
            ctx.fill();
            ctx.closePath();

            if (i === total-1) {
                sun.update();

                ctx.beginPath();
                ctx.fillStyle = "#FFE500";
                ctx.arc(sun.x, sun.y, 32, 0, Math.PI * 2, false);
                ctx.shadowBlur = 54;
                ctx.shadowColor = '#E8FF00';
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    /** Helpers **/

    function createPlanets(config) {
        var total = config.length;
        var planets = [];
        for (var i=0; i<total; i++) {
            var p = Particle.create(config[i]);
            p.color = config[i].color;
            p.radius = p.mass * 0.2;
            planets.push(p);
        }
        return planets;
    }

    /** Events **/

    document.body.addEventListener('mousemove', function (e) {
        sunMovement.setX(e.clientX - (width/2));
        sunMovement.setY(e.clientY - (height/2));
        sun.direction = sunMovement.getAngle();
        if (sun.speed < 0.3) {
            sun.speed(0.3);
        }
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
            /*case 37: // left
                pos.x -= pos.increment;
                break;
            case 38: // up
                pos.y -= pos.increment;
                break;
            case 39: // right
                pos.x += pos.increment;
                break;
            case 40: // down
                pos.y += pos.increment;
                break;*/
            default:
                break;
        }
        updateStyle();
    });

    if (document.body.addEventListener) {
        // IE9, Chrome, Safari, Opera
        document.body.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        document.body.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    // IE 6/7/8
    else document.body.attachEvent("onmousewheel", MouseWheelHandler);

    function MouseWheelHandler(e) {
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(delta > 0){
            scale.x += scale.increment;
            scale.y += scale.increment;
        } else {
            scale.x = (scale.x > 0) ? scale.x - scale.increment : 0;
            scale.y = (scale.y > 0) ? scale.y - scale.increment : 0;
        }
        updateStyle();
    };

    function updateStyle(){
        canvas.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) scale(' + scale.x + ',' + scale.y + ')'
    }

    updateStyle();
};
