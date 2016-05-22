var assert = require('chai').assert;

var Utils = require('../src/lib/Utils');

suite('Utilities', function() {

    var sut,
        c0,
        c1,
        resultOK;

    setup(function() {
        sut = Object.create(Utils);
        round = function (num) {
            return Math.round(num*100)/100;
        }
        c0 = {
            x: 53,
            y: 38,
            radius: 35
        };
        c1 = {
            x: 123.685 + 53,
            y: 40.323 + 38,
            radius: 50
        };
        resultOK = round(130.0919811287383);
    });

    suite('General', function() {

        test('must be a JavaScript Object', function() {
            assert.isObject(sut);
        });
    });

    suite("Maths", function() {

        test('must get the right distance from p0 to p1', function() {
            var hypo = round(sut.distance(c0, c1));
            assert.equal(hypo, resultOK);
        });

        test('must get the right distance from p0 to p1 (using raw values)', function() {
            var hypo = round(sut.distanceXY(c0.x, c0.y, c1.x, c1.y));
            assert.equal(hypo, resultOK);
        });

        test('must return true||false if value is in range of min & max or not', function() {
            var valueInRange = 7.072;
            var valueNotInRange = 7.173;
            var min = 6.99;
            var max = 7.172;
            var resultOK = Utils.inRange(valueInRange, min, max);
            var resultNotOk = Utils.inRange(valueNotInRange, min, max);

            assert.isTrue(resultOK);
            assert.isFalse(resultNotOk);
        });

        test('must return true||false whether the given ranges intersect each other', function() {
            var rangeA = {
                start: 100,
                end: 200
            };
            var rangeB = {
                start: 150,
                end: 250
            };
            var rangeC = {
                start: 350,
                end: 450
            };
            
            var hit = Utils.rangeIntersect(rangeA.start, rangeA.end, rangeB.start, rangeB.end);
            var miss = Utils.rangeIntersect(rangeA.start, rangeA.end, rangeC.start, rangeC.end);

            assert.isTrue(hit);
            assert.isFalse(miss);
        });
    });

    suite("Circle collision", function() {

        test('must return true||false if c0 to c1 distance is shorter than their radius together', function() {
            var collision = Utils.circleCollision(c0, c1);
            assert.isFalse(collision);

            var collisionC1 = {
                x: 100,
                y: 40,
                radius: c1.radius
            };

            var collision2 = Utils.circleCollision(c0, collisionC1);
            assert.isTrue(collision2);
        });

        test("must return true||false if p0 to c1 distance is shorter than c1 radius", function() {
            var p0 = {
                x: 180,
                y: 79
            };

            var collision = Utils.circlePointCollision(p0.x, p0.y, c1);
            assert.isTrue(collision);

            p0.x = 1;
            p0.y = 1;
            var collision2 = Utils.circlePointCollision(p0.x, p0.y, c1);
            assert.isFalse(collision2);
        });
    });

    suite("Rectangle collision", function() {

        test("must return true||false if p0 is overlaps rectangle or not", function() {
            var rect = {
                x: 100,
                y: 100,
                width: 100,
                height: 100
            };
            var collisionPoint = {
                x: 150,
                y: 150
            };
            var point = {
                x: 99.99,
                y: 99.99
            };
            var hit = Utils.rectanglePointCollision(collisionPoint.x, collisionPoint.y, rect);
            var miss = Utils.rectanglePointCollision(point.x, point.y, rect);

            assert.isTrue(hit);
            assert.isFalse(miss);
        });

        test("must return true||false when both rectangles overlap each other", function() {
            var rectA = {
                x: 100,
                y: 120,
                width: 80,
                height: 80
            };
            var rectB = {
                x: 80,
                y: 90,
                width: 80,
                height: 80
            };
            var rectC = {
                x: 350,
                y: 350,
                width: 10,
                height: 30
            };
            var overlap = Utils.rectangleCollision(rectA, rectB);
            var noOverlap = Utils.rectangleCollision(rectA, rectC);
            
            assert.isTrue(overlap);
            assert.isFalse(noOverlap);
        });
    });

});