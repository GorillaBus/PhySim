import Utils from '../../../src/lib/Utils';
import Particle from './ParticleExt';
import Mapper from './Mapper';

export default class ParticleManager {

  constructor(settings, world, ctx) {
    this.world = world;
    this.ctx = ctx;
    this.mapper = new Mapper(settings.mapper);
    this.interactionMaps = {};
    this.regionDraw = settings.regionDraw || false;
    this.particles = [];
    this.greaterRadius = 0;
  }

  /*
  *  Update loop - general
  */
  update() {
    this.updateParticles();
    this.interact();
  }

  /*
  *  Update particle's state and interaction regions
  */
  updateParticles() {
    for (let i=0; i<this.particles.length; i++) {
      let p = this.particles[i];

      // Update particle position
      p.update();

      // Update region status
      this.mapper.update(p);
    }
  }


  /*
   *  Creates a new mapper layer.
   *  @interaction:   predefined interaction | callbackFn(a, b);
   */
  interactionMapCreate(name, size, interaction) {
    let map = this.mapper.createLayer(name, size);
    if (map) {
      this.interactionMaps[name] = {
        map: map,
        interaction: interaction
      }
    }
  }

  /*
  *  Force interaction loop
  */
  interact() {

    // Iterate through maps: a 'map' is the reference to a Mapper layer
    for (let mapName in this.interactionMaps) {
      let map = this.interactionMaps[mapName].map;
      let interactionMap = this.interactionMaps[mapName];

      // Iterate through map regions
      for (let regionName in map.regions) {
        let region = map.regions[regionName];

        // Iterate through region particles
        for (let p1ID in region.particles) {
          let p1 = region.particles[p1ID];

          // Make p1 interact with other region particles
          for (let p2ID in region.particles) {
            if (p1ID === p2ID) {
              continue;
            }

            let p2 = region.particles[p2ID];

            // Process interaction between particles p1 and p2
            interactionMap.interaction(p1, p2);
          }
        }
      }
    }
  }

  /*
  *  Draw loop
  */
  draw() {

    // Draw mapper regions (debugging)
    if (this.regionDraw) {
      this.drawMappgerRegions();
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


  /*
  *  Draw Mappger Regions (for debugging)
  */
  drawMappgerRegions() {

    // Draw layer regions
    for (let layer in this.mapper.layers) {
      if (this.mapper.layers.hasOwnProperty(layer)) {
        let layerObj = this.mapper.layers[layer];

        for (let r in layerObj.regions) {
          if (layerObj.regions.hasOwnProperty(r)) {

            let mRegion = layerObj.regions[r];
            this.ctx.beginPath();
            this.ctx.strokeStyle = mRegion.color;
            this.ctx.rect(mRegion.beginsAtX, mRegion.beginsAtY, layerObj.regionSize-2, layerObj.regionSize-2);
            this.ctx.stroke();
            this.ctx.closePath();
          }
        }

      }
    }

  }
}
