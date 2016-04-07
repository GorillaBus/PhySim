var Vector = {
    _x: 1,
    _y: 0,

    create: function(x, y) {
        var vector = Object.create(Vector);
        vector.setX(x);
        vector.setY(y);
        return vector;
    },

    setX: function(value) {
        this._x = value;
    },

    getX: function(value) {
        return this._x;
    },    

    setY: function(value) {
        this._y = value;
    },

    getY: function(value) {
        return this._y;
    },

    setAngle: function(angle) {
        var length = this.getLength();
        this._x = Math.cos(angle);
        this._y = Math.sin(angle);
    },

    getAngle: function() {
        return Math.atan2(this._y, this._x);
    },

    setLength: function(length) {
        var angle = this.getAngle();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    },

    getLength: function() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    },

    add: function(vector) {
        return Vector.create(this._x + vector.getX(), this._y + vector.getY());
    },

    substract: function(vector) {
        return Vector.create(this._x - vector.getX(), this._y - vector.getY()); 
    },

    multiply: function(value) {
        return Vector.create(this._x * value, this._y * value); 
    },

    divide: function(value) {
        return Vector.create(this._x / value, this._y / value); 
    },

    addTo: function(vector) {
        this._x += vector.getX();
        this._y += vector.getY();
    },

    substractFrom: function(vector) {
        this._x -= vector.getX();
        this._y -= vector.getY();
    },

    multiplyBy: function(value) {
        this._x *= value;
        this._y *= value;
    },

    divideBy: function(value) {
        this._x /= value;
        this._y /= value;
    }
};

module.exports = Vector;
