import Utils from '../../src/lib/Utils';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import ParticleManager from './lib/ParticleManager';

window.onload = () => {

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;


  // World settings
  const G = 0.4;
  let world = {
    G: G
  };


  let player = new AnimationPlayer({ fps: 60 });


  // Create particle fixtures
  let particlesFixtures = new Array(2000);

  for (let i=0; i<particlesFixtures.length; i++) {
    let p = {
        x: Utils.randomRange(50, width-50),
        y: Utils.randomRange(50, height-50),
        mass: Utils.randomRange(1, 3),
        // direction: Utils.randomRange(-1, 1),
        // speed: Utils.randomRange(0.5, 1),
        boxBounce: { w: width, h: height }
    };

    particlesFixtures[i] = p;
  }


  let regionSize = 15 * 4;
  let pmanager = new ParticleManager({
    regionDraw: false,
    mapper: {
      collision: {
        regionSize: regionSize
      },
      gravity: {
        regionSize: 500
      }
    }
  },
  world,
  ctx);


  // Add particlesFixtures into the Mapper
  pmanager.addParticles(particlesFixtures);

  // Demo player setup
  player.setUpdateFn(update);
  player.play();


  // Frame drawing function
  function update() {

    // Update particle's state
    pmanager.update();

    // Clear full screen
    ctx.clearRect(0,0, width, height);

    // Global draw
    pmanager.draw();
  }

};
