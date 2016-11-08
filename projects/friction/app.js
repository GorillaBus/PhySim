import Drawer from '../../src/lib/Drawer';
import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Vector from '../../src/lib/Vector';

window.onload = () => {
  let drawer = new Drawer();
  let player = new AnimationPlayer();

  let particleCfg = {
    x: drawer.width / 2,
    y: drawer.height / 2,
    speed: 10,
    direction: Math.random() * Math.PI * 2,
    radius: 10,
    friction: 0.97
  };
  let p = new Particle(particleCfg);

  // For a real friction, use this
  let friction = new Vector({ x:0, y:0, length: 0.15 });

  // Demo player
  player.setUpdateFn(update);
  player.play();

  // Frame drawing function
  function update() {
    drawer.clear();

    /*
    // Real friction method (cpu intensive)
    if (p.velocity.getLength() > friction.getLength()) {
      friction.setAngle(p.velocity.getAngle());
      p.velocity.substractFrom(friction);
    } else {
      p.velocity.setLength(0);
    }
    */
    p.update();

    drawer.circle(p.x, p.y, p.radius);
  }

// Animation control: KeyDown
document.body.addEventListener("keydown", (e) => {
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

};
