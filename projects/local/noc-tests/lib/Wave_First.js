import Utils from '../../../../src/lib/Utils';

export default class Wave {

  constructor(amplitude, sampleWidth, angleSpeed, yPosCorrection) {
    this.delta = 0;
    this.amplitude = amplitude || 100;
    this.width = sampleWidth || window.innerWidth;
    this.angle = 0;
    this.angleSpeed = angleSpeed || 0.1;
    this.startAngle = 0;
    this.yPosCorrection = yPosCorrection || 0;
    this.wave = null;
  }

  sum(wave) {
    this.wave = wave;
  }

  /**
   *    Get the next oscillation position in the wave sample
   *
   */
  oscillate() {
    if (this.delta > this.width) {
      this.startAngle += this.angleSpeed;
      this.angle = this.startAngle;
      this.delta = 0;
    }

    let y = Utils.mapRange(Math.sin(this.angle), -1, 1, 0, this.amplitude);

    if (this.wave) {
      let val = this.wave.oscillate();
      y += val.y;
    }

    this.delta++;
    this.angle += this.angleSpeed;

    return { x: this.delta, y: this.yPosCorrection + y };
  }

  /**
   *    Get an array with all the oscillation positions of the sample
   *
   */
  sample() {
    let sample = [];
    for (let x=0; x<this.width; x++) {
      let point = this.oscillate();
      sample.push(point);
    }
    return sample;
  }

}
