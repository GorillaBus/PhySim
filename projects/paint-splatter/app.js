import Ziggurat from '../../src/lib/Ziggurat';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  // Canvas setup
  canvas.height = height;
  canvas.width = width;

  let ziggurat = new Ziggurat();
  let paintDrops = new Array(500);
  let xMean = center.x;
  let yMean = center.y;
  let sd = 180;
  let colorMean = 5.0237271;
  let colorSD = 0.65;

  for (let i=0; i<paintDrops.length; i++) {
    paintDrops[i] = {
      x: ziggurat.nextGaussian(),
      y: ziggurat.nextGaussian(),
      color: ziggurat.nextGaussian()
    };
  }


  for (let i=0; i<paintDrops.length; i++) {
    let xVal = paintDrops[i].x * sd + xMean;
    let yVal = paintDrops[i].y * sd + yMean;
    let colorVal = paintDrops[i].color * colorSD + colorMean;

    ctx.beginPath();
    ctx.arc(xVal, yVal, 30, 0, Math.PI * 2, false);
    ctx.fillStyle = toHex(colorVal);
    ctx.fill();
    ctx.closePath();
  }



  function toHex( n ) {
    let r = 255 - ( n / 10 * 255 | 0 );
    let g = n / 10 * 255 | 0;

    return '#' +
        ( r ? ( r = r.toString(16), r.length == 2 ? r : '0' + r ) : '00' ) +
        ( g ? ( g = g.toString(16), g.length == 2 ? g : '0' + g ) : '00' ) + '00'
  }

};
