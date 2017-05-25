import Utils from '../../../src/lib/Utils';
import Layer from './MapperLayer';

export default class Mapper {

  constructor() {
    this.layers = [];
    this.layerIndex = {};
  }

  /*
   *  Creates a new Layer in the Mapper
   */
  addLayer(id, regionSize, interactionFn) {
    let layer = new Layer({
      id: id,
      regionSize: regionSize,
      interactionFn: interactionFn
    });

    this.layers.push(layer);
    this.layerIndex[id] = layer;

    return this.layerIndex[id];
  }

  /*
   *  Registers a particle in all the qualified regions of each Mapper Layer
   */
  register(p) {
    let mapperData = [];
    let totalLayers = this.layers.length;
    let points = Utils.getCirclePoints(p);
    let totalPoints = points.length;

    for (let x=0; x<totalLayers; x++) {
      let layer = this.layers[x];
      let qualifiedRegions = [];

      this.unregister(p);

      for (let i=0; i<totalPoints; i++) {
        let regionData = this.qualifyPoint(points[i], layer.id);
        let totalQualified = qualifiedRegions.length;
        let exists = false;

        for (let z=0; z<totalQualified; z++) {
          if (qualifiedRegions[z].id === regionData.id) {
            exists = true;
            continue;
          }
        }

        if (!exists) {
          if (!layer.regionIndex.hasOwnProperty(regionData.id)) {
            layer.addRegion(regionData)
          }

          let region = layer.regionIndex[regionData.id];
          region.subscribe(p);
          qualifiedRegions.push(region);
        }
      }

      mapperData.push({
        id: layer.id,
        regions: qualifiedRegions
      });
    }

    p.mapperData = mapperData;
  }

  /*
   *  Unsubscribe particle from every Layer/Region and reset particle's mapper data
   */
  unregister(p) {
    let totalLayers = p.mapperData.length;
    for (let i=0; i<totalLayers; i++) {
      let layerID = p.mapperData[i].id;
      let totalRegions = p.mapperData[i].regions.length;
      for (let r=0; r<totalRegions; r++) {
        p.mapperData[i].regions[r].unsubscribe(p);
      }
    }

    this.reset(p);
  }

  /*
   *  Deletes all mapepr data from Particle
   */
  reset(p) {
    p.mapperData = [];
  }

  /*
   *  Qualifies a single point into a Layer Region
   */
  qualifyPoint(pt, layerId) {
    let regionSize = this.layerIndex[layerId].regionSize;
    let xComponent = pt.x > regionSize ? Math.floor(Math.abs(pt.x / regionSize)):0;
    let yComponent = pt.y > regionSize ? Math.floor(Math.abs(pt.y / regionSize)):0;
    let data = {
      id: null,
      x: xComponent * regionSize,
      y: yComponent * regionSize
    };
    data.id = xComponent + "_"+ yComponent;
    return data;
  }
}
