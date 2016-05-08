var assert = require('chai').assert;

var Utils = require('../src/lib/Utils');

suite('Utilities', function() {

    var sut;

    setup(function() {
        sut = Object.create(Utils);
        round = function (num) {
            return Math.round(num*100)/100;
        }
    });

    suite('General', function() {

        test('must be a JavaScript Object', function() {
            assert.isObject(sut);
        });
    });

    suite("Maths", function() {

        test('must get the right distance from p0 to p1', function() {
            var catA = 123.685 + 53;
            var catB = 40.323 + 38;
            var result = round(130.0919811287383);
            var p0 = {
                x: 53,
                y: 38
            };
            var p1 = {
                x: catA,
                y: catB
            };
            var hypo = round(sut.distance(p0, p1));
            assert.equal(hypo, result);
        });

        test('must get the right distance from p0 to p1 (using raw values)', function() {
            var catA = 123.685 + 53;
            var catB = 40.323 + 38;
            var result = round(130.0919811287383);
            var p0 = {
                x: 53,
                y: 38
            };
            var p1 = {
                x: catA,
                y: catB
            };
            var hypo = round(sut.distanceXY(p0.x, p1.x, p0.y, p1.y));
            assert.equal(hypo, result);
        });

    });

});