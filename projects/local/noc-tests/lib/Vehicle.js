import Mover from '../../../../src/lib/Mover';
import Vector from '../../../../src/lib/Vector';
import Utils from '../../../../src/lib/Utils';

export default class Vehicle extends Mover {

  constructor(x, y, mass, angle, size, speed, maxSpeed, maxForce, mouse) {
    super(x, y, mass, angle, 0, speed);

    this.id = Utils.uniqueID();
    this.radius = size || 3;
    this.maxSpeed = maxSpeed || 3.2;
    this.maxSteeringForce = maxForce || 0.1;
    this.elapsedTime = 0;
    this.wanderRandomPoint = null;

    this.mouse = mouse;
  }

  applyBehaviors(vehicles, path, ctx, debug) {
    debug = debug || false;

    let separate = this.separate(vehicles) || new Vector();
    let seek = this.seek(new Vector({ x: this.mouse.x, y: this.mouse.y }));

    separate.multiplyBy(9.5);
    seek.multiplyBy(0.5);

    this.applyForce(separate);
    this.applyForce(seek);
  }

  run(ctx) {
    this.update();
    this.draw(ctx);
  }

  stayWithinWalls(d) {
    d = d || 100;

    const width = window.innerWidth;
    const height = window.innerHeight-4;

    if (this.location.getX() <= d) {
      let desired = new Vector({ x: this.maxSpeed, y: this.velocity.y });
      let steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);
      this.applyForce(steer);
    }

    if (this.location.getX() >= (width - d)) {
      let desired = new Vector({ x: -this.maxSpeed, y: this.velocity.y });
      let steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);
      this.applyForce(steer);
    }

    if (this.location.getY() <= d) {
      let desired = new Vector({ x: this.velocity.x, y: this.maxSpeed });
      let steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);
      this.applyForce(steer);
    }

    if (this.location.getY() > (height - d)) {
      let desired = new Vector({ x: this.velocity.x, y: -this.maxSpeed });
      let steer = desired.substract(this.velocity);
      steer.limit(this.maxSteeringForce);
      this.applyForce(steer);
    }
  }

  separate(vehicles, desiredDistance) {
    desiredDistance = desiredDistance || this.radius*2;

    let total = vehicles.length;
    let sum = new Vector();
    let count = 0;

    for (let i=0; i<total; i++) {
      let v = vehicles[i];
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
  }

  followPath(path, ctx, debug) {
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

      // Check if the vehicle is inside this path
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


    // Check if vehicle is within the path radius and seek
    if (worldRecord > path.radius/2) {
      return this.seek(target);
    }

    if (debug) {
      ctx.beginPath();
      ctx.moveTo(this.location.getX(), this.location.getY());
      ctx.lineTo(predict.getX(), predict.getY());
      ctx.lineTo(normalPoint.getX(), normalPoint.getY());
      ctx.lineTo(target.getX(), target.getY());
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle="blue";
      ctx.beginPath();
      ctx.arc(predict.getX(), predict.getY(), 3, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle="green";
      ctx.beginPath();
      ctx.arc(normalPoint.getX(), normalPoint.getY(), 3, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle="red";
      ctx.beginPath();
      ctx.arc(target.getX(), target.getY(), 3, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();
    }
  }

  followPathC(path, ctx) {

    // Predict next location
    let predict = this.velocity.copy();
    predict.normalize();
    predict.multiplyBy(25)
    predict.addTo(this.location);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(predict.getX(), predict.getY(), 2, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    // Find the normal point
    let normalPoint = Utils.getNormalPoint(predict, path.points[0], path.points[1]);

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(normalPoint.getX(), normalPoint.getY(), 2, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    // Set a target at "normal point + n" points
    let target = path.points[1].substract(path.points[0]);
    target.normalize();
    target.multiplyBy(10);
    target.addTo(normalPoint);

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(target.getX(), target.getY(), 2, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();

    // Seek the target if we are away from path
    let diff = target.substract(predict);
    let distance = diff.getLength();

    if (distance > this.radius) {
      this.seek(target);
    }

  }

  followPathB(path, ctx) {
    // Predict future position
    let predict = this.velocity.copy();
    predict.normalize();
    predict.multiplyBy(50);
    predict.addTo(this.location);

    let target;
    let distance;

    // Find normal point to each path's segment
    let largerDist = 1000000;
    for (let i=0; i<path.totalPoints-1; i++) {
      let a = path.points[i].copy();
      let b = path.points[i+1].copy();
      let normalPoint = Utils.getNormalPoint(predict, a, b);

      if (normalPoint.getX() < Math.min(a.getX(), b.getX()) || normalPoint.getX() > Math.max(a.getX(), b.getX())) {
        normalPoint = b.copy();
      }

      distance = predict.dist(normalPoint);

      if (distance < largerDist) {
        largerDist = distance;
        target = normalPoint;
      }
    }


    // If away from path, seek target
    if (distance > this.radius*2) {
      this.seek(target);

      // Debug: draws the target as a red point
      // ctx.fillStyle="red";
      // ctx.beginPath();
      // ctx.arc(target.getX(), target.getY(), 3, 0, Math.PI*2, true);
      // ctx.fill();
      // ctx.closePath();
    }
  }

  follow(field, z) {
    if (!field.isReady) {
      console.warn("Vehicle :: follow: FollowField is not ready");
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
      ctx.beginPath();
      ctx.fillStyle = "rgba(192, 11, 67, 0.3);"
      ctx.arc(nextPosition.getX(), nextPosition.getY(), wanderRadius, 0, Math.PI * 2, true);
      ctx.stroke();
      ctx.closePath();

      // Draw point
      ctx.beginPath();
      ctx.fillStyle = "rgba(192, 11, 67, 1);"
      ctx.fillRect(target.getX(), target.getY(), 4, 4);
      ctx.fill();
      ctx.closePath();
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
    //let d = desired.getLength();
    //let maxSpeed = d < slowDownDist ? Utils.mapRange(d, 0, slowDownDist, 0, this.maxSpeed):null;

    return this.steer(desired);
  }

  steer(desired) {
    let steer;
    desired.normalize();
    desired.multiplyBy(this.maxSpeed);
    steer = desired.substract(this.velocity);
    steer.limit(this.maxSteeringForce);
    return steer;
  }

  flee(target) {
    // Calculate desired velocity
    let desired = target.substract(this.location);
    desired.normalize();
    desired.multiplyBy(-1);
    this.steer(desired);
  }

  nextPosition(length) {
    let v = this.velocity.copy();
    if (length) {
      v.setLength(length);
    }
    return this.location.add(v);
  }

  draw(ctx) {
    let theta = this.velocity.getAngle() + Math.PI/2;

    ctx.save();
    ctx.translate(this.location.getX(), this.location.getY());
    ctx.rotate(theta);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.beginPath();
    ctx.lineTo(0, -this.radius*2);
    ctx.lineTo(-this.radius, this.radius*2);
    ctx.lineTo(this.radius, this.radius*2);
    ctx.fill();
    ctx.closePath();

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.moveTo(0,0);
    // ctx.lineTo(0, -this.radius*2);
    // ctx.stroke();
    // ctx.closePath();

    ctx.restore();
  }
};
