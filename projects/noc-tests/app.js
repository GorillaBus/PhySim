/*
    Example 3.9

    Dynamic wave drawn as a continuous line
*/
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Wave from './lib/Wave';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let wave = new Wave(200);

  // Demo player
  let player = new AnimationPlayer({ fps: 25 });
  player.setUpdateFn(() => {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    let waveData = wave.oscillate();
    ctx.lineTo(waveData.x, waveData.y);

    ctx.closePath();
    ctx.stroke();
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
