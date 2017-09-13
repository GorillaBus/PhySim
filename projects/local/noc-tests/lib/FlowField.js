import Vector from '../../../../src/lib/Vector';
import Utils from '../../../../src/lib/Utils';
import Perlin from '../../../../src/lib/Perlin';

export default class FlowField {

  constructor(w, h, z, resolution, source, cbInit) {
    this.ctx;
    this.width = w;
    this.height = h;
    this.field = [];
    this.resolution = resolution || 10;
    this.rows = Math.round(w / this.resolution);
    this.cols = Math.round(h / this.resolution);
    this.depth = z >= 1 ? z:1;
    this.zIndex = 0;
    this.mustRedraw = false;
    this.isReady = false;
    this.cbInit = cbInit || null;
    this.initField(source);
  }

  pushZ() {
    this.zIndex++;
    if (this.zIndex >= this.depth) {
      this.zIndex = 0;
    }
    this.mustRedraw = true;
  }

  lookup(vector) {
    let x = vector.getX() / this.resolution;
    let y = vector.getY() / this.resolution;
    let col = parseInt(Utils.constrain(y, 0, this.cols-1));
    let row = parseInt(Utils.constrain(x, 0, this.rows-1));
    return this.field[this.zIndex][col][row].copy();
  }

  initField(source) {
    let type = typeof source;

    switch (type) {
      case 'string':

        if (source === 'special') {
          this.gridFromSpecial();
        } else {
          this.gridFromImage(source);
        }
        break;

      case 'object':
        this.gridFromPerlin(source);
        break;

      default:
        console.error("FlowField :: createField: invalid source.");
        return false;
    }
  }

  createGrid(vectors) {
    if (!this.ctx) {
      this.ctx = this.createCanvas();
    }

    this.field = vectors;
    this.mustRedraw = true;
    this.isReady = true;

    if (typeof this.cbInit === 'function') {
      this.cbInit();
    }
  }

  gridFromImage(imageSrc) {
    this.getVectorsFromImage(imageSrc, (vectors) => {
      this.createGrid(vectors)
    });
  }

  gridFromPerlin(source) {
    source = source || {};
    let vectors = this.getVectorsFromPerlinNoise(source.seed, source.res);
    this.createGrid(vectors);
  }

  gridFromSpecial() {
    let vectors = this.getSpecialVectors();
    this.createGrid(vectors);
  }

  getSpecialVectors() {
    let vectors = [];
    for (let z=0; z<this.depth; z++) {
      vectors[z] = [];
      for (let i = 0; i<this.cols; i++) {
        vectors[z][i] = new Array(this.rows);
        for (let j = 0; j<this.rows; j++) {

          let angle;
          let prob = Math.random();
          if (prob < 0.85) {
            angle = Utils.randomRange(0.2, 0.6);
          } else {
            angle = Utils.randomRange(-0.9, 0.1);
          }

          let vector = new Vector({
            x: Math.cos(angle),
            y: Math.sin(angle)
          });
          vectors[z][i][j] = vector;
        }
      }
    }

    return vectors;
  }

  getVectorsFromPerlinNoise(seed, res) {
    res = res || {};
    res = {
      x: res.x || 0.02,
      y: res.y || 0.02,
      z: res.z || 0.02
    };
    seed = seed || Math.random();

    let noise = new Perlin();
    noise.seed(seed);
    let xOff = 0;
    let yOff = 0;
    let zOff = 0;
    let vectors = [];

    for (let z=0; z<this.depth; z++) {
      vectors[z] = [];
      for (let i = 0; i<this.cols; i++) {
        yOff = 0;
        vectors[z][i] = new Array(this.rows);
        for (let j = 0; j<this.rows; j++) {
          let noiseVal = noise.noise(xOff, yOff, zOff);
          let angle = Utils.mapRange(noiseVal, 0, 1, -1, 1);
          let vector = new Vector({
            x: Math.cos(angle),
            y: Math.sin(angle)
          });
          vectors[z][i][j] = vector;
          yOff += res.y;
        }
        xOff += res.x;
      }
      zOff += res.z;
    }

    return vectors;
  }

  getVectorsFromImage(imageSrc, cb) {
    let image = new Image();

    image.src = imageSrc;
    image.onload = function() {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = this.width;
      canvas.height = this.height;
      document.getElementsByTagName("BODY")[0].appendChild(canvas);
      ctx.drawImage(image, 0, 0);

      let imageData = ctx.getImageData(0, 0, this.width, this.height);
      let vectors = [[]];

      for (let i=0; i<this.cols; i++) {
        vectors[0][i] = new Array(this.rows);

        for (let j=0; j<this.rows; j++) {
          let brightness = this.imageGetBlockValue(imageData, i, j);
          let angle = Utils.mapRange(brightness, 0, 255, -1, 1);
          let vector = new Vector({
            x: Math.cos(angle),
            y: Math.sin(angle)
          });

          vectors[0][i][j] = vector;
        }
      }

      cb(vectors);

    }.bind(this);
  }

  imageGetBlockValue(imageData, col, row) {
    let pixelData = 4;
    let blockSize = this.resolution * pixelData;
    let blockSizeSquare = this.resolution * blockSize;
    let start = (col * blockSize) + row * this.width * blockSize;
    let end = start + blockSize;
    let nextOffset = this.cols * blockSize;
    let cut = start + nextOffset * this.resolution
    let acum = 0;
    let y=0;
    while (start < cut) {
      for (let i=start; i<end; i++) {
        acum += imageData.data[i];
        y++;
      }

      start += nextOffset;
      end = start + blockSize;
    }

    return acum / blockSizeSquare;
  }

  debugPaintImageBlock(imageData, col, row) {
    let pixelData = 4;
    let blockSize = this.resolution * pixelData;
    let blockSizeSquare = this.resolution * blockSize;
    let start = (col * blockSize) + row * this.width * blockSize;
    let end = start + blockSize;
    let nextOffset = this.cols * blockSize;
    let cut = start + nextOffset*this.resolution
    let acum = 0;
    let y=0;
    while (start < cut) {
      for (let i=start; i<end; i++) {
        acum += imageData.data[i];
        imageData.data[i] = 255;
        y++;
      }

      start += nextOffset;
      end = start + blockSize;
    }
  }

  drawCell(x, y, a) {
    let arrowSize = this.resolution / 1.5;
    let halfRes = this.resolution / 2;
    let xOffset = (this.resolution - arrowSize) / 2;
    let arrowColor = "#a3a3a3";
    let arrowHeadSize = arrowSize * 10 / 100;

    // this.ctx.lineWidth = 1;
    //
    // this.ctx.setLineDash([5, 15]);
    // this.ctx.beginPath();
    // this.ctx.rect(x, y, this.resolution , this.resolution);
    // this.ctx.stroke();
    // this.ctx.closePath();

    this.ctx.save();
    this.ctx.translate(x + halfRes, y + halfRes);
    this.ctx.rotate(a);

    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = arrowColor;
    this.ctx.fillStyle = arrowColor;

    this.ctx.beginPath();
    this.ctx.moveTo(-(arrowSize/2), 0);
    this.ctx.lineTo((arrowSize/2)-arrowHeadSize, 0);
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo((arrowSize/2)-arrowHeadSize, -arrowHeadSize);
    this.ctx.lineTo((arrowSize/2)-arrowHeadSize, arrowHeadSize);
    this.ctx.lineTo(arrowSize/2, 0);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  draw() {
    if (!this.mustRedraw) {
      return;
    }

    let x = 0;
    let y = 0;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i<this.cols; i++) {
      y = i * this.resolution;
      for (let j = 0; j<this.rows; j++) {
        x = j * this.resolution;
        let v = this.field[this.zIndex][i][j];
        let angle = v.getAngle();
        this.drawCell(x, y, angle);
      }
    }

    this.mustRedraw = false;
  }

  createCanvas() {
    let canvas = document.createElement("canvas");
    let width = window.innerWidth;
    let height = window.innerHeight-4;
    canvas.height = height;
    canvas.width = width;
    canvas.setAttribute("id", "flowField");
    canvas.style = "position: absolute; background:transparent; top:0; left:0; z-index:-1";
    document.getElementsByTagName("BODY")[0].appendChild(canvas);
    return canvas.getContext("2d");
  }
}
