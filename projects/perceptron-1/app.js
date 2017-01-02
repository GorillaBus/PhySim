
import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';
import Perceptron from './lib/Perceptron';
import PerceptronTrainer from './lib/PerceptronTrainer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer();
    let ptron = new Perceptron(3, 0.0000001);
    let trainers = new Array(200);
    let count = 0;

    // Line in function of X
    function f(x) {
      return 2*x+1;
    }

    ctx.translate(center.x, center.y);

    // Draw the line
    ctx.moveTo(-center.x, f(-center.x));
    ctx.lineTo(center.x, f(center.x));
    ctx.stroke();


    // Setup - TODO: why don't we pass a 'setup' function to the player?
    for (let i=0;i<trainers.length;i++) {
      let x = Utils.randomRange(-center.x, center.x);
      let y = Utils.randomRange(-center.y, center.y);

      let answer =  1;
      if (y < f(x)) {
        answer = -1;
      }
      trainers[i] = new PerceptronTrainer(x, y, answer);
    }

    // Demo player setup
    player.setUpdateFn(update);
    player.play();




          for (let i=0; i<trainers.length; i++) {
            //ptron.train(trainers[i].inputs, trainers[i].answer);

            let ins = trainers[i].inputs;
            let guess = ptron.feedForward(ins);

            // Draw
            ctx.beginPath();
            ctx.arc(ins[0], ins[1], 8, 0, Math.PI * 2, false);

            if (guess < 0) {
              ctx.fillStyle = "red";
              ctx.fill();
            } else {
              ctx.fillStyle = "green";
              ctx.fill();
            }
          }


    // Frame drawing function
    function update() {
      //ctx.clearRect(-center.x, -center.y, width, height);

      //console.log(ptron.weights);


      for (let i=0; i<trainers.length; i++) {
        ptron.train(trainers[i].inputs, trainers[i].answer);

        let ins = trainers[i].inputs;
        let guess = ptron.feedForward(ins);

        // Draw
        ctx.beginPath();
        ctx.arc(ins[0], ins[1], 8, 0, Math.PI * 2, false);

        if (guess < 0) {
          ctx.fillStyle = "red";
          ctx.fill();
        } else {
          ctx.fillStyle = "green";
          ctx.fill();
        }
      }


      // ptron.train(trainers[count].inputs, trainers[count].answer);
      // count = (count+1) % trainers.length;
      //
      // for (let i=0;i<count;i++) {
      //
      //   let ins = trainers[i].inputs;
      //   let guess = ptron.feedForward(ins);
      //
      //   // Draw
      //   ctx.beginPath();
      //   ctx.arc(ins[0], ins[1], 8, 0, Math.PI * 2, false);
      //
      //   if (guess < 0) {
      //     ctx.fillStyle = "red";
      //     ctx.fill();
      //   } else {
      //     ctx.fillStyle = "green";
      //     ctx.fill();
      //   }
      // }

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
            case 13:
              player.play();
              player.stop();
              console.log("Wep!");
            default:
                break;
        }
    });

};
