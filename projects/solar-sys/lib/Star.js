import CelestialBody from './CelestialBody';

export default class Planet extends CelestialBody {

  constructor(settings, world) {
    super(settings, world);

    this.grad = this.createGradient();
  }

  draw() {
    this.reScale();

    if (this.scaledR < 0) {
      return;
    }

    if (this.world.needsUpdate) {
      this.grad = this.createGradient();
    }

    this.ctx.fillStyle = this.grad;
    this.ctx.beginPath();
    this.ctx.arc(this.scaledX, this.scaledY, this.scaledR, 0, Math.PI * 2);
    this.ctx.fill();
  }

};
