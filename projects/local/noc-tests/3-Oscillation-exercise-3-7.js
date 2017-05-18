/*
    Exercise 3.7

    Oscillators with particular properties (vocities, amplitude) to imitate
    behaviour of insect legs (ie)
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

  let oscAmp = {
    x: 40,
    y: 100
  };
  let oscAmp2 = {
    x: 40,
    y: 100
  };
  let oscSpeed = {
    x: -0.1,
    y: 0.1
  };
  let oscSpeed2 = {
    x: -0.1,
    y: -0.1
  };
  let osc1 = new Oscillator_Vector(-1, oscAmp, oscSpeed);
  let osc2 = new Oscillator_Vector(1, oscAmp2, oscSpeed2);


  // Demo player
  let player = new AnimationPlayer({ fps: 90 });
  player.setUpdateFn(() => {
    ctx.clearRect(0, 0, width, height);

    osc1.oscillate();
    osc2.oscillate();

    ctx.beginPath();
    ctx.arc((width/2 - 150) + osc1.location.getX(), height/2 + osc1.location.getY(), 10, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc((width/2 + 150)  + osc2.location.getX(), height/2 + osc2.location.getY(), 10, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(width/2, height/2, 2, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo((width/2 - 150) + osc1.location.getX(), height/2 + osc1.location.getY());
    ctx.lineTo(width/2, height/2);
    ctx.lineTo((width/2 + 150) + osc2.location.getX(), height/2 + osc2.location.getY());
    ctx.stroke();
    ctx.closePath();
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
