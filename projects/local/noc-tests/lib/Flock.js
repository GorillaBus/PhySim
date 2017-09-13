export default class Flock {
  constructor(settings) {
    this.settings = settings || {};
    this.settings = {
      separation: settings.separation || 50,
      alignDist: settings.alignDist || 150,
      cohesion: settings.cohesion || 50
    };
    this.boids = [];
    this.flow = settings.flow || null;
  }

  run(field) {
    for (let i=0,total=this.boids.length;i<total;i++) {
      let boid = this.boids[i];

      boid.update();
      boid.borders();

      boid.flock(this.boids, this.settings);

      if (this.flow) {
        boid.flow(this.flow);
      }

      boid.draw();
    }
  }

  addBoid(boid) {
    this.boids.push(boid);
  }
}
