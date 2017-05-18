/*
    Example 3.7

    Multiple oscillators with random values built from the Oscillator class

*/
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Oscillator_Vector from './lib/Oscillator_Vector';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let oscs = [];
  for (let i=0; i<100; i++) {
    let osc = new Oscillator_Vector();
    oscs.push(osc);
  }

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(() => {
    ctx.clearRect(0, 0, width, height);


    for (let i=0; i<oscs.length; i++) {
      let osc = oscs[i];

      osc.oscillate();

      ctx.beginPath();
      ctx.arc(width/2 + osc.location.getX(), height/2 + osc.location.getY(), 10, 0, 2*Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
  });

  // Play a loop function
  player.play();

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
