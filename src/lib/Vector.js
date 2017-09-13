import FEATURE_TOGGLE from '../../src/feature-toggle';

export default class Vector {

  constructor(settings) {
    settings = settings || {};
    settings.x = settings.x || 0;
    settings.y = settings.y || 0;
    settings.length = settings.length || 0;
    settings.angle = settings.angle || 0;

    this._x = settings.x;
    this._y = settings.y;

    if (settings.length) {
      this.setLength(settings.length);
    }
    if (settings.angle) {
      this.setAngle(settings.angle);
    }
  }

  setX(value) {
    this._x = value;
  }

  getX(value) {
    return this._x;
  }

  setY(value) {
    this._y = value;
  }

  getY(value) {
    return this._y;
  }

  setAngle(angle) {
    let length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getAngle() {
    return Math.atan2(this.getY(), this.getX());
  }

  setLength(length) {
    let angle = this.getAngle();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getLength() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  add(vector) {
    return new Vector({ x: this._x + vector.getX(), y: this._y + vector.getY() });
  }

  substract(vector) {
    return new Vector({ x: this._x - vector.getX(), y: this._y - vector.getY() });
  }

  multiply(value) {
    return new Vector({ x: this._x * value, y: this._y * value });
  }

  divide(value) {
    return new Vector({ x: this._x / value, y: this._y / value });
  }

  addTo(vector) {
    this._x += vector.getX();
    this._y += vector.getY();
  }

  substractFrom(vector) {
    this._x -= vector.getX();
    this._y -= vector.getY();
  }

  multiplyBy(value) {
    this._x *= value;
    this._y *= value;
  }

  divideBy(value) {
    this._x /= value;
    this._y /= value;
  }

  dot(v) {
    return this._x*v._x + this._y*v._y;
  }

  cross(v) {
    return (this._x*v._y) - (this._y*v._x);
  }

  angleBetween(v) {
    //return Math.acos( (v1.x * v2.x + v1.y * v2.y) / ( Math.sqrt(v1.x*v1.x + v1.y*v1.y) * Math.sqrt(v2.x*v2.x + v2.y*v2.y) ) )
    let v1 = this.copy();
    let v2 = v.copy();
    v1.normalize();
    v2.normalize();
    let dot = v1.dot(v2);
    let theta = Math.acos(dot);

    if (isNaN(theta)) {
      console.warn("Theta is 'NaN' on Vector.angleBetween()")
    }

    return theta;
  }

  angleDirection(v) {
    let crossProduct = this.cross(v);
    if (crossProduct > 0.0) {
      return 1;
    } else if (crossProduct < 0.0) {
      return -1;
    } else {
      return 0;
    }
  }

  angleDifference(v) {
    let theta = this.angleBetween(v);
    let dir = this.angleDirection(v);
    return theta * dir;
  }

  copy() {
    return new Vector({
      x: this.getX(),
      y: this.getY()
    });
  }

  normalize() {
    var length = this.getLength();
    if (length != 0) {
      this.divideBy(length);
    }
  }

  dist(p) {
    let d = p.substract(this);
    return d.getLength();
  }

  limit(n) {
    if (this.getLength() > n) {
      this.setLength(n);
    }
  }
};
