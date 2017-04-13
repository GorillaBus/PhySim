import FEATURE_TOGGLE from '../../../src/feature-toggle';
import Particle from '../../../src/lib/Particle';

export default class ParticleExt extends Particle {

    constructor(settings) {
      super(settings);

      this.shape = settings.shape || "circle";
      this.mapperRegions = settings.mapperRegions || {};
      this.color = settings.color || "#000000";
      this.points = settings.points || [];
      this.boxBounce = settings.boxBounce || false;
    }

}
