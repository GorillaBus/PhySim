import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Vector from '../../../src/lib/Vector';
import Utils from '../../../src/lib/Utils';
import Vehicle from './lib/Vehicle';
import Path from './lib/Path';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  canvas.height = height;
  canvas.width = width;


  let path = new Path(50);
  path.addPoint(50, 50);
  path.addPoint(width-50, 50);
  path.addPoint(width-50, height/2);
  path.addPoint((width-50)/2, height/4);
  path.addPoint(50, height/2);
  path.addPoint(50, 50);



  let totalCars = 25;
  let cars = [];
  for (let i=0; i<totalCars; i++) {
    cars[i] = new Vehicle(
      Utils.randomRange(0, width),    // Y
      Utils.randomRange(0, height),   // X
      null,                           // Mass
      Utils.randomRange(-1, 1),       // Angle
      6,                              // Size
      2,                              // Speed
      3.1,                            // Max speed
      0.2                             // Max steering force
    );
  }

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  // Play a loop function
  player.play();

  function updateFn(delta, elapsed) {
    ctx.clearRect(0, 0, width, height);

    path.draw(ctx);

    for (let i=0; i<totalCars; i++) {
      let car = cars[i];

      // if (car.location.getY() > height || car.location.getY() < 0 || car.location.getX() > width || car.location.getX() < 0) {
      //   car.location.setY(Utils.randomRange(0, height));
      //   car.location.setX(Utils.randomRange(0, width));
      //   car.velocity.multiplyBy(0);
      // }

      car.applyBehaviors(cars, path, ctx, true);
      car.run(ctx);
    }
  }


  document.onclick = (e) => {
    let car = new Vehicle(e.clientX, e.clientY, 5, Math.PI*2, 10, 0);
    cars.push(car);
    totalCars++;
  };
};
