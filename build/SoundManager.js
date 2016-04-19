"use strict";
var SoundManager = (function () {
    function SoundManager(game) {
        this.sounds = {};
        this.game = game;
    }
    SoundManager.prototype.addSound = function (key) {
        this.sounds[key] = this.game.add.audio(key, 1, false);
    };
    SoundManager.prototype.playSound = function (key) {
        var sound = this.sounds[key];
        if (sound !== null) {
            sound.play("", 0, 1, false, true);
        }
    };
    return SoundManager;
}());
exports.SoundManager = SoundManager;
