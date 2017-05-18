/*
    Example 3.9

    Dynamic wave drawn as a continuous line
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Utils from '../../../src/lib/Utils';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let angle = 0;
  let startAngle = 0;
  let angleSpeed = 0.2;
  let amplitude = 100;


  // Demo player
  let player = new AnimationPlayer({ fps: 25 });
  player.setUpdateFn(() => {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    angle = startAngle;

    for (let x=0; x<width; x+=5) {
      let y = Utils.mapRange(Math.sin(angle), -1, 1, 0, amplitude);

      ctx.lineTo(x,y);

      angle += angleSpeed;
    }

    startAngle += 0.2;
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
