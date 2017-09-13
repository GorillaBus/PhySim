export default class Delay {
  constructor(settings) {
    this.timeout = settings.delay || 10;
  }

  input(n, fn) {
    setTimeout(()=> {
      fn.apply(n);
    }, this.timeout);
  }
}
