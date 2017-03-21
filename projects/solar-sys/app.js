import Star from './lib/Star';
import Planet from './lib/Planet';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width = window.innerWidth-4;
    const height = canvas.height = window.innerHeight-4;
    const center = {
      x: width / 2,
      y: height / 2
    };

    // World data
    let world = {
      ctx: ctx,
      width: width,
      height: height,
      center: center,
      scale: 1,
      lastScale: 0,
      trans_x: 0,
      trans_y: 0,
      needsUpdate: false,
      update: function() {
        this.needsUpdate = this.lastScale != this.scale;
      }
    };

    let player = new AnimationPlayer();

    let sunSetup = {
        x: center.x,
        y: center.y,
        mass: 300,
        speed: 0,
        color: "#D6D32D",
        center: true
    };

    let planetsSetup = [{
        x: center.x + 104,
        y: center.y,
        speed: 1.5,
        direction: Math.PI / 2,
        color: '#FA1616',
        mass: 4.5,
        center: false
     },{
        x: center.x - 170,
        y: center.y,
        speed: 1.2,
        direction: -Math.PI / 2,
        color: '#4042A8',
        mass: 11,
        center: false
    },{
        x: center.x - 230,
        y: center.y,
        speed: 1,
        direction: -Math.PI / 2,
        color: '#47BFBD',
        mass: 18,
        center: false
    },{
        x: center.x - 290,
        y: center.y,
        speed: 0.9,
        direction: -Math.PI / 2,
        color: '#AB3A2B',
        mass: 27,
        center: false
    },{
        x: center.x + 292,
        y: center.y,
        speed: 0.9,
        direction: Math.PI / 2,
        color: '#2B7523',
        mass: 27,
        center: false
    },{
        x: center.x - 460,
        y: center.y,
        speed: 0.8,
        direction: -Math.PI / 2,
        color: '#6C29A3',
        mass: 173,
        center: false
    },{
        x: center.x + 549,
        y: center.y,
        speed: 0.8,
        direction: Math.PI / 2,
        color: '#A7A2AB',
        mass: 43,
        center: false
     }];

    // Setup planets
    let planets = createPlanets(planetsSetup);

    // Setup sun
    let sun = createSun(sunSetup);

    // All celestial bodies
    planets.push(sun);

    // Demo player
    player.setUpdateFn(update);
    player.play();


    // Reference framework
    let ctxX;
    let ctxY;
    let centerObject;

    // Frame drawing function
    function update() {
      ctx.clearRect(0, 0, world.width, world.height);

      let totalPlanets = planets.length;

      // Update planets
      for (let i=0; i<totalPlanets; i++) {
        let p = planets[i];
        p.update();

        if (p instanceof Planet) {
          planets[i].gravitateTo(sun);
        }

        // Adjust reference framework to the center body: planet or sun
        if (p.center) {
          centerObject = p;
          ctxX = (world.center.x - p.x) * world.scale + world.trans_x;
          ctxY = (world.center.y - p.y) * world.scale + world.trans_y;
        }

      }

      ctx.save();
      ctx.translate(ctxX, ctxY);

      // Draw planets
      for (let i=0; i<totalPlanets; i++) {
        let p = planets[i];

        if (p.center) {
          continue;
        }

        p.draw(sun);
      }

      ctx.restore();

      // Draw center body
      centerObject.draw(sun);

      world.update();
    }


    /** Helpers **/

    function createSun(config) {
      return new Star(config, world);
    }

    function createPlanets(config) {
        let total = config.length;
        let planets = [];

        for (let i=0; i<total; i++) {
          let p = new Planet(config[i], world);
          planets.push(p);
        }
        return planets;
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
              case 13:                        // Esc
                if (player.playing) {
                    player.stop();
                }

                player.play();
                player.stop();

                break;
            default:
                break;
        }
    });

    document.body.addEventListener("mousewheel", MouseWheelHandler, false);

    function MouseWheelHandler(e) {
      let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      let scaleFactor = world.scale * 0.1;
      if(delta > 0){
          world.scale += scaleFactor;
      } else {
          world.scale -= scaleFactor;
      }
    }

};
