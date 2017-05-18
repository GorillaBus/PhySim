export default class Oscillator {

  constructor(speed, amplification) {
    this.speed = speed || 0.1;
    this.amp = amplification || 1;
    this.delta = 0;
    this.phase = 0;
    this.initPhase = 0;
    this.useAmp = true;
  }

  /**
   *    Toggle/Switch amplification on output. Will work as a switch
   *    unless a value (true/false) is passed.
   */
  toggleAmp(value) {
    value = value || !this.useAmp;
    this.useAmp = value;
  }

  /**
   *    Adjust the phase for sampling purposes
   *
   */
  nextPhase() {
    this.initPhase += this.speed;
    this.phase = this.initPhase;
  }

  /**
   *    Generates the next oscillation value with no amplification.
   *
   */
  generate() {
    let value = Math.sin(this.phase);
    this.phase += this.speed;
    return value;
  }

  /**
   *    Main oscillation metod. Will return amplified or raw depending
   *    on 'this.useAmp'.
   */
  oscillate() {
    let output = this.generate();
    return this.useAmp ? this.amplify(output) : output;
  }

  /**
   *    Amplifies a value.
   *
   */
  amplify(carrier) {
    return carrier * this.amp;
  }
}
