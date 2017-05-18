import FEATURE_TOGGLE from '../../../src/feature-toggle';
import Particle from '../../../src/lib/Particle';

export default class ParticleExt extends Particle {

    constructor(settings) {
      super(settings);

      this.mapperRegions = settings.mapperRegions || {};
      this.points = settings.points || [];
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
}
