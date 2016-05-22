'use strict';

var Utils = {

    distance: function(p0, p1) {
        var dx = p0.x - p1.x;
        var dy = p0.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY: function(x0, y0, x1, y1) {
        var dx = x1 - x0;
        var dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy); 
    },

    inRange: function(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    rangeIntersect: function(min0, max0, min1, max1) {
        return  Math.max(min0, max0) >= Math.min(min1, max1) &&
                Math.min(min0, max0) <= Math.max(min1, max1);
    },

    randomRange: function(min, max) {
        return min + Math.random() * (max - min);
    },

    circleCollision: function(c0, c1) {
        return Utils.distance(c0, c1) <= c0.radius + c1.radius;
    },

    rectangleCollision: function(r0, r1) {
        return  Utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
                Utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    },

    circlePointCollision: function(px, py, circle) {
        return Utils.distanceXY(px, py, circle.x, circle.y) < circle.radius;
    },

    rectanglePointCollision: function(px, py, rect) {
        return  Utils.inRange(px, rect.x, rect.x + rect.width) &&
                Utils.inRange(py, rect.y, rect.y + rect.height);
    },
};

module.exports = Utils;