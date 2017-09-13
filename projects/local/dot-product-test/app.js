
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Utils from '../../../src/lib/Utils.js';
import Mover from '../../../src/lib/Mover';


window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });

    // Demo player setup
    player.setUpdateFn(update);
    //player.play();

    let p1 = new Mover(100, -20);
    p1.velocity.setX(0);
    p1.velocity.setY(20);

    let p2 = new Mover(0, 0);
    p2.velocity.setX(150);
    p2.velocity.setY(0);

    drawUI();

    drawVector(p1);
    setValues('alpha', p1);
    drawVector(p2);
    setValues('beta', p2);

    drawDifference(p1, p2);

    // Frame drawing function
    function update() {
      ctx.clearRect(0,0, width, height);


    }

    function drawDifference(p1, p2) {

      let dif = p1.location.substract(p2.location);
      let dist = dif.getLength();
      dif.normalize();

      dif.multiplyBy(p2.velocity.getLength())

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,0,0,1)";
      ctx.arc(dif._x, dif._y, 2, 0, Math.PI*2, true)
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      return dot;
    }

    function drawVector(p) {
      let x = p.location.getX();
      let y = p.location.getY();
      let pvx = x + p.velocity.getX();
      let pvy = y + p.velocity.getY();

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.strokeStyle = Utils.randomColor();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(pvx, pvy);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.arc(x, y, 2, 0, Math.PI*2, true)
      ctx.fill();
      ctx.closePath();

      // ctx.beginPath();
      // ctx.fillStyle = "rgba(255,0,0,0.5)";
      // ctx.arc(pvx, pvy, 2, 0, Math.PI*2, true)
      // ctx.fill();
      // ctx.closePath();

      ctx.restore();
    }

    function drawUI(w, h) {
      let width = 800;
      let height = 600;
      let offsetX = center.x - width/2;
      let offsetY = center.y - height/2;
      let listX = center.x + width/2;
      let listY = center.y + height/2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.beginPath();
      ctx.strokeStyle = "#000000";
      ctx.rect(0, 0, width, height);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
      ctx.arc(center.x, center.y, 3, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();


      let body = document.getElementsByTagName("BODY")[0];
      let list = document.createElement("UL");
      list.style = "margin:0; padding:0; list-style-type: none; position: absolute; left:"+ offsetX +"px; top:"+ listY +"px; padding-top: 20px;";

      let v1 = document.createElement("LI");
      v1.innerHTML = "Vector 1: x= <span id='v1x'>0</span>, x= <span id='v1y'>0</span>";

      let alpha = document.createElement("LI");
      alpha.innerHTML = "Alpha: <span id='alpha'>0</span>";

      let v2 = document.createElement("LI");
      v2.innerHTML = "Vector 2: x= <span id='v2x'>0</span>, x= <span id='v2y'>0</span>";

      let beta = document.createElement("LI");
      beta.innerHTML = "Beta: <span id='beta'>0</span>";

      let dot = document.createElement("LI");
      dot.innerHTML = "Dot product: <span id='dot'>0</span>";

      list.appendChild(v1);
      list.appendChild(v2);
      list.appendChild(alpha);
      list.appendChild(beta);
      list.appendChild(dot);
      body.appendChild(list);
    }

    function setValues(v, p) {
      let obj = document.getElementById(v);
      let angle = p.location.getAngle();
      obj.innerHTML = angle +" (rad) "+ (Utils.rad2deg(angle)) +" (deg)";

      let x, y;
      if (v === 'alpha') {
        x = document.getElementById('v1x');
        y = document.getElementById('v1y');
      } else {
        x = document.getElementById('v2x');
        y = document.getElementById('v2y');
      }

      x.innerHTML = p.location.getX();
      y.innerHTML = p.location.getY();
    }

    function setDotProduct(d) {
      let obj = document.getElementById('dot');
      obj.innerHTML = d;
    }
};
