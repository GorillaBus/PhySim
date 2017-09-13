import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import LineUtils from '../../../src/lib/LineUtils.js';
import Mover from '../../../src/lib/Mover.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });

    let mover1 = new Mover(432, 311);
    let mover2 = new Mover(540, 460);

    // Set velocities
    mover1.velocity.setX(70);
    mover1.velocity.setY(209);
    mover2.velocity.setX(-80);
    mover2.velocity.setY(21);

    // Find distance ratio between both mover's location and velocity
    let e1 = mover1.location.add(mover1.velocity);
    let e2 = mover2.location.add(mover2.velocity);
    let d1 = e1.substract(mover1.location);
    let d2 = e2.substract(mover2.location);
    let mag1 = d1.getLength();
    let mag2 = d2.getLength();
    let ratio = mag1 / mag2;

    // Find intersection vector
    let intersect = mover1.findIntercept(mover2);
    let intersectVect = new Vector({ x: intersect.x, y: intersect.y });

    let m2ToIntersect = intersectVect.substract(mover2.location);
    let dist = m2ToIntersect.getLength();
    let dir = mover1.velocity.copy();
    dir.normalize();
    dir.multiplyBy(dist*ratio);

    // Position of mover 1 when mover 2 is at intersection point
    let pt = {
      x: mover1.location.getX() + dir.getX(),
      y: mover1.location.getY() + dir.getY()
    };



    // Demo player setup
    //player.setUpdateFn(update);
    //player.play();

    update();

    // Frame drawing function
    function update() {
      ctx.clearRect(0,0, width, height);

      drawMover(mover1, "red");
      drawMover(mover2, "green");
      drawPoint(intersect.x, intersect.y, "green", 2);
      drawPoint(pt.x, pt.y, "red", 3);
    }

    function drawMover(m, c) {
      c = c || "#000000";

      let nextPos = m.location.add(m.velocity);

      // Draw position
      ctx.beginPath();
      ctx.arc(m.location.getX(), m.location.getY(), m.radius, 0, Math.PI*2, true);
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.closePath();

      // Draw velocity
      ctx.beginPath();
      ctx.moveTo(m.location.getX(), m.location.getY());
      ctx.lineTo(nextPos.getX(), nextPos.getY());
      ctx.strokeStyle = c;
      ctx.stroke();
      ctx.closePath();
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
