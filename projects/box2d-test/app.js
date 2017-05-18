import AnimationPlayer from '../../src/lib/AnimationPlayer';
import Utils from '../../src/lib/Utils';
import B2Box from './lib/B2Box';
import Entity from './lib/Entity';
import Circle from './lib/Circle';
import Rectangle from './lib/Rectangle';
import Polygon from './lib/Polygon';

document.addEventListener('DOMContentLoaded', () => {

  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight-4;
  const CENTER = { x: WIDTH/2, y: HEIGHT/2 };
  const NULL_CENTER = { x: null, y: null };

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let SCALE = 30;
  let FPS = 60; // This is experimental: it may cause conflicts with AnimationPlayer's fps?
  let DEBUG_DRAW = false;

  let box = new B2Box(FPS, false, WIDTH, HEIGHT, SCALE, DEBUG_DRAW, ctx);
  let player = new AnimationPlayer({ fps: FPS });

  // Full size the canvas element
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  // Demo player setup
  player.setUpdateFn(update);
  player.play();


  // Simulation
  let world = {};
  let bodiesState = null;
  let totalBalls = 500;
  let initialState = [];

  // Generate Balls
  for (let i=0; i<totalBalls; i++) {
    let ball = {
      id: Utils.randomUniueID(),
      x: Utils.randomRange(0, box.toB2p(WIDTH*2)),
      y: Utils.randomRange(0, box.toB2p(HEIGHT*2)),
      radius: Utils.randomRange(0.5, 1),
      color: Utils.randomColor(),
      angle: Utils.randomRange(0, Math.PI*2)
    };

    initialState.push(ball);
  }


  for (let i = 0; i < initialState.length; i++) {
    world[initialState[i].id] = build(initialState[i]);
  }

  box.setBodies(world);



  // Update function
  function update() {
    box.update();
    bodiesState = box.getState();

    var graveyard = [];

    for (var id in bodiesState) {
      var entity = world[id];

      if (entity && world[id].dead) {
        box.removeBody(id);
        graveyard.push(id);
      } else if (entity) {
        entity.update(bodiesState[id]);
      }
    }

    for (var i = 0; i < graveyard.length; i++) {
      delete world[graveyard[i]];
    }

    if (DEBUG_DRAW) {
      box.debugDraw();
    } else {
      draw();
    }

  }

  function draw() {
    ctx.clearRect(0,0, WIDTH, HEIGHT);

    ctx.globalAlpha = 0.5;

    for (var id in world) {
      var entity = world[id];
      entity.draw(ctx);
    }

    // Draw scale line
    ctx.beginPath();
    ctx.moveTo(SCALE, 10);
    ctx.lineTo(SCALE * 2, 10);
    ctx.closePath();
    ctx.stroke();
  }

  function build(def) {
    if (def.radius) {
      return new Circle(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.heading, def.speed, def.radius);
    } else if (def.polys) {
      return new Polygon(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.polys);
    } else {
      return new Rectangle(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.halfWidth, def.halfHeight);
    }
  }

});
