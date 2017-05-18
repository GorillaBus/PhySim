import Utils from '../../src/lib/Utils';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Particle from './lib/ParticleExt';
import ParticleManager from './lib/ParticleManager';

window.onload = () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;



    let player = new AnimationPlayer({ fps: 30 });


    // World Settings
    const G = 0.5;
    let world = {
      G: G
    };


    // Create particles
    let totalParticles = 2;
    let greaterRadius = 0;

    let particles = new Array(totalParticles);

    //for (let i=0; i<particles.length; i++) {

    //   // Define a mass value in a non-uniform distribution
    //   let r = Math.random();
    //   let orderedMass;
    //   let color;
    //
    //   // Less than 0.2
    //   if (r < 0.01) {
    //     orderedMass = Utils.randomRange(15, 17);
    //     color = "maroon";
    //
    //   } else if (r < 0.2) {
    //     color = "blue";
    //     orderedMass = Utils.randomRange(5, 7);
    //
    //   } else {
    //     color = "green";
    //     orderedMass = Utils.randomRange(1, 2);
    //   }
    //
    //   orderedMass =  Utils.randomRange(25, 27);
    //
    //   particles[i] = new Particle({
    //     x: Utils.randomRange(center.x-100, center.x+100),
    //     y: Utils.randomRange(center.y, center.y),
    //     direction: Math.random() * Math.PI * 2,
    //     mass: orderedMass,
    //     boxBounce: { w: width, h: height }
    //   });
    //
    //   let p = particles[i];
    //   p.id = uuid();
    //
    //   if (p.radius > greaterRadius) {
    //     greaterRadius = p.radius;
    //   }
    // }


    particles[0] = new Particle({
      x: center.x-100,
      y: center.y,
      direction: Math.PI * 2,
      mass: 30,
      speed: 5,
      color: 'red',
      boxBounce: { w: width, h: height }
    });

    particles[1] = new Particle({
      x: center.x+100,
      y: center.y,
      direction: Math.PI,
      mass: 30,
      speed: 0,
      color: 'green',
      boxBounce: { w: width, h: height }
    });



    // Mapper Region Settings
    let regionSizeCollisions = greaterRadius * 2;
    let regionSizeGravity = width;

    // Particle Manager
    let pmanager = new ParticleManager({
      world: world,
      regionDraw: true,      // DEBUG: draw mapper regions
      mapper: {

        // // Collisioner settings
        collision: {
          regionSize: regionSizeCollisions*10
        },

        // Gravity settings
        // gravity: {
        //   regionSize: regionSizeGravity
        // }
      }
    }, ctx);


    // Add particles into the Mapper
    pmanager.addParticles(particles);

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

};
