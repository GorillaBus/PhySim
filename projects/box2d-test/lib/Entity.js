export default class Entity {

  constructor(id, x, y, angle, center, color, strength, heading, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.center = center;
    this.color = color || "red";
    this.isHit = false;
    this.strength = strength;
    this.dead = false;
    this.heading = heading || 0;
    this.speed = speed || 0;
  }

  hit(impulse, source) {
    this.isHit = true;
    if (this.strength) {
      this.strength -= impulse;
      if (this.strength <= 0) {
        this.dead = true
      }
    }

    //console.log(this.id + ", " + impulse + ", " + source.id + ", " + this.strength);
  }

  getColor() {
    if (this.isHit) {
      return 'black';
    } else {
      return this.color;
    }
  }

  update(state) {
    this.x = state.x;
    this.y = state.y;
    this.center = state.c;
    this.angle = state.a;
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // clear
    this.isHit = false;
  }

}
