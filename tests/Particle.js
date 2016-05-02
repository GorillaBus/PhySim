var sinon = require('sinon');
var assert = require('chai').assert;

var Vector = require('../src/lib/Vector');
var Particle = require('../src/lib/Particle');

suite('Particle', function() {

    var sut,
    expectedProperties,
    round;

    setup(function() {
        sut = Object.create(Particle);
        round = function (num) {
            return Math.round(num*100)/100;
        }
    });

    suite('General', function() {

        test('must be a JavaScript Object with \'create\' function', function() {
            assert.isObject(sut);
            assert.isFunction(sut.create)
        });

        test('must create a Particle with default settings when no argument passed', function() {
            var particle = sut.create();
            assert.isObject(particle);

            assert.property(particle, 'mass');
            assert.equal(particle.position.getX(), 0);
            assert.equal(particle.position.getY(), 0);
        });

        test('must create a Particle with given settings', function() {
            var particleSettings = {
                x: 200,
                y: 300,
                speed: 34.13,
                direction: 3.14,
                gravity: 0.1
            }
            var particle = sut.create(particleSettings);
            assert.isObject(particle);
            assert.equal(particle.position.getX(), particleSettings.x);
            assert.equal(particle.position.getY(), particleSettings.y);
            assert.equal(round(particle.velocity.getLength()), particleSettings.speed);
            assert.equal(round(particle.velocity.getAngle()), particleSettings.direction);    
        }); 

        test('new particle must have default functions', function() {
            var particle = sut.create();
            // General
            assert.isFunction(particle.accelerate);
            assert.isFunction(particle.update);
            assert.isFunction(particle.create);
            // Gravity
            assert.isFunction(particle.angleTo);
            assert.isFunction(particle.distanceTo);
            assert.isFunction(particle.gravitateTo);
        });

    });

    suite('Properties', function() {

        test('new particle must have default vectors and properties', function() {
            var particle = sut.create();
            assert.property(particle, 'position');
            assert.isObject(particle.position);
            assert.isNumber(particle.position.getY());
            assert.isNumber(particle.position.getX());
            assert.property(particle, 'velocity');
            assert.isObject(particle.velocity);            
            assert.isNumber(particle.velocity.getY());
            assert.isNumber(particle.velocity.getX());

            assert.property(particle, 'mass');
            assert.equal(particle.mass, 1);
        });

        test('must add to velocity vector on accelerate', function() {
            var particle = sut.create();
            var vector = Vector.create({
                x: 1,
                y: 1
            });
            assert.equal(particle.velocity.getX(), 0);
            particle.accelerate(vector);
            assert.equal(particle.velocity.getX(), 1);
            particle.accelerate(vector);
            assert.equal(particle.velocity.getX(), 2);           
        });

        test('must add position vector on update and call accelerate', function() {
            var particleSettings = {
                x: 200,
                y: 300,
                speed: 2,
                direction: 3.14
            };
            var particle = sut.create(particleSettings);
            particle.update();
            assert.equal(round(particle.position.getX()), 198);
            particle.update();
            assert.equal(round(particle.position.getX()), 196);
            particle.update();
            assert.equal(round(particle.position.getX()), 194);
        });
      
    });


    suite('Gravity', function() {

        test('must get the angle between two particles', function() {
            var _pa = {
                x: 15,
                y: 5
            };
            var _pb = {
                x: 10,
                y: 2
            };
            var angleA = Math.atan2(_pa.y, _pa.x);
            var angleB = Math.atan2(_pb.y, _pb.x);
            var angleAB = Math.atan2(_pb.y - _pa.y, _pb.x - _pa.x);
            var angleBA = Math.atan2(_pa.y - _pb.y, _pa.x - _pb.x);
            var pa = sut.create(_pa);
            var pb = sut.create(_pb);

            assert.equal(pa.angleTo(pb), angleAB);
            assert.equal(pb.angleTo(pa), angleBA);
        });

        test('must get the distance between two particles', function() {
            var _pa = {
                x: 15,
                y: 5
            };
            var _pb = {
                x: 10,
                y: 2
            };
            var dx = _pa.x - _pb.x;
            var dy = _pa.y - _pb.y;
            var hyp = Math.sqrt(dx * dx + dy * dy);
            var pa = sut.create(_pa);
            var pb = sut.create(_pb);
            
            assert.equal(pb.distanceTo(pa), hyp);
        });

        test('must sum gravity and position vectors on gravitateTo', function() {
            var _pa = {
                x: 15,
                y: 5,
                mass: 9
            };
            var _pb = {
                x: 10,
                y: 2,
                mass: 102
            };
            var oldPosition;
            var newPosition;
            // Distance
            var dx = _pa.x - _pb.x;
            var dy = _pa.y - _pb.y;
            var distanceAB = Math.sqrt(dx * dx + dy * dy);
            // Angle
            var angleA = Math.atan2(_pa.y, _pa.x);
            var angleB = Math.atan2(_pb.y, _pb.x);
            var angleAB = Math.atan2(_pa.y - _pb.y, _pa.x - _pb.x);
            // Gravity force: Mass of particle B / distance square
            var gravityAB = _pa.mass / (distanceAB * distanceAB);
            var particleA = sut.create(_pa);
            var particleB = sut.create(_pb);
            var grav = Vector.create({ x: 0, y: 0 });

            // Initial position
            grav.setLength(gravityAB);
            grav.setAngle(angleAB);
            oldPosition = { x: particleB.position.getX(), y: particleB.position.getY() };

            // Ending position
            particleB.velocity.addTo(grav);
            particleB.update();            
            newPosition = { x: particleB.position.getX(), y: particleB.position.getY() };


            // Assertion
            var earth = sut.create(_pb);
            var sun = sut.create(_pa);            
            earth.gravitateTo(sun);
            earth.update();
            assert.equal(Math.round(earth.position.getX()), Math.round(newPosition.x));
            assert.equal(Math.round(earth.position.getY()), Math.round(newPosition.y));
        });

    });

});
