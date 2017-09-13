import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Perceptron from './Perceptron';

export default class Boid {

  constructor(settings) {
    settings = settings || {};
    settings = {
      x: settings.x || 0,
      y: settings.y || 0,
      angle: settings.angle || Math.PI,
      speed: settings.speed || 0,
      size: settings.size || 10,
      mass: settings.mass || 1,
      maxSpeed: settings.maxSpeed || 3.2,
      maxSteeringForce: settings.maxSteeringForce || 0.2,
      color: settings.color || "#000000",
      borders: settings.borders || { width: window.innerWidth, height: window.innerHeight },
      ctx: settings.ctx || null,
      brain: {
        n: settings.brain.n || 0,
        c: settings.brain.c || 0.01
      }
    };

    this.location = new Vector({ x: settings.x, y: settings.y });
    this.velocity = new Vector({ x: Math.cos(settings.angle) * settings.speed, y: Math.sin(settings.angle) * settings.speed });
    this.acceleration = new Vector({ x: 0, y: 0 });

    this.brain = new Perceptron(settings.brain.n, settings.brain.c);

    this.id = Utils.uniqueID();
    this.ctx = settings.ctx;
    this.radius = settings.size;
    this.mass = settings.mass;
    this.maxSpeed = settings.maxSpeed;
    this.maxSteeringForce = settings.maxSteeringForce;
    this.wanderRandomPoint = null;
    this.boxBorders = settings.borders;
  }

  update() {
    this.velocity.addTo(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.location.addTo(this.velocity);
    this.acceleration.multiplyBy(0);
  }

  applyForce(f) {
    this.acceleration.addTo(f);
  }

  flock(boids, settings) {
    settings = settings || {};
    settings = {
      separation: settings.separation || null,
      alignDist: settings.alignDist || null,
      cohesion: settings.cohesion || null
    };

    let sep = this.separate(boids, settings.separation);
    let ali = this.align(boids, settings.alignDist);
    let bon = this.cohesion(boids, settings.cohesion);

    // sep.multiplyBy(1);
    // ali.multiplyBy(1);
    // bon.multiplyBy(1);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(bon);
  }

  align(boids, sightDistance, peripherialAngle) {
    sightDistance = sightDistance  || 100;
    peripherialAngle = peripherialAngle || Math.PI/3;


    if (this.special) {
      let currentHeading = this.velocity.getAngle();
      this.ctx.save();
      this.ctx.translate(this.location.getX(), this.location.getY());
      this.ctx.rotate(currentHeading);
      this.ctx.fillStyle = "rgba(0,0,0,0.4)";
      this.ctx.strokeStyle = "rgba(0,0,0,0.8)";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, sightDistance*2, -peripherialAngle, peripherialAngle);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
    }


    let count = 0;
    let sum = new Vector();
    let total = boids.length;

    for (let i=0; i<total; i++) {
      let b = boids[i];
      if (b.id === this.id) {
        continue;
      }


      let vecDiff = b.location.substract(this.location);
      let dist = vecDiff.getLength();

      if (dist < sightDistance) {

        let angleBetween = Utils.getAngleBetween(vecDiff, this.velocity);

        if (angleBetween < peripherialAngle) {
          sum.addTo(b.velocity);
          count++;
        }

      }
    }

    if (count > 0) {
      sum.divideBy(count);
      return this.steer(sum);
    }

    return sum;
  }

  cohesion(boids, neighborDist) {
    neighborDist = neighborDist || 50;

    let count = 0;
    let sum = new Vector();
    let total = boids.length;

    for (let i=0; i<total; i++) {
      let b = boids[i];
      if (b.id === this.id) {
        continue;
      }
      let d = this.location.dist(b.location);
      if (d <= neighborDist) {
        sum.addTo(b.location);
        count++;
      }
    }

    if (count > 0) {
      sum.divideBy(count);
      sum.normalize();
      sum.multiplyBy(this.maxSpeed);
      return this.steer(sum);
    }

    return sum;
  }

  separate(boids, desiredDistance) {
    desiredDistance = desiredDistance || this.radius*2;

    let total = boids.length;
    let sum = new Vector();
    let count = 0;

    for (let i=0; i<total; i++) {
      let v = boids[i];
      if (this.id === v.id) {
        continue;
      }

      let diff = this.location.substract(v.location);
      let distance = diff.getLength();
      if (distance < desiredDistance) {
        diff.normalize();
        diff.divideBy(distance);
        sum.addTo(diff);
        count++;
      }
    }

    if (count > 0) {
      sum.divideBy(count);
      return this.steer(sum);
    }

    return sum;
  }

  follow(path, debug) {
    debug = debug || false;

    let predict = this.velocity.copy();
    predict.normalize();
    predict.multiplyBy(25)
    predict.addTo(this.location);

    let worldRecord = 1000000;
    let normalPoint;
    let target;

    // Find the nearest segment
    for (let i=0; i<path.totalPoints-1; i++) {
      let a = path.points[i];
      let b = path.points[(i+1) % path.points.length];
      let n = Utils.getNormalPoint(predict, a, b);
      let dir = b.substract(a);

      // Check if the boid is inside this path
      if (
        n.getX() < Math.min(a.getX(), b.getX()) ||
        n.getX() > Math.max(a.getX(), b.getX()) ||
        n.getY() < Math.min(a.getY(), b.getY()) ||
        n.getY() > Math.max(a.getY(), b.getY())
      ) {
        n = b.copy();
        a = path.points[(i+1) % path.points.length];
        b = path.points[(i+2) % path.points.length];
        dir = b.substract(a);
      }

      let dist = predict.dist(n);
      if (dist <= worldRecord) {
        worldRecord = dist;
        normalPoint = n;

        dir.normalize();
        dir.multiplyBy(25);
        target = n.copy();
        target.addTo(dir);
      }
    }


    // Check if boid is within the path radius and seek
    if (worldRecord > path.radius/2) {
      return this.seek(target);
    }

    if (debug) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.location.getX(), this.location.getY());
      this.ctx.lineTo(predict.getX(), predict.getY());
      this.ctx.lineTo(normalPoint.getX(), normalPoint.getY());
      this.ctx.lineTo(target.getX(), target.getY());
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.fillStyle="blue";
      this.ctx.beginPath();
      this.ctx.arc(predict.getX(), predict.getY(), 3, 0, Math.PI*2, true);
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.fillStyle="green";
      this.ctx.beginPath();
      this.ctx.arc(normalPoint.getX(), normalPoint.getY(), 3, 0, Math.PI*2, true);
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.fillStyle="red";
      this.ctx.beginPath();
      this.ctx.arc(target.getX(), target.getY(), 3, 0, Math.PI*2, true);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  flow(field, z) {
    if (!field.isReady) {
      console.warn("Boid :: follow: FollowField is not ready");
      return;
    }
    z = z || false;
    let desired = field.lookup(this.location, z);
    desired.multiplyBy(this.maxSpeed);

    let steer = desired.substract(this.velocity);
    steer.limit(this.maxSteeringForce);

    this.applyForce(steer);
  }

  wander(wanderDist, wanderRadius, delta, ctx) {
    wanderRadius = wanderRadius || 50;
    wanderDist = wanderDist || 150;

    let interval = 500;
    let nextPosition = this.nextPosition(wanderDist);

    this.elapsedTime += delta;
    if (this.elapsedTime >= interval || this.wanderRandomPoint === null) {
      this.elapsedTime = 0;

      let angle = Math.random() * Math.PI * 2;
      let x = Math.cos(angle) * wanderRadius;
      let y = Math.sin(angle) * wanderRadius;
      this.wanderRandomPoint = new Vector({ x: x, y: y });
    }

    let target = nextPosition.add(this.wanderRandomPoint);

    // Draw circle
    if (ctx) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(192, 11, 67, 0.3);"
      this.ctx.arc(nextPosition.getX(), nextPosition.getY(), wanderRadius, 0, Math.PI * 2, true);
      this.ctx.stroke();
      this.ctx.closePath();

      // Draw point
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(192, 11, 67, 1);"
      this.ctx.fillRect(target.getX(), target.getY(), 4, 4);
      this.ctx.fill();
      this.ctx.closePath();
    }

    this.seek(target);
  }

  persuit(target) {
    let nextPosition = target.nextPosition();

    this.seek(nextPosition);
  }

  seek(target) {
    // Calculate desired velocity
    let desired = target.substract(this.location);
    return this.steer(desired);
  }

  steer(desired) {
    let steer = new Vector();
    desired.normalize();
    desired.multiplyBy(this.maxSpeed);
    steer = desired.substract(this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }

  go(targets, desired) {
    let forces = [];

    for (let i=0, total=targets.length; i<total; i++) {
      forces[i] = this.seek(targets[i].copy());
    }

    let result = this.brain.feedForward(forces);
    this.applyForce(result);

    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.arc(result.getX() + this.location.getX(), result.getY() + this.location.getY(), 5, 0, Math.PI*2, true);
    this.ctx.fill();
    this.ctx.fillStyle = "#000000";
    this.ctx.closePath();

    // Training
    let error = desired.substract(this.location);

    this.brain.train(forces, error)
  }

  flee(target) {
    // Calculate desired velocity
    let desired = target.substract(this.location);
    desired.normalize();
    desired.multiplyBy(-1);
    this.steer(desired);
  }

  borders() {
    if (this.location.getX() < -this.radius) {
      this.location.setX(this.boxBorders.width + this.radius);
    }
    if (this.location.getY() < -this.radius) {
      this.location.setY(this.boxBorders.height + this.radius);
    }
    if (this.location.getX() > this.boxBorders.width + this.radius) {
      this.location.setX(-this.radius);
    }
    if (this.location.getY() > this.boxBorders.height + this.radius) {
      this.location.setY(-this.radius);
    }
  }

  nextPosition(length) {
    let v = this.velocity.copy();
    if (length) {
      v.setLength(length);
    }
    return this.location.add(v);
  }

  draw() {
    let theta = this.velocity.getAngle() + Math.PI/2;

    this.ctx.save();
    this.ctx.translate(this.location.getX(), this.location.getY());
    this.ctx.rotate(theta);
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.lineTo(0, -this.radius*2);
    this.ctx.lineTo(-this.radius, this.radius*2);
    this.ctx.lineTo(this.radius, this.radius*2);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }
};
