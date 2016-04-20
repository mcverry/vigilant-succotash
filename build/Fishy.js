"use strict";
var Fishy = (function () {
    function Fishy(game, collisions, xFrom, yFrom, xTo, yTo, speed) {
        this.time = 0;
        this.bobRate = 1.5 * Math.PI;
        this.bobAmplitude = 2;
        this.onEaten = new Phaser.Signal();
        this.game = game;
        this.myCollisions = collisions;
        this.xFrom = xFrom;
        this.yFrom = yFrom;
        this.xTo = xTo;
        this.yTo = yTo;
        this.speed = speed;
        this.sprite = this.game.add.sprite(this.xFrom, this.yFrom, "fishy");
        this.game.physics.p2.enable(this.sprite, false);
        this.sprite.body.setCollisionGroup(this.myCollisions.fishCollisionGroup);
        this.sprite.body.collides(this.myCollisions.catCollisionGroup, this.touchy, this);
        this.sprite.body.kinematic = true;
        this.game.time.events.loop(Phaser.Timer.SECOND * (1 / 30), this.update, this);
        var dx = this.xTo - this.xFrom;
        var dy = this.yTo - this.yFrom;
        var len = Math.sqrt(dx * dx + dy * dy);
        dx = dx / len;
        dy = dy / len;
        this.sprite.body.velocity.x = dx * speed;
        this.sprite.body.velocity.y = dy * speed;
        if (this.xTo < this.xFrom) {
            var tempX = this.xFrom;
            var tempY = this.yFrom;
            this.xFrom = this.xTo;
            this.yFrom = this.yTo;
            this.xTo = tempX;
            this.yFrom = tempY;
        }
        else {
            this.sprite.scale.x *= -1;
        }
    }
    Fishy.prototype.touchy = function (myBody, otherBody, myShape, otherShape) {
        if (otherBody.sprite.key.indexOf("cat_head") >= 0) {
            this.onEaten.dispatch();
            this.sprite.destroy();
            this.sprite = null;
        }
    };
    Fishy.prototype.update = function () {
        var rate = 1 / 30;
        if (this.sprite != null) {
            if (this.sprite.body.x > this.xTo || this.sprite.body.x < (this.xFrom - 10)) {
                this.sprite.scale.x *= -1;
                this.sprite.body.velocity.x *= -1;
                this.sprite.body.velocity.y *= -1;
            }
            this.time += rate;
            this.sprite.body.y += Math.sin(this.time * this.bobRate) * this.bobAmplitude;
        }
    };
    return Fishy;
}());
exports.Fishy = Fishy;
