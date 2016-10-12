export default class AnimationPlayer {

    constructor(windowElement) {
        this.window = windowElement || window;
        this.requestId = null;
        this.playing = false;
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
                updateFn();
            });
    }

    updateFn() {
        console.warn("Player update function has not been set.");
    }
}
