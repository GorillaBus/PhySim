/*
    Exercise 3.11

    Create more complex waves by combining multiple waves together
*/
import AnimationPlayer from '../../../src/lib/AnimationPlayer';
import Wave from './lib/Wave';

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = window.innerWidth;
  const height = window.innerHeight-4;
  const center = { x: width/2, y: height/2 };

  document.getElementsByTagName("body")[0].style = "background: black";

  canvas.height = height;
  canvas.width = width;

  let waveA = new Wave(0.04, 40, width);
  let waveB = new Wave(0.06, 10, width);
  let waveC = new Wave(0.13, 5, width);
  let waveD = new Wave(0.01, 29, width);
  let waveE = new Wave(0.11, 21, width);

  let wave = waveA.sum(waveB, waveC, waveD, waveE);

  // Demo player
  let player = new AnimationPlayer();
  player.setUpdateFn(updateFn);

  function updateFn() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle= "white";
    ctx.beginPath();
    for (let x=0; x<waveA.width; x++) {
      let waveData = waveA.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +100);
      } else {
        ctx.lineTo(waveData.x, waveData.y +100);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x=0; x<waveB.width; x++) {
      let waveData = waveB.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +200);
      } else {
        ctx.lineTo(waveData.x, waveData.y +200);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x=0; x<waveC.width; x++) {
      let waveData = waveC.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +300);
      } else {
        ctx.lineTo(waveData.x, waveData.y +300);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x=0; x<waveD.width; x++) {
      let waveData = waveD.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +400);
      } else {
        ctx.lineTo(waveData.x, waveData.y +400, 1, 0, 2*Math.PI);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x=0; x<waveE.width; x++) {
      let waveData = waveE.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +500);
      } else {
        ctx.lineTo(waveData.x, waveData.y +500, 1, 0, 2*Math.PI);
      }
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle= "red";
    for (let x=0; x<wave.width; x++) {
      let waveData = wave.sample();
      if (x === 0) {
        ctx.moveTo(waveData.x, waveData.y +650);
      } else {
        ctx.lineTo(waveData.x, waveData.y +650, 1, 0, 2*Math.PI);
      }
    }

    ctx.stroke();
  }

  // Play a loop function
  player.play();

  // Animation control
  document.onkeyup = (e) => {
    switch (e.keyCode) {
      case 27:                        // Esc
        if (player.playing) {
          player.stop();
          console.log("> Scene stopped");
        } else {
          player.play();
          console.log("> Playing scene");
        }
      break;

      case 13:
        //updateFn();
      break;
    }

  };
};
