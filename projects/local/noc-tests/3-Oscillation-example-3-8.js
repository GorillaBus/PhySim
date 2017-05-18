/*
    Example 3.8

    Static wave drawn as a continuous line
*/
import Utils from '../../src/lib/Utils';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let angle = 0;
  let angleSpeed = 0.2;
  let amplitude = 100;

  ctx.beginPath();

  for (let x=0; x<width; x+=5) {
    let y = Utils.mapRange(Math.sin(angle), -1, 1, 0, amplitude);

    ctx.lineTo(x,y);
    ctx.stroke();

    angle += angleSpeed;
  }

  ctx.closePath();
};
