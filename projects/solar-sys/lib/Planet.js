import CelestialBody from './CelestialBody';

export default class Planet extends CelestialBody {

  constructor(settings, world) {
    super(settings, world);

    this.grad = this.createGradient();
  }

  draw(lightSource, drawShadow) {
    lightSource = lightSource || null;
    drawShadow = drawShadow == false ? false:true;

    this.reScale();

    if (this.world.needsUpdate) {
      this.grad = this.createGradient();
    }

    if (this.scaledR < 0) {
      return;
    }

    let x, y;
    switch (this.center) {
      case false:
        x = this.scaledX;
        y = this.scaledY;
        break;
      case true:
        x = this.world.center.x;
        y = this.world.center.y;
        break;
    }

    this.ctx.beginPath();
    this.ctx.fillStyle = this.grad;
    this.ctx.arc(x, y, this.scaledR, 0, Math.PI * 2, false);
    this.ctx.fill();

    if (lightSource && drawShadow) {
      this.drawShadow(lightSource);
    }



    // Debug draw orbit
    if (this.debugOrbit && !this.center) {

      // Show orbit prediction
      let predict = new Planet({
        x: this.x,
        y: this.y,
        mass: this.mass,
        direction: this.getHeading(),
        speed: this.getSpeed(),
        color: "#ffffff",
        center: false
      }, this.world);

      for (let pr=0; pr<=2000; pr++) {

        predict.update();
        predict.gravitateTo(lightSource);
        predict.draw(lightSource, false);
      }
    }
  }

};
