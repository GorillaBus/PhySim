import Noise from '../../src/lib/Perlin';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let noise = new Noise();
    noise.seed(Math.random());

    // Get pixel data
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;

    let xOff = 0.0;
    for (let y=0;y<height;y++) {
      let yOff = 0.0;
      for (let x=0;x<width;x++) {
        let index = (y * width + x) * 4;
        let alpha = mapRange(noise.noise(xOff, yOff), 0, 1, 0, 255);


        data[index+3] = alpha;
        yOff += 0.005358;
      }
      xOff += 0.005358;
    }

    ctx.putImageData(imageData, 0, 0);

    function mapRange(value, low1, high1, low2, high2) {
      let result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      if (low2 === parseInt(low2, 10) || high2 === parseInt(high2, 10)) {
        result = parseInt(result);
      }
      return result;
    }
};
