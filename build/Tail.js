"use strict";
var DEBUG = false;
var CatTail = (function () {
    function CatTail(game, cat, x, y, attach) {
        this.JOINT_MASS = 5;
        this.MAX_FORCE = 20000;
        this.jointCount = 8;
        this.jointLength = 15;
        this.jointWidth = 7;
        this.tailFlexMin = 0;
        this.tailFlexMax = Math.PI / 4;
        this.tailJoints = [];
        x += attach.getTailAttachPoint()[0];
        y += attach.getTailAttachPoint()[1];
        var joint = new Phaser.Sprite(game, x + this.jointLength * 0.5, y, cat.catName + "cat_tail_0", 1);
        cat.getSpriteGroup().add(joint);
        game.physics.p2.enable(joint, DEBUG);
        joint.body.setRectangle(this.jointLength, this.jointWidth);
        joint.body.mass = this.JOINT_MASS;
        var butt = game.physics.p2.createRevoluteConstraint(joint, [this.jointLength * 0.5, this.jointWidth * 0.5], attach, attach.getTailAttachPoint(), this.MAX_FORCE);
        butt.setLimits(0, 0);
        this.tailJoints.push(joint);
        for (var i = 1; i < this.jointCount; ++i) {
            var lastX = x;
            var lastY = y;
            x -= this.jointLength;
            var lastJoint = this.tailJoints[i - 1];
            joint = new Phaser.Sprite(game, x + this.jointLength * 0.5, y + this.jointWidth * 0.5, cat.catName + "cat_tail_" + i, 1);
            cat.getSpriteGroup().add(joint);
            game.physics.p2.enable(joint, DEBUG);
            var tailConstraint = game.physics.p2.createRevoluteConstraint(joint, [-this.jointLength * 0.5, 0], lastJoint, [this.jointLength * 0.5, 0], this.MAX_FORCE);
            joint.body.setRectangle(this.jointLength, this.jointWidth);
            joint.body.mass = this.JOINT_MASS;
            tailConstraint.setLimits(this.tailFlexMin, this.tailFlexMax);
            this.tailJoints.push(joint);
        }
    }
    CatTail.prototype.loadCat = function (catName) {
        for (var i = 0; i < this.tailJoints.length; ++i) {
            this.tailJoints[i].loadTexture(catName + "cat_tail_" + i);
        }
    };
    CatTail.prototype.setZIndex = function (zIndex) {
        this.tailJoints.forEach(function (joint, index) {
            joint.z = zIndex + (1 - (index / 10)) - 1;
        });
    };
    CatTail.prototype.setCollisionGroup = function (collisionGroup) {
        for (var i = 0; i < this.tailJoints.length; ++i) {
            this.tailJoints[i].body.setCollisionGroup(collisionGroup);
        }
    };
    CatTail.prototype.collides = function (collisionGroup) {
        for (var i = 0; i < this.tailJoints.length; ++i) {
            this.tailJoints[i].body.collides(collisionGroup);
        }
    };
    return CatTail;
}());
exports.CatTail = CatTail;
