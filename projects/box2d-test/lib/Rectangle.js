import Entity from './Entity';

export default class Rectangle extends Entity {

  constructor(id, x, y, angle, center, color, strength, halfWidth, halfHeight) {
    super(id, x, y, angle, center, color, strength);
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
  }

  draw(ctx, SCALE) {
    SCALE = SCALE || 30;

    ctx.save();
    ctx.translate(this.x * SCALE, this.y * SCALE);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
    ctx.fillStyle = this.getColor();
    ctx.fillRect((this.x-this.halfWidth) * SCALE,
                 (this.y-this.halfHeight) * SCALE,
                 (this.halfWidth*2) * SCALE,
                 (this.halfHeight*2) * SCALE);
    ctx.restore();
  }
}
