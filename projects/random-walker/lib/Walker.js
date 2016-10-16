import Utils from '../../../src/lib/Utils';
import Perlin from '../../../src/lib/Perlin';

export default class Walker {
    constructor(settings) {
      this.x = settings.x || 0;
      this.y = settings.y || 0;
      this.maxX = settings.maxX || 1280;
      this.maxY = settings.maxY || 740;
      this.utils = new Utils();
      this.pn = new Perlin('some random seed');
      this.stepSize = settings.stepSize || 1;
    }

    /**
     *  Will choose a random step from the 8 directions or stay at the same position (9 posibilities)
     *  Generates values between MAX and MIN, for details on how random() is used check:
     *  http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
     */
    stepMultipleDirections() {
      const min = -1;
      const max = 1;

      // Generate random X/Y: 8 directions plus 1 staying at the same place
      let xValue = Math.floor(Math.random() * (max - min + 1)) + min;
      let yValue = Math.floor(Math.random() * (max - min + 1)) + min;

      this.x += this.stepSize * xValue
      this.y += this.stepSize * yValue;
    }

    stepPerlin(tx, ty) {
      let xValue = 0;
      let yValue = 0;

      // Eventually jump to a distant location
      xValue = Math.floor(this.pn.noise(tx,0,0) * ((this.maxX) - 1 + 1)) + 1;
      yValue = Math.floor(this.pn.noise(ty,0,0) * ((this.maxY) - 1 + 1)) + 1;

      this.x = xValue;
      this.y = yValue;

      this.handlOffscreen();
    }

    stepMontecarlo(w, h) {
      const min = -1;
      const max = 1;

      let xValue=0;
      let yValue=0;
      let value = Math.floor(this.utils.montecarlo() * (6 - 1 + 1)) + 1;

      // Eventually jump to a distant location
      if (value < 2) {
        xValue = Math.floor(Math.random() * ((w-10) - 10 + 1)) + 10;
        yValue = Math.floor(Math.random() * ((h-10) - 10 + 1)) + 10;

      } else {

        xValue += this.x + this.stepSize * (Math.floor(Math.random() * (max - min + 1)) + min);
        yValue += this.y + this.stepSize * (Math.floor(Math.random() * (max - min + 1)) + min);
      }

      this.x = xValue;
      this.y = yValue;

      this.handlOffscreen();
    }

    /**
     *  Will choose a step between the four basic positions with a 40% probability of moving to the right
     *
     */
    stepProbability() {
      let r = Math.random();
      let xValue, yValue;

      if (r < 0.4) {
        xValue = 1;
        yValue = 0;
      } else if (r < 0.6) {
        xValue = -1;
        yValue = 0;
      } else if (r < 0.8) {
        xValue = 0;
        yValue = 1;
      } else {
        xValue = 0;
        yValue = -1;
      }

      this.x += this.stepSize * xValue
      this.y += this.stepSize * yValue;
    }

    handlOffscreen() {
      if (this.x >= this.maxX) {
        this.x = this.maxX;
      } else if (this.x < 1) {
        this.x = 1;
      }

      if (this.y >= this.maxY) {
        this.y = this.maxY;
      } else if (this.y < 1) {
        this.y = 1;
      }
    }
}
