var sinon = require('sinon');
var assert = require('chai').assert;

var Vector = require('../src/lib/Vector');

suite('Vector', function() {

    var sut,
    vector, 
    hasProps,
    warnSpy;

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

        vector = Object.create(Vector);
        sut = vector.create({ x: 10, y: 10 });
    });


    suite('Vector create:', function() {

        test('must call \'console.warn\' if it receives invalid arguments', function() {
            var spy = sinon.spy(console, 'warn');
            sut.create('nothing_valid');
            assert.isTrue(spy.calledOnce);
        });

        test('must return a vector with all expected function', function() {
            hasExpectedMethods(sut);
        });

    });

    suite('Set / Get:', function() {    

        test('must set and get the same X,Y values', function() {
            sut.setX(123);
            sut.setY(321);
            assert.equal(sut.getX(), 123);
            assert.equal(sut.getY(), 321);            
        })

        test('must set and get same angle value', function() {
            sut.setAngle(0.9);
            assert.equal(sut.getAngle(), 0.9);
        });

        test('must set and get same length value', function() {
            sut.setLength(34.5712);
            assert.equal(sut.getLength(), 34.5712);
        });

    });

    suite('Aritmetic', function() { 

        test('must SUM two vectors and get a new one with added values', function() {
            var vectorA = vector.create({ x: 3, y: -5 });
            var vectorB = sut.add(vectorA);
            assert.isObject(vectorB);
            hasExpectedMethods(vectorB);
            assert.equal(vectorB.getX(), vectorA.getX() + sut.getX());
            assert.equal(vectorB.getY(), vectorA.getY() + sut.getY());
        });        

        test('must SUBSTRACT vectors B from A and get a new vector C with substracted values', function() {
            var vectorA = vector.create({ x: 3, y: -5 });
            var vectorB = sut.substract(vectorA);
            assert.isObject(vectorB);
            hasExpectedMethods(vectorB);
            assert.equal(vectorB.getX(), sut.getX() - vectorA.getX());
            assert.equal(vectorB.getY(), sut.getY() - vectorA.getY());
        });

        test('must MULTIPLY vector with 9 and get a new vector with multiplied values', function() {
            vectorB = sut.multiply(9);
            assert.isObject(vectorB);
            hasExpectedMethods(vectorB);
            assert.equal(vectorB.getX(), sut.getX() * 9);
            assert.equal(vectorB.getY(), sut.getY() * 9);
        });

        test('must DIVIDE vector A with 9 and get a new vector C with divided values', function() {
            vectorB = sut.divide(9);
            assert.isObject(vectorB);
            hasExpectedMethods(vectorB);
            assert.equal(vectorB.getX(), sut.getX() / 9);
            assert.equal(vectorB.getY(), sut.getY() / 9);
        });

        test('must MULTIPLY vector values and get exact new values', function() {
            var origX = sut.getX();
            var origY = sut.getY();
            var factor = 9.2;

            sut.divideBy(factor);
            assert.equal(sut.getX(), origX / factor);
            assert.equal(sut.getY(), origY / factor);
        });

        test('must DIVIDE vector A\'s values and get correct values', function() {
            var origX = sut.getX();
            var origY = sut.getY();
            var factor = 2.31;

            sut.multiplyBy(factor);
            assert.equal(sut.getX(), origX * factor);
            assert.equal(sut.getY(), origY * factor);
        });

    });
});
