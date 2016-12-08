import AnimationPlayer from '../../src/lib/AnimationPlayer';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = window.innerWidth;
    const height = window.innerHeight-4;
    const center = { x: width/2, y: height/2 };

    canvas.height = height;
    canvas.width = width;

    let player = new AnimationPlayer({ fps: 90 });

    let fl = 900;
    let points = [];
    let centerZ = 1000;
    let needsUpdate = true;

    points[0] = { x: -500, y: -500, z: 500 };
    points[1] = { x: 500, y: -500, z: 500 };
    points[2] = { x: 500, y: -500, z: -500 };
    points[3] = { x: -500, y: -500, z: -500 };
    points[4] = { x: -500, y: 500, z: 500 };
    points[5] = { x: 500, y: 500, z: 500 };
    points[6] = { x: 500, y: 500, z: -500 };
    points[7] = { x: -500, y: 500, z: -500 };

    // Demo player setup
    player.setUpdateFn(update);
    player.play();

    ctx.translate(center.x, center.y);

    // Frame drawing function
    function update() {
      if (needsUpdate) {
        ctx.clearRect(-center.x, -center.y, width, height);

        project();

        ctx.beginPath();
        drawLine(0,1,2,3,0);
        drawLine(4,5,6,7,4);
        drawLine(0,4);
        drawLine(1,5);
        drawLine(2,6);
        drawLine(3,7);
        ctx.stroke();
        needsUpdate = false;
      }
    }

    function project() {
      for (let i=0;i<points.length;i++) {
        let p = points[i];
        let scale = fl / (fl + p.z + centerZ);

        p.sx = p.x * scale;
        p.sy = p.y * scale;
      }
    }

    function drawLine() {
      let p = points[arguments[0]];
      ctx.moveTo(p.sx, p.sy);

      for (let i=1;i<arguments.length;i++) {
        p = points[arguments[i]];
        ctx.lineTo(p.sx, p.sy);
      }
    }

    function translateModel(x, y, z) {
      for (let i=0;i<points.length;i++) {
        points[i].x += x || 0;
        points[i].y += y || 0;
        points[i].z += z || 0;
      }
      needsUpdate = true;
    }

    /**
     *  Rotate X axis:
     *    y1 = y * cos(angle) - z * sin(angle)
     *    z1 = z * cos(angle) + y * sin(angle)
     */
    function rotateX(angle) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);

      for (let i=0; i<points.length; i++) {
        let p = points[i];
        let y = p.y * cos - p.z * sin;
        let z = p.z * cos + p.y * sin;
        p.y = y;
        p.z = z;
      }
      needsUpdate = true;
    }

    /**
     *  Rotate Z axis:
     *    x1 = x * cos(angle) - y * sin(angle)
     *    y1 = y * cos(angle) + x * sin(angle)
     */
    function rotateZ(angle) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);

      for (let i=0; i<points.length; i++) {
        let p = points[i];
        let x = p.x * cos - p.y * sin;
        let y = p.y * cos + p.x * sin;
        p.x = x;
        p.y = y;
      }
      needsUpdate = true;
    }

    /**
     *  Rotate X axis:
     *    y1 = y * cos(angle) - z * sin(angle)
     *    z1 = z * cos(angle) + y * sin(angle)
     */
    function rotateX(angle) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);

      for (let i=0; i<points.length; i++) {
        let p = points[i];
        let y = p.y * cos - p.z * sin;
        let z = p.z * cos + p.y * sin;
        p.y = y;
        p.z = z;
      }
      needsUpdate = true;
    }

    /**
     *  Rotate Y axis:
     *    x1 = x * cos(angle) - z * sin(angle)
     *    z1 = z * cos(angle) + x * sin(angle)
     */
    function rotateY(angle) {
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);

      for (let i=0; i<points.length; i++) {
        let p = points[i];
        let x = p.x * cos - p.z * sin;
        let z = p.z * cos + p.x * sin;
        p.x = x;
        p.z = z;
      }
      needsUpdate = true;
    }


    document.body.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case 37: // Left
            if (event.shiftKey) {
              rotateY(0.05);
            } else if (event.altKey) {
              rotateZ(0.05);
            } else {
              translateModel(-20, 0, 0);
            }
          break;

          case 39: // Right
            if (event.shiftKey) {
              rotateY(-0.05);
            } else if (event.altKey) {
              rotateZ(-0.05);
            } else {
              translateModel(20, 0, 0);
            }
          break;

          case 38: // Up
            if (event.ctrlKey) {
              translateModel(0, 0, 20);
            } else if (event.shiftKey) {
              rotateX(0.05);
            } else {
              translateModel(0, -20, 0);
            }
          break;

          case 40: // Down
            if (event.ctrlKey) {
              translateModel(0, 0, -20);
            } else if (event.shiftKey) {
              rotateX(-0.05);
            } else {
              translateModel(0, 20, 0);
            }
          break;

        }
    });

    // Animation control: KeyDown
    document.body.addEventListener("keydown", (e) => {
        //console.log("Key pressed: ", e.keyCode);
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
          default:
            break;
        }
    });

};
