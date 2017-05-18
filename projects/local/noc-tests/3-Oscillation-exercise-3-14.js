/*
    Example 3.14

    The failing box exercise
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Mover from './lib/Mover';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let gForce = 1.2;
  let slopeAngle = Math.PI / 12;
  let slope = new Vector({
    x:0,
    y:0,
    length: 2000,
    angle: slopeAngle
  });
  let boxSize = 80;
  let boxWeight = 17;
  let box = new Mover(0, 0, boxWeight, slopeAngle)

  // Calculate failing acceleration
  let normalForce = -1 * gForce * Math.sin(slopeAngle);
  let nfVector = new Vector();
  nfVector.setLength(normalForce);
  nfVector.setAngle(slopeAngle);

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    box.applyForce(nfVector);
    box.checkEdges();
    box.update();

    // Draw slope
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(slope.getX(), slope.getY());
    ctx.stroke();

    // Draw BOX
    ctx.save();
    ctx.translate(box.location.getX(), box.location.getY());
    ctx.rotate(slopeAngle);
    ctx.beginPath();
    ctx.fillRect(0, 0, -boxSize, -boxSize);
    ctx.restore();
  }

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

      case 13:
        //updateFn();
      break;
    }

  };
};
