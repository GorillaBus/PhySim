export default class Mapper {

  constructor(particles, regionSize) {
    this.particles = particles || [];
    this.regionSize = regionSize || 400;
    this.regions = {};
  }

  // Add particles reference to the object
  injectParticles(particles) {
    this.particles = particles;
  }

  // Main processing method
  run() {

    for (let i=0; i<this.particles.length; i++) {
      let p = this.particles[i];
      let rData = this.qualifyParticle(p);

      // Update regions and particle
      this.update(rData, p);

      // Iterate thru other particles in the region
      // let rParticles = this.regions[rData.rLabel].particles;
      // for (let x=0; x<rParticles.length; i++) {
      //   let p2 = rParticles[i];
      //   if (p2.id === p.id) {
      //     continue;
      //   }
      //
      //   // Check collision
      //
      // }
    }
  }

  // Update map state
  update(rData, p) {
    if (p.mapperRegion === rData.rLabel) {
      return;
    }

    // Create the region if it doesn't exist already
    if (!this.regions.hasOwnProperty(rData.rLabel)) {
      this.createRegion(rData)
    }

    // Delete particle from previous region
    if (p.mapperRegion !== null) {
      delete this.regions[p.mapperRegion].particles[p.id];
    }

    p.mapperRegion = rData.rLabel;
    p.color = this.regions[p.mapperRegion].color;

    // Insert particle into the region stack if it's not already inside
    let rParticles = this.regions[rData.rLabel].particles;
    if (!rParticles.hasOwnProperty(p.id)) {
      rParticles[p.id] = p;
    }
  }

  // Get particle's region data
  qualifyParticle(p) {
    let pX = p.x;
    let pY = p.y;

    let rData = {
      rX: pX > this.regionSize ? Math.floor(Math.abs(pX / this.regionSize)):0,
      rY: pY > this.regionSize ? Math.floor(Math.abs(pY / this.regionSize)):0
    };
    rData.rLabel = rData.rX +"_"+ rData.rY
    return rData;
  }

  // Create a new region
  createRegion(rData) {

    // Pre-calculate region offset
    let rOffsetX = rData.rX * this.regionSize;
    let rOffsetY = rData.rY * this.regionSize;

    this.regions[rData.rLabel] = {
      color: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      particles: {},
      beginsAtX: rOffsetX,
      beginsAtY: rOffsetY,
      endsAtX: rOffsetX + this.regionSize,
      endsAtY: rOffsetY + this.regionSize
    };
  }
}
