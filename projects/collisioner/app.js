
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Particle from '../../src/lib/Particle';
import Utils from '../../src/lib/Utils';
import ParticleManager from '../../src/lib/ParticleManager';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 60 });

    let monOutputs = {};
    let pmanager = new ParticleManager({
      regionDraw: false,
      regionSize: 10,
      regionMon: false
    }, ctx);

    // Create particles
    let particles = new Array(1000);
    for (let i=0; i<particles.length; i++) {
      particles[i] = new Particle({
        x: Utils.randomRange(0, width),
        y: Utils.randomRange(0, height),
        radius: 2,
        direction: Math.random() * Math.PI * 2,
        speed: 2
      });

      let p = particles[i];
      p.id = uuid();
      p.mapperRegion = null;
      p.color = "#000000";
    }

    // Inject particles into the Mapper
    pmanager.injectParticles(particles);

    // Demo player setup
    player.setUpdateFn(update);
    player.play();


    // Frame drawing function
    function update() {

        // Global update
        pmanager.update();

        // Global draw
        pmanager.draw();
    }

    function uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

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
            case 13:
              player.stop();
              player.play();
              player.stop();
              console.log("> Step forward");
              break;
            default:
              break;
        }
    });

};
