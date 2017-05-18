import FEATURE_TOGGLE from '../../../src/feature-toggle';
import Particle from '../../../src/lib/Particle';

export default class ParticleExt extends Particle {

    constructor(settings) {
      super(settings);

      this.mapperRegions = settings.mapperRegions || {};
      this.points = settings.points || [];
    }

}
