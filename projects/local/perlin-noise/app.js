import Perlin from '../../../src/lib/Perlin';
import AnimationPlayer from '../../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer();
    let pn = new Perlin('random seed');
    let t = 0;

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
      ctx.clearRect(0,0, width, height);
      t = t + 0.01;
      let x = Math.floor(pn.noise(t, 0, 0) * (width - 1 + 1)) + 1;

      // Draw walker
      ctx.beginPath();
      ctx.arc(x, center.y, 4, 0, Math.PI * 2, false);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }

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
