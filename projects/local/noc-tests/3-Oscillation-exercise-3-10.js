/*
    Exercise 3.10

    Encapsulate de Wave behaviour into a Wave class
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Wave from './lib/Wave';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let wave = new Wave(500);

  // Demo player
  let player = new AnimationPlayer({ fps: 90 });
  player.setUpdateFn(() => {
    ctx.clearRect(0, 0, width, height);

    let waveData;

    for (let i=0; i<width; i++) {
      waveData = wave.oscillate();

      ctx.beginPath();
      ctx.arc(waveData.x, waveData.y, 1, 0, 2*Math.PI);
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
