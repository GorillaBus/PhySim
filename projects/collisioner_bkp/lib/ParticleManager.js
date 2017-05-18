import Mapper from './Mapper';
import Collisioner from './Collisioner';
import Collide from './Collide';

export default class ParticleManager {

  constructor(settings, ctx) {
    this.ctx = ctx;
    this.mapper = new Mapper(settings.mapper);
    this.collisioner = new Collisioner();
    this.collide = new Collide();
    this.regionDraw = settings.regionDraw || false;
    this.particles = settings.particles || [];
    this.boxWidth = settings.boxWidth || window.innerWidth;
    this.boxHeight = settings.boxHeight || window.innerHeight-4;
    this.world = settings.world;
  }


  /*
   *  Update loop
   */
  update() {

    for (let i=0; i<this.particles.length; i++) {
      let p = this.particles[i];

      // Update particle position
      p.update();

      // Update region status
      this.mapper.update(p);
    }
  }

  /*
   *  Draw loop
   */
  draw() {

    // Clear full screen
    this.ctx.clearRect(0,0, this.boxWidth, this.boxHeight);

    // Draw map regions (debugging)
    if (this.regionDraw) {
      this.drawMappgerRegions();
    }

    // Draw particles
    for (let i=0; i<this.particles.length; i++) {
      let p0 = this.particles[i];

      // Check collisions with particles from the same region
      this.drawParticle(p0);
      this.handleCollisions(p0);
      this.handleAttraction(p0);
    }
  }

  /*
   *  Add particles to the system - if total length is > 150000 or so, check:
   *  -- http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating/17368101#17368101
   */
  addParticles(particles) {
    Array.prototype.push.apply(this.particles, particles);
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
   *  Check and resolve collisions within a particle's mapper region
   */
  handleCollisions(p0) {
    // TODO: Is this really necesary?
    if (!p0.mapperRegions.hasOwnProperty('collision')) {
      return false;
    }

    for (let i=0; i<p0.mapperRegions['collision'].length; i++) {
      let rLabel = p0.mapperRegions['collision'][i];
      let region = this.mapper.layers['collision'].regions[rLabel];
      for (var r in region.particles) {

        if (region.particles.hasOwnProperty(r)) {
          let p1 = region.particles[r];

          if (p0.id === p1.id) {
            continue;
          }

          let collision = this.collisioner.circleCollision(p0, p1);

          // Reslve collision
          if (collision) {
            this.collide.elastic2D(p0, p1, collision);
          }
        }
      }
    }
  }

  /*
   *  Draw a single particle
   */
  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = p.color;
    this.ctx.strokeStyle = p.color;
    this.ctx.fill();
    //this.ctx.stroke();
    this.ctx.closePath();
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
