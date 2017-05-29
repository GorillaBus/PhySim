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
    this.DEBUG_MODE = settings.debug || false;
  }

  /*
   *  General Mapper update method
   */
  update() {
    this.updateParticles();
    this.runInteractions();
  }

  /*
   *  Debugging: draws all regions and total particles on screen
   */
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
   *  Update particle's state
   */
  updateParticles() {
    let totalParticles = this.particles.length;
    for (let i=0; i<totalParticles; i++) {
      let p = this.particles[i];

      // Update particle position
      p.update();

      if (p.positionUpdated) {
        p.resetCache();
      }

      // Register particle in the Mapper
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
    let totalParticles = this.particles.length;
    for (let i=0; i<totalParticles; i++) {
      this.particles[i].draw(this.ctx);
    }
  }

  /*
   *  Add particles to the system - if total length is > 150000 or so, check:
   */
  addParticles(settings) {
    for (let i=0; i<settings.length; i++) {
      let particle = new Particle(settings[i]);
      particle.id = Utils.uniqueID();
      this.particles.push(particle);
    }
  }

}
