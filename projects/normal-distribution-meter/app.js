import Ziggurat from '../../src/lib/Ziggurat';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    let ziggurat = new Ziggurat();
    let values = 500;
    let mean =  center.x;             // Media
    let sd = 220;                     // Deviasión Estándar

    // Canvas setup
    canvas.height = height;
    canvas.width = width;

    for (let i=0; i<values; i++) {
      let val = ziggurat.nextGaussian() * sd + mean;

      ctx.beginPath();
      ctx.arc(val, center.y, 30, 0, Math.PI * 2, false);
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fill();
      ctx.closePath();
    }

};
