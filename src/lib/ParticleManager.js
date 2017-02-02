import Mapper from './Mapper';
import Collisioner from './Collisioner';
import Collide from './Collide';

export default class ParticleManager {

  constructor(settings, ctx) {
    settings = settings || {};
    settings = {
      particles: settings.particles || [],
      boxWidth: settings.boxWidth || window.innerWidth,
      boxHeight: settings.boxHeight || window.innerHeight-4,
      regionDraw: settings.regionDraw || false,
      regionSize: settings.regionSize || null
    }

    this.ctx = ctx;
    this.mapper = new Mapper(settings.regionSize);
    this.collisioner = new Collisioner();
    this.collide = new Collide();
    this.regionDraw = settings.regionDraw;
    this.particles = settings.particles;
    this.boxWidth = settings.boxWidth;
    this.boxHeight = settings.boxHeight;
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
      this.checkCollisions(p0);
      this.drawParticle(p0);
    }
  }

  /*
   *  Add particles to the system - if total length is > 150000 or so, check:
   *  -- http://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating/17368101#17368101
   */
  injectParticles(particles) {
    Array.prototype.push.apply(this.particles, particles);
  }

  /*
   *  Check and resolve collisions within a particle's mapper region
   */
  checkCollisions(p0) {
    for (let i=0; i<p0.mapperRegions.length; i++) {
      let rLabel = p0.mapperRegions[i];
      let region = this.mapper.regions[rLabel];
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
    this.ctx.fillStyle = p.color || '#000000';
    this.ctx.fill();
    this.ctx.closePath();
  }

  /*
   *  Draw Mappger Regions (for debugging)
   */
  drawMappgerRegions() {
    // Draw regions
    for (let r in this.mapper.regions) {
      if (this.mapper.regions.hasOwnProperty(r)) {

        let mRegion = this.mapper.regions[r];
        this.ctx.beginPath();
        this.ctx.strokeStyle = mRegion.color;
        this.ctx.rect(mRegion.beginsAtX, mRegion.beginsAtY, this.mapper.regionSize-2, this.mapper.regionSize-2);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }
}
