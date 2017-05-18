import Utils from '../../../../src/lib/Utils';
import Vector from '../../../../src/lib/Vector';

export default class Oscillator_Vector {

  constructor(angle, amplitude, oscillationSpeed) {
    const width = window.innerWidth;
    const height = window.innerHeight-4;

    this.location = new Vector();

    angle = angle || 0
    this.angle = new Vector({
      x: Math.cos(angle),
      y: Math.sin(angle)
    });

    amplitude = amplitude || {
      x: Utils.randomRange(1, width/2),
      y: Utils.randomRange(1, height/2)
    };
    this.amplitude = new Vector({ x: amplitude.x, y: amplitude.y });

    oscillationSpeed = oscillationSpeed || { x: 0.1, y: 2 };
    this.velocity = new Vector({ x: oscillationSpeed.x, y: oscillationSpeed.y });
  }

  oscillate() {
    this.angle.addTo(this.velocity);

    let x = Math.sin(this.angle.getX()) * this.amplitude.getX();
    let y = Math.sin(this.angle.getY()) * this.amplitude.getY();

    this.location.setX(x);
    this.location.setY(y);
  }
}
