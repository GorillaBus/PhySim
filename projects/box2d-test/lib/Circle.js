import Entity from './Entity';

export default class Circle extends Entity {

  constructor(id, x, y, angle, center, color, strength, heading, speed, radius) {
    color = color || 'aqua';
    super(id, x, y, angle, center, color, strength, heading, speed);
    this.radius = radius;
  }

  update(state) {
    super.update(state);

    this.radius = state.r;
  }

  // Values are expressed in pixles
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(-(this.x), -(this.y));

    ctx.fillStyle = this.getColor();
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo((this.x), (this.y + this.radius));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
