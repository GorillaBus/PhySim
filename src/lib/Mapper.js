import Utils from './Utils';

export default class Mapper {

  constructor(regionSize) {
    this.regionSize = regionSize || 400;
    this.regions = {};
  }

  /*
   *  Subscribes particle 'p' to region 'rLabel'
   */
  subscribe(p, rLabel) {
    this.regions[rLabel].particles[p.id] = p;
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
  update(p) {

    // Qualify particle in the mapper and get the region data
    let rData = this.qualifyParticle(p);

    if (this.regionsCompare(rData.labels, p.mapperRegions)) {
      return false;
    }

    // Areas have changed: unsubscribe particle from any region
    for (let i=0; i<p.maperRegions; i++) {
      this.unsubscribe(p.mapperRegions[i]);
    }

    // Create regions if they doesn't exist already
    for (let i=0; i<rData.regions.length; i++) {
      let r = rData.regions[i];
      if (!this.regions.hasOwnProperty(r.rLabel)) {
        this.createRegion(r);
      }

      // Insert particle into the region stack if it's not already inside
      this.subscribe(p, r.rLabel);
    }

    // Update particle regions register
    p.mapperRegions = rData.labels;
  }

  /*
   *  Get particle's region data.
   *  NOTE: For now we'll consider that every particle is circular
   */
  qualifyParticle(p) {
    let points = Utils.getCirclePoints(p);
    let regions = [];
    let labels = [];

    for (let i=0; i<points.length; i++) {
      let r = this.qualilyPoint(points[i]);

      if (labels.indexOf(r.rLabel) === -1) {
        labels.push(r.rLabel);
        regions.push(r);
      }
    }
    // Save points on particle for debugging
    p.points = points;
    return { regions: regions, labels: labels };
  }


  /*
   *  Qualify a single point within a region
   */
   qualilyPoint(p) {
     let rData = {
       rX: p.x > this.regionSize ? Math.floor(Math.abs(p.x / this.regionSize)):0,
       rY: p.y > this.regionSize ? Math.floor(Math.abs(p.y / this.regionSize)):0,
       rLabel: ""
     };
     rData.rLabel = rData.rX + "_"+ rData.rY;

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

  /*
   *  Helper: Compares two region array structures, returns true when equal
   */
  regionsCompare(reg1, reg2) {
      if(reg1.length !== reg2.length) {
          return false;
      }

      for(let i = reg1.length; i--;) {
          if(reg1[i] !== reg2[i])
              return false;
      }

      return true;
  }
}
