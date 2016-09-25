import Particle from '../../src/lib/Particle';
import Vector from '../../src/lib/Vector';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

let player;

window.onload = () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth-4;
    let height = canvas.height = window.innerHeight-4;
    let startY = height / 2;
    let baseX = width / 2;
    let _sunCfg = {
        x: baseX,
        y: startY,
        mass: 3000,
        speed: 0,
        gravity: 0
    };
    let sun = new Particle(_sunCfg);
    let planetsSetup = [{
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
    let planets = createPlanets(planetsSetup);
    let scale = {
        x: 1,
        y: 1,
        increment: 0.1
    };
    let pos = {
        x: 0,
        y: 0,
        increment: 1
    };

    
    // Demo player
    player = new AnimationPlayer();
    player.setUpdateFn(update);
    player.play();


    /** Frame drawing function **/

    function update(updateFn) {
        ctx.clearRect(0,0, width, height);

        sun.update();

        ctx.beginPath();
        ctx.fillStyle = "#FFE500";
        ctx.arc(sun.x, sun.y, 32, 0, Math.PI * 2, false);
        ctx.shadowBlur = 54;
        ctx.shadowColor = '#E8FF00';
        ctx.fill();
        ctx.closePath();

        let total = planets.length;
        for (let i=0; i<total; i++) {
            planets[i].gravitateTo(sun);
            planets[i].update();

            ctx.beginPath();
            ctx.fillStyle = planets[i].color;
            ctx.arc(planets[i].x, planets[i].y, planets[i].radius, 0, Math.PI * 2, false);
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255,255,255,0.5)';
            ctx.fill();
            ctx.closePath();
        }
    }

    /** Helpers **/

    function createPlanets(config) {
        let total = config.length;
        let planets = [];
        for (let i=0; i<total; i++) {
            let p = new Particle(config[i]);
            p.color = config[i].color;
            p.radius = p.mass * 0.2;
            planets.push(p);
        }
        return planets;
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
        updateStyle();
    });

    document.body.addEventListener("mousewheel", MouseWheelHandler, false);

    function MouseWheelHandler(e) {
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if(delta > 0){
            scale.x += scale.increment;
            scale.y += scale.increment;
        } else {
            scale.x = (scale.x > 0) ? scale.x - scale.increment : 0;
            scale.y = (scale.y > 0) ? scale.y - scale.increment : 0;
        }
        updateStyle();
    }

    function updateStyle(){
        canvas.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) scale(' + scale.x + ',' + scale.y + ')'
    }

    updateStyle();
};
