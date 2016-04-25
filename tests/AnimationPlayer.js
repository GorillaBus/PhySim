var sinon = require('sinon');
var assert = require('chai').assert;

var AnimationPlayer = require('../src/lib/AnimationPlayer');

suite('Animation Player', function() {

    var sut,
    player,
    windowFake,
    windowMock, 
    reqAnimFrameSpy,
    cancelAnimFrameSpy;

    setup(function() {

        windowFake = {
            requestAnimationFrame: function(cb) {
                // Note that we don't execute cb to avoid recursion
                return this.generateFakeId();
            },
            cancelAnimationFrame: function(requestId) {
                return requestId;
            },
            generateFakeId: function() {
                return Math.floor((Math.random() * 10) + 1);
            }
        };

        reqAnimFrameSpy = sinon.spy(windowFake, 'requestAnimationFrame');
        cancelAnimFrameSpy = sinon.spy(windowFake, 'cancelAnimationFrame');
        windowMock = sinon.mock(windowFake);
        player = Object.create(AnimationPlayer);
        sut = player.create(windowFake);

    });

    suite('General', function() {

        test('must be a JavaScript Object with \'creat\' function', function() {
            assert.isObject(sut);
            assert.property(sut, 'create');
        });

        test('must have Play and Stop function', function() {
            assert.property(sut, 'play');
            assert.property(sut, 'stop');            
        });

        test('must set an update function', function() {
            var cb = function() {};
            assert.property(sut, 'setUpdateFn');
            sut.setUpdateFn(cb);
            assert.isFunction(sut.updateFn);
        });

      
    });

    suite('Play', function() { 

        test('must call window.requestAnimationFrame and save requestId', function() {
            var cb = function() {};
            sut.setUpdateFn(cb);
            sut.updateFn();
            assert.isTrue(reqAnimFrameSpy.called);
            assert.isNumber(sut.requestId);
        });

        test('must set \'playing\' to true after play() called', function() {
            sut.play();
            assert.isTrue(sut.playing);
        });

    });

    suite('Stop', function() { 

        test('must return false if called when and not playing', function() {
            var returned = sut.stop();
            assert.isFalse(returned);
        });

        test('must call window.cancelAnimationFrame', function() {
            sut.play();
            sut.stop();
            assert.isTrue(cancelAnimFrameSpy.called);
        });

        test('must unset \'requestId\' & set \'playing\' to false', function() {
            sut.play();
            sut.stop();
            assert.isNull(sut.requestId);
        });



    });    
});
