export default class Walker {
    constructor(settings) {
      this.x = settings.x || 0;
      this.y = settings.y || 0;
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

}
