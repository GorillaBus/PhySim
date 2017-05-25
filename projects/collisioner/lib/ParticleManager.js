import Utils from '../../../src/lib/Utils';
import Particle from './ParticleExt';
import Mapper from './Mapper';

export default class ParticleManager {

  constructor(settings, world, ctx) {
    this.world = world;
    this.ctx = ctx;
    this.mapper = new Mapper();
    this.interactionMaps = [];
    this.particles = [];
    this.DEBUG_MODE = true;
  }

  /*
  *  Update loop - general
  */
  update() {
    this.updateParticles();
    this.runInteractions();
  }

  debugDrawRegions(displayParticleCount) {
    let totalLayers = this.mapper.layers.length;
    for (let i=0; i<totalLayers; i++) {
      let layer = this.mapper.layers[i];
      let totalRegions = layer.regions.length;
      for (let x=0; x<totalRegions; x++) {
        let region = layer.regions[x];

        // Skip empty regions
        if (region.totalParticles > 0) {
          region.draw(this.ctx);

          if (displayParticleCount) {
            let obj;
            if (!(obj = document.getElementById(region.id))) {
              obj = document.createElement("p");
              obj.innerHTML = region.totalParticles;
              obj.id = region.id;
              obj.style.position = "absolute";
              obj.style.left = (region.x + 2) +"px";
              obj.style.top = (region.y - 5) + "px";
              obj.style.fontSize = "0.5em";
              obj.style.color = "#FFFFFF";

              document.getElementsByTagName("BODY")[0].appendChild(obj);
            }

            obj.innerHTML = region.totalParticles;
          }
        }
      }
    }
  }

  /*
  *  Update particle's state and interaction regions
  */
  updateParticles() {
    let totalParticles = this.particles.length;
    for (let i=0; i<totalParticles; i++) {
      let p = this.particles[i];

      // Update particle position
      p.update();

      // Qualify particle in the Mapper
      this.mapper.register(p);
    }
  }

  /*
   *  Creates a new mapper layer.
   *  @interaction:   predefined interaction | callbackFn(a, b);
   */
  addInteractionMap(id, size, interactionFn) {
    this.mapper.addLayer(id, size, interactionFn);
  }

  /*
  *  Force interaction loop
  */
  runInteractions() {
    let totalInteractions = this.mapper.layers.length;
    for (let i=0; i<totalInteractions; i++) {
      this.mapper.layers[i].iterate();
    }
  }

  /*
  *  Draw loop
  */
  draw() {

    // Draw mapper regions (debugging)
    if (this.DEBUG_MODE) {
      this.debugDrawRegions(true);
    }

    // Draw particles
    for (let i=0; i<this.particles.length; i++) {
      let p0 = this.particles[i];

      // Draw particle
      p0.draw(this.ctx);
    }
  }

  /*
  *  Add particles to the system - if total length is > 150000 or so, check:
  */
  addParticles(settings) {

    for (let i=0; i<settings.length; i++) {
      let particle = new Particle(settings[i]);

      particle.id = Utils.uniqueID();

      if (particle.radius > this.greaterRadius) {
        this.greaterRadius = particle.radius;
      }

      this.particles.push(particle);
    }
  }

  handleAttraction(p0) {
    // TODO: Is this really necesary?
    if (!p0.mapperRegions.hasOwnProperty('gravity')) {
      return false;
    }

    for (let i=0; i<p0.mapperRegions['gravity'].length; i++) {
      let rLabel = p0.mapperRegions['gravity'][i];
      let region = this.mapper.layers['gravity'].regions[rLabel];
      for (var r in region.particles) {

        if (region.particles.hasOwnProperty(r)) {
          let p1 = region.particles[r];

          if (p0.id === p1.id) {
            continue;
          }

          p0.gravitateTo(p1, this.world.G);

        }
      }
    }
  }

}
