import Entity from './Entity';

export default class Polygon extends Entity {

  constructor(id, x, y, angle, center, color, strength, polys) {
    super(id, x, y, angle, center, color, strength);
    this.polys = polys;
  }

  draw(ctx, SCALE) {
    SCALE = SCALE || 30;

    ctx.save();
    ctx.translate(this.x * SCALE, this.y * SCALE);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
    ctx.fillStyle = this.getColor();

    for (var i = 0; i < this.polys.length; i++) {
      var points = this.polys[i];
      ctx.beginPath();
      ctx.moveTo((this.x + points[0].x) * SCALE, (this.y + points[0].y) * SCALE);
      for (var j = 1; j < points.length; j++) {
         ctx.lineTo((points[j].x + this.x) * SCALE, (points[j].y + this.y) * SCALE);
      }
      ctx.lineTo((this.x + points[0].x) * SCALE, (this.y + points[0].y) * SCALE);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}
