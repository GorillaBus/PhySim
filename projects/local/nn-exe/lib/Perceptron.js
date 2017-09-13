import Transfers from './Transfers';
import Utils from '../../../../src/lib/Utils';

export default class Perceptron {

  constructor(settings) {
    this.lc = settings.lc || 0.01;
    this.bias = settings.bias || 0;
    settings.transfer = settings.transfer || 'hardlims';
    this.transfer = Transfers[settings.transfer];

    if (!settings.weights && settings.inputs > 0) {
      this.weights = [];
      for (let i=0; i<settings.inputs; i++) {
        this.weights[i] = Utils.randomRange(-1, 1);
      }
    } else {
      this.weights = settings.weights;
    }

    this.totalWeights = this.weights.length;
  }

  feedForward(inputs) {
    let sum = 0;
    for (let i=0; i<this.totalWeights; i++) {
      sum += this.weights[i] * inputs[i];
    }
    sum += this.bias;
    return this.transfer(sum);
  }

  // Transfer function
  transfer() {}

  train(inputs, error) {

    let data = {
      w1_A: this.weights[0],
      w2_A: this.weights[1],
      error: error
    };

    for (let i=0; i<this.totalWeights; i++) {
      this.weights[i] += this.lc * error * inputs[i];
    }

    data.w1_B = this.weights[0];
    data.w2_B = this.weights[1];
    return data;
  }

}
