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
    return Math.atan2(this._y, this._x);
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

  limit(n) {
    if (this.getLength() > n) {
      this.setLength(n);
    }
  }
};
