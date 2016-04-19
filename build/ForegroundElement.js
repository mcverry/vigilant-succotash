"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ForegroundElement = (function (_super) {
    __extends(ForegroundElement, _super);
    function ForegroundElement(game, x, y, key, activeWorld) {
        _super.call(this, game, x, y, key);
        this.z = 30;
        var sensor = activeWorld.getZone(key);
        sensor.onCatEntered.add(function () {
            this.setTransparent(true);
        }, this);
        sensor.onCatLeft.add(function () {
            this.setTransparent(false);
        }, this);
    }
    ForegroundElement.prototype.setTransparent = function (isTransparent) {
        this.alpha = isTransparent ? 0.4 : 1;
    };
    return ForegroundElement;
}(Phaser.Sprite));
exports.ForegroundElement = ForegroundElement;
