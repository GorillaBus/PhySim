import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  // Canvas setup
  canvas.height = height;
  canvas.width = width;

  let player = new AnimationPlayer();

  // Particles setup
  let particles = [];
  let numParticles = 100;
  for (let i=0;i<numParticles;i++) {
    let particleSettings = {
      x: width/2,
      y: height/2,
      speed: Math.random() * 50 + 0.1,
      direction: Math.random() * Math.PI * 2
    };
    let particle = new Particle(particleSettings);
    particles.push(particle);
  }

  // Demo player
  player.setUpdateFn(update);
  player.play();

  // Frame drawing function
  function update() {
    ctx.clearRect(0,0, width, height);

    for (let i=0;i<numParticles;i++) {
      let p = particles[i];
      p.update();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  }


  // Animation control
  document.onkeyup = (e) => {
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
    }
  };

};
