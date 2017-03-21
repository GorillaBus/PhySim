import Particle from '../../../src/lib/Particle';

export default class CelestialBody extends Particle {

  constructor(settings, world) {
    super(settings);

    this.world = world;
    this.ctx = world.ctx;

    this.color = this.hexToRGB(settings.color);
    this.radius = settings.mass * 0.2;
    this.center = settings.center;

    this.scaledX = 0;
    this.scaledY = 0;
    this.scaledR = 0;

    this.reScale();
  }

  reScale() {
    this.scaledX = (this.x - this.world.center.x) * this.world.scale + this.world.center.x + this.world.trans_x;
    this.scaledY = (this.y - this.world.center.y) * this.world.scale + this.world.center.y + this.world.trans_y;
    this.scaledR = this.radius * this.world.scale;
  }

  draw() { }

  drawShadow(lightSource) {

    // Shadow props
    let radius = this.scaledR;
    let sX, sY;
    let shadowRadius = radius * 2.7;
    let shadowLineWidth = radius * 0.81;
    let shadowBlur = shadowRadius * 0.6;

    // Get the angle & distance depending on the reference framework
    let dx, dy;
    let dist = 0;
    if (this.center) {
      dx = this.x - lightSource.x;
      dy = this.y - lightSource.y;
    } else {
      dx = this.scaledX - lightSource.scaledX;
      dy = this.scaledY - lightSource.scaledY;
      dist = Math.sqrt(dx * dx + dy * dy);
    }

    // Get distance from source
    let angle = Math.atan2(dy, dx);

    // Calculate shadow-circle's coordinates
    let x = lightSource.x + Math.cos(angle) * (dist - shadowRadius + radius * 1);
    let y = lightSource.y + Math.sin(angle) * (dist - shadowRadius + radius * 1);


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
    this.ctx.stroke();
    this.ctx.stroke();
    this.ctx.stroke();
    this.ctx.stroke();

    this.ctx.restore();
  }

  createGradient() {
    let grad = this.ctx.createRadialGradient(this.scaledX, this.scaledY, this.scaledR/4, this.scaledX, this.scaledY, this.scaledR);
    // grad.addColorStop(0,"#FF7");
    // grad.addColorStop(0.6,"#FF4");
    // grad.addColorStop(0.8,"#FF0");
    // grad.addColorStop(1,"#DC0");

    let step1 = {
      r: this.color.r + Math.floor((255 - this.color.r) * 0.26),
      g: this.color.g + Math.floor((255 - this.color.g) * 0.26),
      b: this.color.b + Math.floor((255 - this.color.b) * 0.26)
    };

    let step2 = {
      r: this.color.r +  + Math.floor((255 - this.color.r) * 0.17),
      g: this.color.g +  + Math.floor((255 - this.color.r) * 0.17),
      b: this.color.b +  + Math.floor((255 - this.color.r) * 0.17)
    };

    let step3 = {
      r: this.color.r,
      g: this.color.g,
      b: this.color.b
    };


    grad.addColorStop(0.2, 'rgba('+ step1.r +', '+ step1.g +', '+ step1.b +', 1)');
    grad.addColorStop(0.8, 'rgba('+ step2.r +', '+ step2.g +', '+ step2.b +', 1)');
    grad.addColorStop(1, 'rgba('+ step3.r +', '+ step3.g +', '+ step3.b +', 1)');

    return grad;
  }

  hexToRGB(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
};
