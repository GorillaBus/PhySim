export default class Drawer {

  constructor(canvas) {
    this.canvas = canvas || null;
    this.ctx = null;
    this.width = null;
    this.height = null;
    this.center = { x: null, y: null };

    this.setup(canvas);
  }

  setup(canvas) {
    this.canvas = canvas ? canvas : document.createElement("canvas");
    this.canvas.setAttribute("id", "canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth-4;
    this.height = this.canvas.height = window.innerHeight-4;
    this.center = { x: this.width/2, y: this.height/2 };

    if (!canvas) {
      this.insertCanvas(this.canvas);
    }
  }

  insertCanvas(canvas) {
    document.getElementsByTagName("BODY")[0].appendChild(canvas);
  }

  clear(x, y, width, height) {
    x = x || 0;
    y = y || 0;
    width = width || this.width;
    height = height || this.height;

    this.ctx.clearRect(x, y, width, height);
  }

  circle(x, y, radio) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radio, 0, 2*Math.PI, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

}
