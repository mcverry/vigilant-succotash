"use strict";
var DEBUG = false;
var Treat = (function () {
    function Treat(id, game, collisions, sounds, x, y, image, edible, radius) {
        if (image === void 0) { image = "fish_treat"; }
        if (edible === void 0) { edible = true; }
        if (radius === void 0) { radius = 14; }
        this.treatRadius = 14;
        this.TREAT_MASS = 15;
        this.edible = true;
        this.onCatGotTreat = new Phaser.Signal();
        this.treatID = id;
        this.game = game;
        this.myCollisions = collisions;
        this.edible = edible;
        this.treatRadius = radius;
        this.soundManager = sounds;
        this.sprite = game.add.sprite(x, y, image);
        this.game.physics.p2.enable(this.sprite, DEBUG);
        this.sprite.body.mass = this.TREAT_MASS;
        this.sprite.body.setRectangle(49, 23);
        this.sprite.body.setCollisionGroup(collisions.treatCollisionGroup);
        this.sprite.body.collides([collisions.catCollisionGroup, collisions.elementsCollisionGroup, collisions.wallsCollisionGroup], this.catCollided, this);
    }
    Treat.prototype.catCollided = function (myBody, otherBody, myShape, otherShape) {
        if (otherBody.sprite.key.contains("cat_head")) {
            this.onCatGotTreat.dispatch(this.treatID, myBody, otherBody, myShape, otherShape);
            this.soundManager.playSound("meow");
            this.sprite.destroy();
        }
    };
    return Treat;
}());
exports.Treat = Treat;
