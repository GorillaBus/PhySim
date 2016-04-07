var sinon = require('sinon'),
    assert = require('chai').assert;

var Vector = require('../src/lib/vector');

suite('Vector', function() {

    var sut, 
    hasProps, 
    vectorA, 
    vectorB, 
    vectorC;

    setup(function() {
        sut = Vector;
        expectedMethods = [
            'create', 
            'getX',
            'getY',
            'setX',
            'setY',
            'setAngle',
            'getAngle',
            'setLength',
            'getLength',
            'add',
            'substract',
            'multiply',
            'divide',
            'addTo',
            'substractFrom',
            'multiplyBy',
            'divideBy'
        ];

        hasExpectedMethods = function(obj) {
            for (var i=0;i<expectedMethods.length;i++) {
                assert.property(obj, expectedMethods[i]);
            }
        };


    });


    suite('JavaScript test:', function() {

        test('SUT must be a JavaScript Object', function() {
            console.log(Vector); return;
            assert.isObject(sut);
        });

        test('must return vector objects with all expected methods', function() {
            vectorA = Vector.create(10, 10);
            vectorB = Vector.create(3, 4);
            hasExpectedMethods(vectorA);
            hasExpectedMethods(vectorB);
        });

        test('must set and get the same X,Y values', function() {
            vectorA.setX(123);
            vectorA.setY(321);
            assert.equal(vectorA.getX(), 123);
            assert.equal(vectorA.getY(), 321);            
        })

        test('must set and get same angle value', function() {
            vectorA.setAngle(0.9);
            assert.equal(vectorA.getAngle(), 0.9);
        });

        test('must set and get same length value', function() {
            vectorA.setLength(34.5712);
            assert.equal(vectorA.getLength(), 34.5712);
        });

        test('must SUM vectors A and B and get a new vector C with added values', function() {
            vectorC = vectorA.add(vectorB);
            assert.isObject(vectorC);
            hasExpectedMethods(vectorC);
            assert.equal(vectorC.getX(), vectorA.getX() + vectorB.getX());
            assert.equal(vectorC.getY(), vectorA.getY() + vectorB.getY());
        });        

        test('must SUBSTRACT vectors B from A and get a new vector C with substracted values', function() {
            vectorC = vectorA.substract(vectorB);
            assert.isObject(vectorC);
            hasExpectedMethods(vectorC);
            assert.equal(vectorC.getX(), vectorA.getX() - vectorB.getX());
            assert.equal(vectorC.getY(), vectorA.getY() - vectorB.getY());
        });

        test('must MULTIPLY vector A with 9 and get a new vector C with multiplied values', function() {
            vectorC = vectorA.multiply(9);
            assert.isObject(vectorC);
            hasExpectedMethods(vectorC);
            assert.equal(vectorC.getX(), vectorA.getX() * 9);
            assert.equal(vectorC.getY(), vectorA.getY() * 9);
        });

        test('must DIVIDE vector A with 9 and get a new vector C with divided values', function() {
            vectorC = vectorA.divide(9);
            assert.isObject(vectorC);
            hasExpectedMethods(vectorC);
            assert.equal(vectorC.getX(), vectorA.getX() / 9);
            assert.equal(vectorC.getY(), vectorA.getY() / 9);
        });

        test('must MULTIPLY vector A\'s values and get correct values', function() {
            var origX = vectorA.getX();
            var origY = vectorA.getY();
            var factor = 9.2;

            vectorA.divideBy(factor);
            assert.equal(vectorA.getX(), origX / factor);
            assert.equal(vectorA.getY(), origY / factor);
        });

        test('must DIVIDE vector A\'s values and get correct values', function() {
            var origX = vectorA.getX();
            var origY = vectorA.getY();
            var factor = 2.31;

            vectorA.multiplyBy(factor);
            assert.equal(vectorA.getX(), origX * factor);
            assert.equal(vectorA.getY(), origY * factor);
        });

    });
});
