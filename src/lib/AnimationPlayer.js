import FEATURE_TOGGLE from '../../src/feature-toggle';

export default class AnimationPlayer {

  constructor(settings) {
    settings = settings || {};

    this.window = settings.windowElement || window;
    this.requestId = null;
    this.playing = false;

    // FPS control
    if (FEATURE_TOGGLE.FPS_CONTROL) {
      this.fps = settings.fps || 90;
      this.now;
      this.lastTime = Date.now();
      this.interval = 1000/this.fps;
      this.delta;
    }

    this.registerEvents();
  }

  registerEvents() {
    // Animation control: KeyDown
    document.body.addEventListener("keydown", (e) => {
      //console.log("Key pressed: ", e.keyCode);
      switch (e.keyCode) {
        case 27:                        // Esc
        if (this.playing) {
          this.stop();
          console.log("> Scene stopped");
        } else {
          this.play();
          console.log("> Playing scene");
        }
        break;

        case 13:
        this.stop();
        this.play();
        this.stop();
        console.log("> Step forward");
        break;

        default:
        break;
      }
    });
  }

  play() {
    this.playing = true;
    this.updateFn();
  }

  stop() {
    if (!this.playing) {
      return false;
    }
    this.window.cancelAnimationFrame(this.requestId);
    this.playing = false;
    this.requestId = null;
  }

  setUpdateFn(updateFn) {
    this.updateFn = (
      () => {
        this.requestId = this.window.requestAnimationFrame(this.updateFn);

        // FPS control
        if (FEATURE_TOGGLE.FPS_CONTROL) {
          this.now = Date.now();
          this.delta = this.now - this.lastTime;

          if (this.delta > this.interval) {
            this.lastTime = this.now - (this.delta % this.interval);
            updateFn();
          }
          return;
        }

        updateFn();

      });
    }

    updateFn() {
      console.warn("Player update function has not been set.");
    }
  }
