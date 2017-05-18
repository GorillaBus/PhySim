export default class Liquid {
  constructor(x, y, width, height, dragCoefficient) {
    this._x = x;
    this._y = y;
    this._w = width;
    this._h = height;
    this._c = dragCoefficient;
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
  }

  getW() {
    return this._w;
  }

  getH() {
    return this._h;
  }

  getC() {
    return this._c;
  }
}
