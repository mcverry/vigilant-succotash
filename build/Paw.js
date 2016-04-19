"use strict";
var DEBUG = false;
var Paw = (function () {
    function Paw(game, cat, collisions, x, y, legbottom, attachX, attachY) {
        this.MAX_FORCE = 20000;
        this.inContact = false;
        this.hasMouse = false;
        this.dragCount = 0;
        this.game = game;
        this.sprite = new Phaser.Sprite(game, x, y, "cat_paw_blue");
        cat.getSpriteGroup().add(this.sprite);
        this.myCollisions = collisions;
        this.game.physics.p2.enable(this.sprite, DEBUG);
        this.sprite.body.setCollisionGroup(collisions.catCollisionGroup);
        this.sprite.body.collides(collisions.elementsCollisionGroup);
        this.sprite.body.onBeginContact.add(this.contactBegan, this, 0);
        this.sprite.body.onEndContact.add(this.contactEnded, this, 0);
        this.sprite.body.paw = this;
        game.physics.p2.createRevoluteConstraint(this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE);
    }
    Paw.prototype.stick = function () {
        this.sprite.body.static = true;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.angularVelocity = 0;
        this.sprite.loadTexture("cat_paw_black");
    };
    Paw.prototype.unstick = function () {
        this.sprite.loadTexture("cat_paw_blue");
        this.sprite.body.static = false;
        this.sprite.body.dynamic = true;
    };
    Paw.prototype.beginDrag = function (isMouse) {
        if (isMouse === void 0) { isMouse = false; }
        this.dragCount++;
        this.unstick();
        if (isMouse) {
            this.hasMouse = true;
        }
        this.sprite.loadTexture((this.hasMouse ? "cat_paw_green" : "cat_paw_red"));
    };
    Paw.prototype.endDrag = function (isMouse) {
        if (isMouse === void 0) { isMouse = false; }
        this.dragCount--;
        if (this.inContact) {
            this.stick();
        }
        else {
            if (isMouse) {
                this.hasMouse = false;
            }
            if (this.dragCount > 0) {
                this.sprite.loadTexture(this.hasMouse ? "cat_paw_green" : "cat_paw_red");
            }
            else if (this.isTouchy()) {
                this.sprite.loadTexture("cat_paw_black");
            }
            else {
                this.sprite.loadTexture("cat_paw_blue");
            }
        }
    };
    Paw.prototype.contactBegan = function (otherBody, otherShape, myShape, contactEq) {
        if (otherBody != null) {
            this.inContact = true;
            if (this.dragCount <= 0) {
                this.stick();
            }
        }
    };
    Paw.prototype.contactEnded = function (otherBody, otherShape, myShape, contactEq) {
        if (otherBody != null) {
            this.inContact = false;
        }
    };
    Paw.prototype.isTouchy = function () {
        return this.inContact || this.sprite.body.static;
    };
    Paw.prototype.getHandle = function () {
        return this.sprite.body;
    };
    Paw.prototype.getSprite = function () {
        return this.sprite;
    };
    Paw.prototype.setZIndex = function (zIndex) {
        this.sprite.z = zIndex;
    };
    Paw.prototype.getX = function () {
        return this.sprite.x;
    };
    Paw.prototype.getY = function () {
        return this.sprite.y;
    };
    Paw.prototype.setForceAngle = function (angle) {
        this.sprite.body.force.x = Math.sin(angle) * 100;
        this.sprite.body.force.y = Math.cos(angle) * 100;
    };
    return Paw;
}());
exports.Paw = Paw;
