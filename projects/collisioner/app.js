import Utils from '../../src/lib/Utils';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import ParticleManager from './lib/ParticleManager';
import Matter from './matter';

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
  let particlesFixtures = new Array(1200);
  let matterTypes = Object.keys(Matter);
  let totalMatterTypes = matterTypes.length;

  for (let i=0; i<particlesFixtures.length; i++) {

    let randomMatter = Math.floor(Math.random() * totalMatterTypes) + 0;
    let matterType = matterTypes[randomMatter];

    let p = {
        x: Utils.randomRange(50, width-50),
        y: Utils.randomRange(50, height-50),
        mass: Utils.randomRange(1, 3),
        direction: Utils.randomRange(-1, 1),
        //speed: Utils.randomRange(0.5, 1),
        matter: matterType,
        boxBounce: { w: width, h: height }
    };

    particlesFixtures[i] = p;
  }

  // particlesFixtures[0] = {
  //   x: center.x-100,
  //   y: center.y,
  //   mass: 23,
  //   color: "rgba(0, 255, 0, 0.5)",
  //   boxBounce: { w: width, h: height }
  // };
  //
  // particlesFixtures[1] = {
  //   x: center.x+100,
  //   y: center.y,
  //   mass: 23,
  //   boxBounce: { w: width, h: height }
  // };

  let pmanager = new ParticleManager({
    debug: false
  }, world, ctx);

  // Create interaction maps
  // TODO: Check what happens with duplicated layers.
  let collisionRegionSize = 200;
  let gravityRegionSize = width/4;
  pmanager.addInteractionMap('collision', collisionRegionSize, 'collision');
  pmanager.addInteractionMap('gravity', gravityRegionSize, 'gravity');

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
