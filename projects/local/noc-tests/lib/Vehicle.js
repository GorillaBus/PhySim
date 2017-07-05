import Mover from '../../../../src/lib/Mover';
import Vector from '../../../../src/lib/Vector';
import Utils from '../../../../src/lib/Utils';

export default class Vehicle extends Mover {

  constructor(x, y, mass, angle, size, speed, force) {
    super(x, y, mass, angle, 0, speed);

    this.radius = size || 3;
    this.maxSpeed = speed || 4;
    this.maxSteeringForce = force || 2;
    this.elapsedTime = 0;
    this.wanderRandomPoint = null;
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
    let d = desired.getLength();

    desired.normalize();

    if (d < 100) {
      let m = Utils.mapRange(d, 0, 100, 0, this.maxSpeed);
      desired.multiplyBy(m);
    } else {
      desired.multiplyBy(this.maxSpeed);
    }

    let steer = desired.substract(this.velocity);
    steer.limit(this.maxSteeringForce);

    this.applyForce(steer);
  }

  flee(target) {
    // Calculate desired velocity
    let desired = target.substract(this.location);
    desired.normalize();
    desired.multiplyBy(this.maxSpeed);
    desired.multiplyBy(-1);

    let steer = desired.substract(this.velocity);
    steer.limit(this.maxSteeringForce);

    this.applyForce(steer);
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

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(0,0);
    ctx.lineTo(0, -this.radius*2);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
};
