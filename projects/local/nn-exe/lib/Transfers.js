export default {
  // Hard Limit
  hardlim: (input) => {
    return input < 0 ? 0:1;
  },
  // Symetrical Hard Limit
  hardlims: (input) => {
    return input < 0 ? -1:1;
  },
  // Linear
  purelin: (input) => {
    return input;
  },
  // Saturating Linear
  satlin: (input) => {
    return (input >= 0 && input <= 1) ? input:input < 0 ? 0:1;
  },
  // Symetrical Saturating Linear
  satlins: (input) => {
    return (input >= -1 && input <= 1) ? input:input < -1 ? -1:1;
  },
  // Log Sigmoid
  logsig: (input) => {
    return 1 / (1 + Math.exp(-input));
  },
  // Hyperbolic Tangent Sigmoid
  tansig: (input) => {
    let e = Math.exp(2*input);
    return (e - 1) / (e + 1) ;
  },
  // Positive Linear
  poslin: (input) => {
    return input < 0 ? 0:input;
  }
}
