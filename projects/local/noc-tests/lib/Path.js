import Vector from '../../../../src/lib/Vector';

export default class Path {

  constructor(radius, direction) {
    this.points = [];
    this.radius = radius || 10;
    this.totalPoints = 0;
    this.directionToRight = direction || true;
  }

  addPoint(x, y) {
    let point = new Vector({ x: x, y: y });
    this.points.push(point);
    this.totalPoints++;
  }

  draw(ctx) {

    for (let i=0; i<this.totalPoints-1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i+1];

      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineCap = "round";
      ctx.lineWidth = this.radius;
      ctx.beginPath();
      ctx.moveTo(p1.getX(), p1.getY());
      ctx.lineTo(p2.getX(), p2.getY());
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p1.getX(), p1.getY());
      ctx.lineTo(p2.getX(), p2.getY());
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = "rgba(0,115,0,0.4)";
      ctx.beginPath();
      ctx.arc(p1.getX(), p1.getY(), this.radius/4, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();

      if (i === this.totalPoints-2) {
        ctx.fillStyle = "rgba(115,0,0,0.4)";
        ctx.beginPath();
        ctx.arc(p2.getX(), p2.getY(), this.radius/4, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  drawPoints(ctx) {
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = this.radius/2;
    ctx.beginPath();
    for (let i=0; i<this.totalPoints; i++) {
      let p = this.points[i];
      ctx.beginPath();
      ctx.arc(p._x, p._y, this.radius/2, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.closePath();
    }

  }
}
