import Oscillator from './Oscillator';
import Utils from '../../../../src/lib/Utils';

export default class Wave {

  /**
   *    When Speed and Amplification are given an Oscillator will be added with
   *    those parameters.
   */
  constructor(speed, amplification, width) {
    this.oscillators = [];
    this.width = width || window.innerWidth;
    this.delta = 1;

    if (speed && amplification) {
      this.oscillatorAdd(speed, amplification);
    }
  }

  /**
   *    Returns a sample point from the wave generates by the sum of each of its
   *    compossing oscillators.
   */
  sample() {
    if (!this.oscillators.length) {
      console.warn("Wave has no oscillators defined");
      return false;
    }

    let resample = false;
    let yAcum = 0;
    let maxAmp = 0;

    if (this.delta > this.width) {
      this.delta = 1;
      resample = true;
    }

    let output = {
      x: this.delta,
      y: null
    };

    for (let i=0; i<this.oscillators.length; i++) {
      let osc = this.oscillators[i];

      if (resample) {
        osc.nextPhase();
      }

      // Acumulate every oscillator's output value and calculate max amplitude
      maxAmp += osc.amp;
      yAcum += osc.oscillate();
    }

    output.y = yAcum; //this.map(yAcum, maxAmp);
    this.delta++;
    return output;
  }

  /**
   *    Creates a new wave containing the sum of each wave's oscillators
   *
   */
   sum() {
     var args = Array.prototype.slice.call(arguments);
     let newWave = new Wave();
     let oscillators = this.oscillators;

     args.forEach(function(wave) {
       oscillators = oscillators.concat(wave.oscillators);
     });

     newWave.oscillators = oscillators;
     return newWave;
   }

  /**
   *    Create a new Oscillator
   *
   */
  oscillatorAdd(speed, amplification) {
    let osc = new Oscillator(speed, amplification);
    this.oscillators.push(osc);
  }

  /**
   *    Map output values to representable screen coordinates
   *
   */
  map(value, amp) {
    return Utils.mapRange(value, -amp, amp, 0, amp*2);
  }
}
