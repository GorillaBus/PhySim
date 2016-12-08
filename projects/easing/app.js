import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });
    let target = {
      x: center.x,
      y: center.y
    };
    let point = {
      x: 0,
      y: 0
    };
    let ease = 0.1;

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        // Draw
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        easeTo(point, target, ease);
    }

    function easeTo(position, target, ease) {
      let dx = target.x - position.x;
      let dy = target.y - position.y;
      position.x += dx * ease;
      position.y += dy * ease;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        position.x = target.x;
        position.y = target.y;
        return false;
      }
      return true;
    }

    // Mouse event
    document.body.addEventListener("mousemove", (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    });

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
