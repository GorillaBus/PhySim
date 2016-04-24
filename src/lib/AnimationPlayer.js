var AnimationPlayer = {
    window: null,
    requestId: null,
    playing: false,
    create: function(windowElement) {
        var Player = Object.create(this);
        Player.window = windowElement || window;
        return Player;
    },
    play: function() {
        this.playing = true;
        this.requestId = this.window.requestAnimationFrame(this.updateFn);
    },
    stop: function() {
        if (!this.playing) {
            return false;
        }
        this.window.cancelAnimationFrame(this.requestId);
        this.playing = false;
        this.requestId = null;
    },
    setUpdateFn: function(updateFn) {
        this.updateFn = updateFn;
    },
    updateFn: function() {
        console.warn("Player update function has not been set.");
    }
};

module.exports = AnimationPlayer;
