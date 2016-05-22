'use strict'

var Vector = {
    _x: 0,
    _y: 0,

    create: function(vectorSettings) {
        if (typeof vectorSettings !== 'object' || !vectorSettings.hasOwnProperty('x') || !vectorSettings.hasOwnProperty('y')) {
            console.warn("Warning: vector.create called with no or invalid parameters, using defaults!");
        }

        vectorSettings = arguments[0] || {};
        vectorSettings = {
            x: vectorSettings.x || 0,
            y: vectorSettings.y || 0,
            length: vectorSettings.length || 0,
            angle: vectorSettings.angle || 0
        };

        var vector = Object.create(Vector);
        vector.setX(vectorSettings.x);
        vector.setY(vectorSettings.y);
        if (vectorSettings.length !== 0) {
            vector.setLength(vectorSettings.length);
        }
        if (vectorSettings.angle !== 0) {
            vector.setAngle(vectorSettings.angle);
        }

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
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
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
        return Vector.create({ x: this._x + vector.getX(), y: this._y + vector.getY() });
    },

    substract: function(vector) {
        return Vector.create({ x: this._x - vector.getX(), y: this._y - vector.getY() }); 
    },

    multiply: function(value) {
        return Vector.create({ x: this._x * value, y: this._y * value }); 
    },

    divide: function(value) {
        return Vector.create({ x: this._x / value, y: this._y / value }); 
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
