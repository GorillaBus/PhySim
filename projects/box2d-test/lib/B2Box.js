import Box2D from 'box2dweb';

let   b2Vec2 = Box2D.Common.Math.b2Vec2
 , b2BodyDef = Box2D.Dynamics.b2BodyDef
 , b2Body = Box2D.Dynamics.b2Body
 , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 , b2Fixture = Box2D.Dynamics.b2Fixture
 , b2World = Box2D.Dynamics.b2World
 , b2MassData = Box2D.Collision.Shapes.b2MassData
 , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
 , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

export default class B2Box {

  constructor(intervalRate, adaptive, width, height, scale, debugDraw, ctx) {
    this.intervalRate = parseInt(intervalRate);
    this.adaptive = adaptive;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.bodiesMap = {};

    // Create World
    this.world = new b2World(
          new b2Vec2(0, 0)    //gravity
       ,  true                 //allow sleep
    );

    // Default fixture setup
    this.fixDef = new b2FixtureDef;
    this.fixDef.density = 1;
    this.fixDef.friction = 0;
    this.fixDef.restitution = 0.5;


    // Setup debug draw
    if (debugDraw) {
      this.setupDebugDraw(ctx);
    }
  }

  update() {
    let start = Date.now();
    let stepRate = (this.adaptive) ? (now - this.lastTimestamp) / 1000 : (1 / this.intervalRate);


    for (let a in this.bodiesMap) {
      for (let b in this.bodiesMap) {
        if (a === b) {
          continue;
        }

        this.gravitate(this.bodiesMap[a], this.bodiesMap[b]);
      }
    }

    this.world.Step(
           stepRate   //frame-rate
        ,  8       //velocity iterations
        ,  8       //position iterations
     );
     this.world.ClearForces();
     return (Date.now() - start);
  }

  getState() {
    let state = {};
    for (let b = this.world.GetBodyList(); b; b = b.m_next) {

      if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
          state[b.GetUserData()] = this.getBodySpec(b);
      }
    }
    return state;
  }

  getBodySpec(b) {
    return {
      x: this.toPx(b.GetPosition().x),
      y: this.toPx(b.GetPosition().y),
      a: b.GetAngle(),
      c: {
        x: this.toPx(b.GetWorldCenter().x),
        y: this.toPx(b.GetWorldCenter().y)
      },
      r: this.toPx(this.getRadius(b))   // Same as SCALE: is this value expressed in B2D points or pixels?
    };
  }

  getRadius(b) {
    let f = b.GetFixtureList();
    return f.m_shape.m_radius;
  }

  setBodies(bodyEntities) {
      let bodyDef = new b2BodyDef;

      for(let id in bodyEntities) {
          let entity = bodyEntities[id];

          if (entity.id == 'ground') {
              bodyDef.type = b2Body.b2_staticBody;
          } else {
              bodyDef.type = b2Body.b2_dynamicBody;
          }

          if (entity.heading !== 0 && entity.speed !== 0) {
            bodyDef.linearVelocity.x = Math.cos(entity.heading) * entity.speed;
            bodyDef.linearVelocity.y = Math.sin(entity.heading) * entity.speed;
          }

          bodyDef.position.x = entity.x;
          bodyDef.position.y = entity.y;

          bodyDef.userData = entity.id;
          bodyDef.angle = entity.angle;
          let body = this.registerBody(bodyDef);

          if (entity.radius) {
              this.fixDef.shape = new b2CircleShape(entity.radius);
              body.CreateFixture(this.fixDef);
          } else if (entity.polys) {
              for (let j = 0; j < entity.polys.length; j++) {
                  let points = entity.polys[j];
                  let vecs = [];
                  for (let i = 0; i < points.length; i++) {
                      let vec = new b2Vec2();
                      vec.Set(points[i].x, points[i].y);
                      vecs[i] = vec;
                  }
                  this.fixDef.shape = new b2PolygonShape;
                  this.fixDef.shape.SetAsArray(vecs, vecs.length);
                  body.CreateFixture(this.fixDef);
              }
          } else {
              this.fixDef.shape = new b2PolygonShape;
              this.fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
              body.CreateFixture(this.fixDef);
          }
      }
      this.ready = true;
  }

  registerBody(bodyDef) {
      let body = this.world.CreateBody(bodyDef);
      this.bodiesMap[body.GetUserData()] = body;
      return body;
  }

  removeBody(id) {
    this.world.DestroyBody(this.bodiesMap[id]);
  }

  debugDraw() {
    this.world.DrawDebugData();
  }

  setupDebugDraw(ctx, alpha) {
    alpha = alpha || 0.5;

    let debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(this.scale);
    debugDraw.SetFillAlpha(alpha);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(debugDraw);
  }

  toPx(v) {
    return v * this.scale;
  }

  toB2p(v) {
    return v / this.scale;
  }

  gravitate(a, b, gravityFactor) {
    gravityFactor = 9.6;

    // let aPos = a.GetWorldCenter();
    // let bPos = b.GetWorldCenter();
    // let force = aPos.Copy();
    // force.Subtract(bPos);
    //
    // let distance = force.Length();
    //
    // force.Normalize();
    // let strength = (gravityFactor * b.m_mass * a.m_mass) / (distance * distance);
    // force.Multiply(strength);
    //
    // b.ApplyForce(force, bPos);

    let radiusSum = this.getRadius(a) + this.getRadius(b);
    let massFactor = a.m_mass * b.m_mass;

    let aPos = a.GetWorldCenter();
    let bPos = b.GetWorldCenter();

    let force = aPos.Copy();
    force.Subtract(bPos);

    let distance = force.Length();
    let surfaceDist = distance - radiusSum;


    force.Normalize();
    let strength = gravityFactor * massFactor / (distance * distance);

    force.Multiply(strength);

    b.ApplyForce(force, bPos);

  }



}
