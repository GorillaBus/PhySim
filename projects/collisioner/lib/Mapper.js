import Utils from '../../../src/lib/Utils';

export default class Mapper {

  /*
   *  Each layer holds regions in which particles may subscribe to interact with other particles
   *
   */
  constructor(settings) {
    this.layers = {};

    // GRAVITY layer
    if (settings.hasOwnProperty('gravity')) {
      this.layers.gravity = {
        regionSize: settings.gravity.regionSize || 500,
        regions: {}
      };
    }

    // COLLISION layer
    if (settings.hasOwnProperty('collision')) {
      this.layers.collision = {
        regionSize: settings.collision.regionSize || 100,
        regions: {}
      };
    }
  }

  /*
   *  Subscribes particle 'p' to region 'rLabel'
   */
  subscribe(p, layer, rLabel) {
    this.layers[layer].regions[rLabel].particles[p.id] = p;
  }

  /*
   *  Unsubscribe particle 'p' from region 'rLabel'
   */
  unsubscribe(p, layer, rLabel) {
    delete this.layers[layer].regions[rLabel].particles[p.id];
  }

  /*
   *  Update map state
   */
  update(p) {

    // Qualify particle in the mapper and get the layer => region data
    let rData = this.qualifyParticle(p);

    for (let layer in rData.layerRegionData) {
      if (rData.layerRegionData.hasOwnProperty(layer)) {

        if (!p.mapperRegions.hasOwnProperty(layer)) {
          p.mapperRegions[layer] = [];
        }

        if (this.regionsCompare(layer, rData.layerRegionData, p.mapperRegions)) {
          continue;
        }

        // Areas have changed: unsubscribe particle from any region
        // TODO: Can we remove validation?
        for (let i=0; i<p.mapperRegions[layer].length; i++) {
          this.unsubscribe(p, layer, p.mapperRegions[layer][i]);
        }

        // Create regions if they doesn't exist already
        for (let reg in rData.layerRegionData[layer].regions) {

          if (!this.layers[layer].regions.hasOwnProperty(reg)) {
            this.createRegion(layer, reg, rData.layerRegionData[layer].regions[reg]);
          }

          // Insert particle into the region stack if it's not already inside
          this.subscribe(p, layer, reg);
        }

        // Update particle regions register
        p.mapperRegions[layer] = rData.ptLabels[layer].regions;
      }
    }
  }

  /*
   *  Get particle's region data.
   *  NOTE: For now we'll consider that every particle is circular
   */
  qualifyParticle(p) {
    let points = Utils.getCirclePoints(p);
    let layers = {};
    let layerRegionData = {};

    for (let layer in this.layers) {
      if (this.layers.hasOwnProperty(layer)) {
        let tempRegions = [];
        let regionLabels = [];

        if (!layers.hasOwnProperty(layer)) {
          // Holds the structure to update particle's subscribbed regions (array of region labels)
          layers[layer] = {
            regions: []
          };

          // Holds the structure with data to identify region boundries
          layerRegionData[layer] = {
            regions: {}
          };
        }

        for (let i=0; i<points.length; i++) {
          let ptRegion = this.qualilyPoint(points[i], layer);

          if (regionLabels.indexOf(ptRegion.rLabel) === -1) {
            regionLabels.push(ptRegion.rLabel);

            layerRegionData[layer].regions[ptRegion.rLabel] = {
              rX: ptRegion.rX,
              rY: ptRegion.rY
            };
          }
        }

        layers[layer].regions = regionLabels;
        //layerRegionData[layer].regions[] = tempRegions;
      }
    }

    // Save points on particle for debugging
    if (!p.points.length) {
      p.points = points;
    }

    return { ptLabels: layers, layerRegionData: layerRegionData };
  }


  /*
   *  Qualify a single point within a region
   */
   qualilyPoint(p, layer) {
     let regionSize = this.layers[layer].regionSize;

     let rData = {
       rX: p.x > regionSize ? Math.floor(Math.abs(p.x / regionSize)):0,
       rY: p.y > regionSize ? Math.floor(Math.abs(p.y / regionSize)):0,
       rLabel: ""
     };
     rData.rLabel = rData.rX + "_"+ rData.rY;

     return rData;
   }


  /*
   *  Create a new region
   */
  createRegion(layer, label, rData) {
    let layerObj = this.layers[layer];

    // Pre-calculate region offset
    let rOffsetX = rData.rX * layerObj.regionSize;
    let rOffsetY = rData.rY * layerObj.regionSize;

    layerObj.regions[label] = {
      color: "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}),
      particles: {},
      beginsAtX: rOffsetX,
      beginsAtY: rOffsetY,
      endsAtX: rOffsetX + layerObj.regionSize,
      endsAtY: rOffsetY + layerObj.regionSize
    };
  }

  /*
   *  Helper: Compares two region array structures, returns true when equal
   */
  regionsCompare(layer, reg1, reg2) {

    if (!reg2.hasOwnProperty(layer)) {
      return false;
    }

    if(Object.keys(reg1[layer].regions).length !== reg2[layer].length) {
      return false;
    }

    for (let region in reg1[layer].regions) {

      if (!reg2[layer].indexOf(region) === -1) {
        return false;
      }

      // for(let i = Object(reg1[label].regions).keys.length; i--;) {
      //     if(reg1[label].regions[i] !== reg2[label].regions[i]) {
      //       return false;
      //     }
      // }
    }




      return true;
  }
}
