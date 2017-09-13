import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Vehicle from './lib/Vehicle';
import FlowField from './lib/FlowField';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;

  let totalCars = 10;

  for (let i=0; i<totalCars; i++) {
    cars[i] = new Vehicle(
      Utils.randomRange(0, width),
      Utils.randomRange(0, height),
      Utils.randomRange(2, 5),
      Math.PI*2,
      Utils.randomRange(3, 5),
      Utils.randomRange(0.8, 7),
      Utils.randomRange(0.05, 2));
  }

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();

  function updateFn(delta, elapsed) {
    ctx.clearRect(0, 0, width, height);


    for (let i=0; i<totalCars; i++) {
      let car = cars[i];
      car.update();

      if (car.location.getY() > height || car.location.getY() < 0 || car.location.getX() > flowField.width || car.location.getX() < 0) {
        car.location.setY(Utils.randomRange(0, height));
        car.location.setX(0);
        car.velocity.multiplyBy(0);
      }


      car.draw(ctx);
    }
  }


  document.onclick = (e) => {
    let car = new Vehicle(e.clientX, e.clientY, 5, Math.PI*2, 10, 0);
    cars.push(car);
    totalCars++;
  };
};
