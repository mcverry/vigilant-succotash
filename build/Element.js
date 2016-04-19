"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DEBUG = false;
var Element = (function (_super) {
    __extends(Element, _super);
    function Element(game, x, y, key, activeWorld) {
        _super.call(this, game, x, y, key);
        this.z = 20;
        this.game.physics.p2.enable(this, DEBUG);
        var body = this.body;
        var collisions = activeWorld.collisionManager;
        body.clearShapes();
        body.loadPolygon('physics', key);
        body.static = true;
        body.setCollisionGroup(collisions.elementsCollisionGroup);
        body.collides([collisions.catCollisionGroup, collisions.treatCollisionGroup], function () { }, this);
    }
    return Element;
}(Phaser.Sprite));
exports.Element = Element;
