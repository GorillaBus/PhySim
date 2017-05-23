export default class MapperRegion {

  constructor(settings) {
    this.id = settings.id;
    this.x = settings.x;
    this.y = settings.y;
    this.size = settings.size;
    this.layer = settings.layer;
    this.particles = [];
    this.totalParticles = 0;
    this.particleIndex = {};
  }

  subscribe(p) {
    this.particles.push(p.id);
    this.particleIndex[p.id] = p;
    this.totalParticles++;
  }

  unsubscribe(p) {
    delete this.particleIndex[p.id];
    let index = this.particles.indexOf(p.id);
    this.particles.splice(index, 1);
    this.totalParticles--;
  }

  iterate() {
    for (let i=0; i<this.totalParticles; i++) {
      let A = this.particleIndex[this.particles[i]];
      for (let y=0; y<this.totalParticles; y++) {
        let B = this.particleIndex[this.particles[y]];
        if (A.id !== B.id) {
          this.layer.interaction(A, B);
        }
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = this.layer.color;
    ctx.rect(this.x, this.y, this.layer.regionSize, this.layer.regionSize);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}
