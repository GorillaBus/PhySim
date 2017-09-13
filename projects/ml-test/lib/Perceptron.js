import Utils from '../../../src/lib/Utils';
import Vector from '../../../src/lib/Vector';

export default class Perceptron {

  // Creates random weights for the amount of inputs
  constructor(n, learningConstant) {
    this.weights = [];
    this.c = learningConstant || 0.01;            // Training coeficient
    for (let i=0;i<n;i++) {
      this.weights[i] = Utils.randomRange(-1, 1);
    }
  }


  // Process inputs: multiply per weights, sum and send to the activate function
  feedForward(forces) {
    let sum = new Vector();

    for (let i=0,total=this.weights.length;i<total;i++) {
      forces[i].multiplyBy(this.weights[i]);
      sum.addTo(forces[i]);
    }

    return this.transfer(sum);
  }

  // Transfer function
  transfer(sum) {
    return sum;
  }

  train(forces, error) {
    for (let i=0,total=this.weights.length;i<total;i++) {
      this.weights[i] += this.c * error.getX() * forces[i].getX();
      this.weights[i] += this.c * error.getY() * forces[i].getY();
    }
  }

}
