export default class Mapper {

  constructor(regionSize) {
    this.regionSize = regionSize || 400;
    this.regions = {};
  }

  /*
   *  Subscribes particle 'p' to region 'rLabel'
   */
  subscribe(p, rLabel) {
    let region = this.regions[rLabel];
    if (!region.particles.hasOwnProperty(p.id)) {

      // Delete particle from previous region
      if (p.mapperRegion !== null) {
        this.unsubscribe(p, p.mapperRegion);
      }

      region.particles[p.id] = p;
      p.mapperRegion = rLabel;
    }
  }

  /*
   *  Unsubscribe particle 'p' from region 'rLabel'
   */
  unsubscribe(p, rLabel) {
    delete this.regions[rLabel].particles[p.id];
  }

  /*
   *  Update map state
   */
  update(rData, p) {
    if (p.mapperRegion === rData.rLabel) {
      return;
    }

    // Create the region if it doesn't exist already
    if (!this.regions.hasOwnProperty(rData.rLabel)) {
      this.createRegion(rData)
    }

    // Insert particle into the region stack if it's not already inside
    this.subscribe(p, rData.rLabel);
  }

  /*
   *  Get particle's region data
   */
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

  /*
   *  Create a new region
   */
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
