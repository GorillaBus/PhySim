import Particle from '../../../src/lib/Particle';

export default class Planet extends Particle {

  constructor(settings, world) {
    super(settings);

    this.world = world;
    this.ctx = world.ctx;

    this.color = settings.color;
    this.radius = settings.mass * 0.2;
    this.type = settings.type;
    this.center = settings.center;

    this.scaledX = 0;
    this.scaledY = 0;
    this.scaledR = 0;

    this.reScale();

    this.grad = this.type === "sun" ? this.createGradient():null;
  }

  reScale() {
    this.scaledX = (this.x - this.world.center.x) * this.world.scale + this.world.center.x + this.world.trans_x;
    this.scaledY = (this.y - this.world.center.y) * this.world.scale + this.world.center.y + this.world.trans_y;
    this.scaledR = this.radius * this.world.scale;
  }

  draw(sun) {
    this.reScale();

    if (this.scaledR < 0) {
      return;
    }

    switch (this.type) {
      case "planet":
        this.drawPlanet(sun);
        break;

      case "sun":
        this.drawSun();
        break;
    }
  }

  drawSun() {
    if (this.world.scale != this.world.lastScale) {
      this.grad = this.createGradient();
      this.world.update();
    }

    this.ctx.fillStyle = this.grad;
    this.ctx.beginPath();
    this.ctx.arc(this.scaledX, this.scaledY, this.scaledR, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPlanet(lightSource) {
    let x, y;
    switch (this.center) {
      case false:
        x = this.scaledX;
        y = this.scaledY;
        break;
      case true:
        x = this.world.center.x;
        y = this.world.center.y;
        break;
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(x, y, this.scaledR, 0, Math.PI * 2, false);
    this.ctx.fill();

    this.drawShadow(lightSource);
  }

  drawShadow(lightSource) {

    // Get distance from source
    let dx = this.scaledX - lightSource.scaledX;
    let dy = this.scaledY - lightSource.scaledY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let angle;

    // Get the angle depending on the reference framework
    if (this.center) {
      dx = this.x - lightSource.x;
      dy = this.y - lightSource.y;
      angle = Math.atan2(dy, dx);
    } else {
      angle = Math.atan2(dy, dx);
    }

    // Shape props
    let radius = this.scaledR;

    // Shadow props
    let sX, sY;
    let shadowRadius = radius * 6.4;
    let shadowLineWidth = radius * 1.1;
    let shadowBlur = shadowRadius * 0.04;

    // Calculate shadow-circle's coordinates
    let x = lightSource.x + Math.cos(angle) * (dist - shadowRadius + radius * 0.58);
    let y = lightSource.y + Math.sin(angle) * (dist - shadowRadius + radius * 0.58);

    // Shadow setup
    this.ctx.save();

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = shadowBlur;
    this.ctx.shadowColor = 'rgba(0,0,0,1)';

    //clip range by planet area.
    this.ctx.clip();

    // Draw shadow
    this.ctx.beginPath();
    this.ctx.lineWidth = shadowLineWidth;
    this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    this.ctx.arc(x, y, shadowRadius, 0, Math.PI*2);
    this.ctx.stroke();
    this.ctx.stroke();

    this.ctx.restore();
  }

  createGradient() {
    let grad = this.ctx.createRadialGradient(this.scaledX, this.scaledY, this.scaledR/4, this.scaledX, this.scaledY, this.scaledR);
    grad.addColorStop(0,"#FF7");
    grad.addColorStop(0.6,"#FF4");
    grad.addColorStop(0.8,"#FF0");
    grad.addColorStop(1,"#DC0");
    return grad;
  }
};
