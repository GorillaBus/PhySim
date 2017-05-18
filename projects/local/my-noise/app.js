
window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let lastPoint = null;
    let angle = 0.1;
    let increment = 0.1;

    for (let x=0;x<width;x+=50) {

      let r = Math.random();
      let value;

      if (r < 0.7) {
        value = Math.random(0.7, 1.0);
      } else {
        value = Math.random(0.5, 0.6)
      }

      let point = {
        x: x,
        y: mapRange(value, 0, 1, 1, height)
      };

      drawLine(point);

      angle += increment;
    }


    function drawLine(point) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2, true);
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.closePath();

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.closePath();
      }

      lastPoint = {
        x: point.x,
        y: point.y
      };
    }

    function mapRange(value, low1, high1, low2, high2) {
      let result = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      if (low2 === parseInt(low2, 10) || high2 === parseInt(high2, 10)) {
        result = parseInt(result);
      }
      return result;
    }
};
