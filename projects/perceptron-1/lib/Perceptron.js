import Utils from '../../../src/lib/Utils';

export default class Perceptron {

  // Creates random weights for the amount of inputs
  constructor(n, learningConstant) {
    this.weights = new Array(n);
    this.c = learningConstant || 0.01;
    for (let i=0;i<this.weights.length;i++) {
      this.weights[i] = Utils.randomRange(-1, 1);
    }
  }


  // Process inputs: multiply per weights, sum and send to the activate function
  feedForward(inputs) {
    let sum = 0;
    for (let i=0;i<this.weights.length;i++) {
      sum += inputs[i] * this.weights[i];
    }

    return this.activate(sum);
  }

  // Activation function
  activate(sum) {
    return sum > 0 ? 1:-1;
  }

  // Training function: requires inputs array and a known value
  train(inputs, desired) {
    let guess = this.feedForward(inputs);
    let error = desired - guess;

    for (let i=0;i<this.weights.length;i++) {
      let correction = this.c * error * inputs[i];
      this.weights[i] += correction;
    }
  }

}
