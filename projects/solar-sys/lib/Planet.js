import CelestialBody from './CelestialBody';

export default class Planet extends CelestialBody {

  constructor(settings, world) {
    super(settings, world);

    this.grad = this.createGradient();
  }

  draw(lightSource) {
    lightSource = lightSource || null;

    this.reScale();

    if (this.world.needsUpdate) {
      this.grad = this.createGradient();
    }

    if (this.scaledR < 0) {
      return;
    }

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
    this.ctx.fillStyle = this.grad;
    this.ctx.arc(x, y, this.scaledR, 0, Math.PI * 2, false);
    this.ctx.fill();

    if (lightSource) {
      this.drawShadow(lightSource);
    }
  }

};
