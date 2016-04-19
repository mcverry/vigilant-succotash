"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DEBUG = false;
var CatBodyPart = (function (_super) {
    __extends(CatBodyPart, _super);
    function CatBodyPart(game, x, y, key, radius, clsn) {
        _super.call(this, game, x, y, key);
        this.radius = radius;
        game.physics.p2.enable(this, DEBUG);
        var bod = this.body;
        bod.collideWorldBounds = true;
        bod.setCircle(radius);
        bod.mass = 20;
        bod.setCollisionGroup(clsn.catCollisionGroup);
        bod.collides(clsn.catCollidesWith);
    }
    CatBodyPart.prototype.getLegAttachPoint = function () {
        return [0, 0];
    };
    CatBodyPart.prototype.getTailAttachPoint = function (reversed) {
        if (reversed === void 0) { reversed = false; }
        return reversed ? [-this.radius * 3 / 4, 0] : [this.radius * 3 / 4, 0];
    };
    CatBodyPart.prototype.getHeadAttachPoint = function (reversed) {
        if (reversed === void 0) { reversed = false; }
        return reversed ? [this.radius, 0] : [-this.radius, 0];
    };
    return CatBodyPart;
}(Phaser.Sprite));
exports.CatBodyPart = CatBodyPart;
var CatBody = (function () {
    function CatBody(game, cat, clsn, startX, startY) {
        this.RADIUS = 40;
        this.SEPERATION = 35;
        this.MAX_FORCE = 100000;
        this.chest = new CatBodyPart(game, startX, startY, DEBUG ? '' : cat.catName + 'cat_chest', this.RADIUS, clsn);
        this.belly = new CatBodyPart(game, startX + this.SEPERATION, startY, DEBUG ? '' : cat.catName + 'cat_belly', this.RADIUS, clsn);
        this.butt = new CatBodyPart(game, startX + (this.SEPERATION * 2), startY, DEBUG ? '' : cat.catName + 'cat_butt', this.RADIUS, clsn);
        var parts = [this.chest, this.belly, this.butt];
        cat.getSpriteGroup().add(this.chest);
        cat.getSpriteGroup().add(this.belly);
        cat.getSpriteGroup().add(this.butt);
        for (var i = 1; i < parts.length; i++) {
            var joint = game.physics.p2.createRevoluteConstraint(parts[i], [-this.SEPERATION / 2, 0], parts[i - 1], [this.SEPERATION / 2, 0], this.MAX_FORCE);
            joint.setLimits(-Math.PI / 6, Math.PI / 6);
        }
    }
    CatBody.prototype.loadCat = function (catName) {
        this.chest.loadTexture(catName + 'cat_chest');
        this.belly.loadTexture(catName + 'cat_belly');
        this.butt.loadTexture(catName + 'cat_butt');
    };
    CatBody.prototype.setZIndex = function (zIndex) {
        this.chest.z = zIndex;
        this.belly.z = zIndex;
        this.butt.z = zIndex;
    };
    return CatBody;
}());
exports.CatBody = CatBody;
