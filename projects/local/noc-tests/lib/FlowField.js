import Vector from '../../../../src/lib/Vector';
import Utils from '../../../../src/lib/Utils';

export default class FlowField {

  constructor(w, h, resolution, ctx) {
    this.field = [];
    this.resolution = resolution || 10;
    this.cellW = w / this.resolution;
    this.cellH = h / this.resolution;

    this.cols = w / this.cellW;
    this.rows = h / this.cellH;

    this.createGrid();
  }

  createGrid() {
    for (let c = 0; c<this.cols; c++) {
      this.field[c] = [];

      for (let r = 0; r<this.rows; r++) {
        this.field[c][r] = new Vector({
                            x: 0,
                            y: 0,
                            angle: Math.random() * Math.PI * 2,
                            length: 1
                          });
      }
    }
  }

  draw(ctx) {
    let x = 0;
    let y = 0;

    for (let c = 0; c<this.cols; c++) {
      y = c * this.cellH;

      for (let r = 0; r<this.rows; r++) {
        x = r * this.cellW;

        let v = this.field[c][r];

        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.rect(x, y, this.cellW , this.cellH);
        ctx.stroke();
        ctx.closePath();

        ctx.save();
        ctx.translate(x + (this.cellW / 2), y + (this.cellH / 2));
        ctx.rotate(v.getAngle());

        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.moveTo(1, 1);
        ctx.lineTo(30, 1);

        ctx.moveTo(30, 1);
        ctx.lineTo(27, 8);

        ctx.moveTo(30, 1);
        ctx.lineTo(27, -7);

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }


  }

}
