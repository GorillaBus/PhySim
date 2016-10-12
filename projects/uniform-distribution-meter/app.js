import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    let player = new AnimationPlayer();
    let randomCount = new Array(10).fill(0);
    let barWidth = 50;
    let margin = 50;
    let offset = (width / 2) - ((randomCount.length * barWidth) + (randomCount.length * margin)) / 2;

    // Canvas setup
    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor="#999999";

    createUI();

    // Player setup
    player.setUpdateFn(update);
    player.play();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        let index = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
        randomCount[index]++;

        for (let i=0; i<randomCount.length; i++) {
          let barHeight = randomCount[i] * -1 || 0;
          let xPos = offset + (i * barWidth) + (i * margin);

          ctx.beginPath();
          ctx.fillStyle = "#000000";
          ctx.fillRect(xPos, height/1.2, barWidth, barHeight);
          ctx.closePath();
        }
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

    // Display title and legends under bars
    function createUI() {
      let documentElement = document.getElementsByTagName("BODY")[0];
      let H1 = document.createElement("H1");
      H1.innerHTML = "Generating uniformly-distributed pseudo-random numbers from 0 to 9";
      documentElement.appendChild(H1);

      for (let i=0; i<randomCount.length; i++) {
        let xPos = offset + (i * barWidth) + (i * margin);
        let SPAN = document.createElement("SPAN");
        SPAN.style.left =  xPos +"px";
        SPAN.style.top = (height/1.18) + "px";
        SPAN.style.width = barWidth + "px";
        SPAN.innerHTML = i;
        documentElement.appendChild(SPAN);
      }
    }

};
