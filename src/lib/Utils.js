var Utils = {
    distance: function(p0, p1) {
        var dx = p0.x - p1.x;
        var dy = p0.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    distanceXY(x0, x1, y0, y1) {
        var dx = x0 - x1;
        var dy = y0 - y1;
        return Math.sqrt(dx * dx + dy * dy); 
    }
};

module.exports = Utils;