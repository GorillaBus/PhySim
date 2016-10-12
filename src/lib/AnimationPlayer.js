import FEATURE_TOGGLE from '../../src/feature-toggle';

export default class AnimationPlayer {

    constructor(windowElement) {
        this.window = windowElement || window;
        this.requestId = null;
        this.playing = false;

        // FPS control
        if (FEATURE_TOGGLE.FPS_CONTROL) {
          this.fps = 3;
          this.now;
          this.lastTime = Date.now();
          this.interval = 1000/this.fps;
          this.delta;
        }

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
