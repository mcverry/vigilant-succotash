"use strict";
var DEBUG = false;
var CatHead = (function () {
    function CatHead(game, cat, x, y, attach) {
        this.HEAD_MASS = 10;
        this.MAX_FORCE = 20000;
        x += attach.getHeadAttachPoint()[0];
        y += attach.getHeadAttachPoint()[1];
        this.headSprite = new Phaser.Sprite(game, x, y, cat.catName + "cat_head", 1);
        game.physics.p2.enable(this.headSprite, DEBUG);
        var headPhys = this.headSprite.body;
        headPhys.clearShapes();
        headPhys.loadPolygon('physics', 'cat-head');
        cat.getSpriteGroup().add(this.headSprite);
        this.headSprite.body.mass = this.HEAD_MASS;
        var neck = game.physics.p2.createRevoluteConstraint(this.headSprite, [0, 0], attach, attach.getHeadAttachPoint(), this.MAX_FORCE);
        neck.setLimits(-Math.PI / 4, Math.PI / 4);
    }
    CatHead.prototype.loadCat = function (catName) {
        this.headSprite.loadTexture(catName + "cat_head");
    };
    CatHead.prototype.setZIndex = function (zIndex) {
        this.headSprite.z = zIndex;
    };
    CatHead.prototype.setCollisionGroup = function (collisionGroup) {
        this.headSprite.body.setCollisionGroup(collisionGroup);
    };
    CatHead.prototype.collides = function (collisionGroup) {
        this.headSprite.body.collides(collisionGroup);
    };
    return CatHead;
}());
exports.CatHead = CatHead;
