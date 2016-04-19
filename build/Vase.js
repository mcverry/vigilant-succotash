"use strict";
var DEBUG = true;
var Vase = (function () {
    function Vase(game, x, y, spriteName, clsn) {
        this.sprite = game.add.sprite(x, y, spriteName);
        game.physics.p2.enable([this.sprite], DEBUG);
        this.sprite.body.static = true;
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics", spriteName);
        this.sprite.body.setCollisionGroup(clsn.vaseCollisionGroup);
        this.sprite.body.collides([clsn.catCollisionGroup, clsn.pawCollisionGroup]);
    }
    return Vase;
}());
exports.Vase = Vase;
