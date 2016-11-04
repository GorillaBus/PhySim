import Particle from '../../src/lib/Particle';
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width = window.innerWidth-4;
  const height = canvas.height = window.innerHeight-4;

  let player = new AnimationPlayer();

  let fl = 5500;
  let shapes = [];
  let numShapes = 5000;

  for (let i=0;i<numShapes;i++) {
    shapes[i] = {
      x: Utils.randomRange(-1000, 1000),
      y: Utils.randomRange(-1000, 1000),
      z: Utils.randomRange(0, 100000)
    };
  }

  // Demo player
  player.setUpdateFn(update);
  player.play();

  // New 0,0 position (vanish point)
  ctx.translate(width/2, height/2);

  // Frame drawing function
  function update() {
    shapes.sort(function(shapeA, shapeB) {
      return shapeB.z - shapeA.z;
    });

    ctx.clearRect(-width/2, -height/2, width, height);

    for (let i=0;i<numShapes;i++) {
      let perspective = fl / (fl + shapes[i].z);

      ctx.save();
      ctx.scale(perspective, perspective);
      ctx.translate(shapes[i].x, shapes[i].y);
      ctx.beginPath();
      ctx.arc(shapes[i].x, shapes[i].y, 5, Math.PI * 2, false);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      shapes[i].z += 250;
      if (shapes[i].z > 99999) {
        shapes[i].z = 0;
      }
    }
  }


  /** Events **/

  // Animation control: KeyDown
  document.body.addEventListener("keydown", (e) => {
    //console.log("Key pressed: ", e.keyCode);
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
      default:
      break;
    }
  });
};
