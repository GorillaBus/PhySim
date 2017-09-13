import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Perceptron from './lib/Perceptron';

/*

  A three sensors machine will classify fruits based on the sensors output:

    SHAPE sensor          SURFACE sensor      WEIGHT sensor
    ---------------------------------------------------------
    Rounded     1         Smooth  1           > 1 pound    1
    Eliptical   -1        Rough   -1          < 1 pound    -1
*/

let n = new Perceptron({
  weights: [-1, 1, 1],
  bias: 0,
  transfer: 'hardlims'
});

let fruit = {
  orange: [1,-1,-1],
  apple: [-1, 1, -1],
  watermelon: [-1, 1, 1]
}

let res = n.feedForward(fruit.orange);

console.log("Result: ", res);
