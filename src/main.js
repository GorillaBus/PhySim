Vector = require('./lib/vector');

var v1 = Vector.create(10, 5),
    v2 = Vector.create(3, 4);

    // SUM vectors
    var v3 = v1.add(v2);


    console.log("v1 + v2 = { x: ", v3.getX(),", y: ", v3.getY(), "}");
 