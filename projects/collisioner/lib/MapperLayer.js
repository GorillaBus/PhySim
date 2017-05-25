import Region from './MapperRegion';
import Utils from '../../../src/lib/Utils';

export default class MapperLayer {

  constructor(settings) {
    this.id = settings.id;
    this.regionSize = settings.regionSize;
    this.regions = [];
    this.regionIndex = {};
    this.interaction = settings.interactionFn;
    this.color = Utils.randomColor();
  }

  /*
   *  Creates a new Region in the Mapper
   */
  addRegion(regionData) {
    let region = new Region({
      id: regionData.id,
      x: regionData.x,
      y: regionData.y,
      size: this.regionSize,
      layer: this
    });

    this.regions.push(region);
    this.regionIndex[regionData.id] = region;
  }

  /*
   *  Iterates all Layer Regions and fires it's interaction function
   */
  iterate() {
    let totalRegions = this.regions.length;
    for (let x=0; x<totalRegions; x++) {
      this.regions[x].interact();
    }
  }
}
