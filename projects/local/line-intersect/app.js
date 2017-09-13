
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });


    let pos1 = new Vector({
      x: 132,
      y: 311
    });

    let vel1 = new Vector({
      x: 332,
      y: 493
    });

    let pos2 = new Vector({
      x: 320,
      y: 390
    });

    let vel2 = new Vector({
      x: 212,
      y: 451
    });


    let m1 = slope(vel1.getY(), pos1.getY(), vel1.getX(), pos1.getX());
    let b1 = yIntercept(vel1.getX(), vel1.getY(), m1);

    let m2 = slope(vel2.getY(), pos2.getY(), vel2.getX(), pos2.getX());
    let b2 = yIntercept(vel2.getX(), vel2.getY(), m2);


    let xPos = 110;
    let pt1 = {
      x: xPos,
      y: lineEq(xPos, m1, b1)
    };

    let xPos2 = 90;
    let pt2 = {
      x: xPos2,
      y: lineEq(xPos2, m2, b2)
    };

    let ptIntersect = intersect(m1, b1, m2, b2);

    console.log(ptIntersect);

    // Demo player setup
    //player.setUpdateFn(update);
    //player.play();

    update();

    // Frame drawing function
    function update() {
        ctx.clearRect(0,0, width, height);

        drawSegment(pos1, vel1, "green");
        drawSegment(pos2, vel2, "red");

        // Draw line Y intercepts
        drawPoint(0, b1, "green", 3);
        drawPoint(0, b2, "red", 3);

        // Draw some extra arbitrary member points
        drawPoint(pt1.x, pt1.y, "green", 3);
        drawPoint(pt2.x, pt2.y, "red", 3);

        // Draw intersection point
        drawPoint(ptIntersect.x, ptIntersect.y, "maroon", 3);
    }

    // Find intercept: b = y - m * x
    function yIntercept(x, y, m) {
      return y - m * x;
    }

    function xIntercept(x, y, m) {
        return x - y / m;
    }

    // Find slope between two lines represented by vectors
    function slope(y1, y2, x1, x2) {
      return (y1 - y2) / (x1 - x2);
    }

    function lineEq(x, m, b) {
      return m*x + b;
    }

    function intersect(m1, b1, m2, b2) {
      let x = (b2-b1)/(m1-m2);
      let y = lineEq(x, m1, b1);
      return { x: x, y: y };
    }

    function drawSegment(p, v, c) {
      // A
      ctx.beginPath();
      ctx.moveTo(p.getX(), p.getY());
      ctx.lineTo(v.getX(), v.getY());
      ctx.strokeStyle = c;
      ctx.stroke();
      ctx.closePath();

      drawPoint(p.getX(), p.getY());
    }

    function drawPoint(x, y, c, s) {
      s=s||1;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2, false);
      ctx.fillStyle = c || "#000000";
      ctx.fill();
      ctx.closePath();
    }
};
