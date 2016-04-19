"use strict";
var DEBUG = false;
var SHOW_SENSORS = false;
var ZoneSensor = (function () {
    function ZoneSensor(key, game, collisions, enabled, x, y, shape) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (shape === void 0) { shape = null; }
        this.entries = 0;
        this.onCatEntered = new Phaser.Signal();
        this.onCatLeft = new Phaser.Signal();
        this.zoneKey = key;
        this.game = game;
        this.myCollisions = collisions;
        this.sprite = game.add.sprite(x, y, (SHOW_SENSORS ? "sensor" : "invisible"));
        this.enabled = enabled;
        this.game.physics.p2.enable(this.sprite, DEBUG);
        if (shape != null) {
            this.setShape(shape);
        }
        this.sprite.body.static = true;
        this.sprite.body.onBeginContact.add(this.catContacted, this, 0);
        this.sprite.body.onEndContact.add(this.catUnContacted, this, 0);
    }
    ZoneSensor.prototype.setEnabled = function (e) {
        this.enabled = e;
        if (this.entries > 0) {
            this.onCatEntered.dispatch(this.zoneKey, null, null, null);
        }
    };
    ZoneSensor.prototype.setShape = function (shape) {
        this.sprite.body.clearShapes();
        shape.sensor = true;
        this.sprite.body.addShape(shape.sensor);
        this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
        this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
    };
    ZoneSensor.prototype.setCenter = function (x, y) {
        this.sprite.body.x = x;
        this.sprite.body.y = y;
    };
    ZoneSensor.prototype.asCircle = function (x, y, radius) {
        this.setCenter(x, y);
        this.sprite.body.clearShapes();
        this.sprite.body.setCircle(radius);
        this.sprite.body.data.shapes[0].sensor = true;
        this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
        this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
    };
    ZoneSensor.prototype.asRectangle = function (x1, y1, x2, y2) {
        var width = x2 - x1;
        var height = y2 - y1;
        this.setCenter(x1 + (0.5 * width), y1 + (0.5 * height));
        this.sprite.body.clearShapes();
        this.sprite.body.setRectangle(width, height);
        this.sprite.body.data.shapes[0].sensor = true;
        this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
        this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
    };
    ZoneSensor.prototype.catContacted = function (otherBody, otherShape, myShape, contactEq) {
        if (otherBody != null) {
            if (this.entries == 0 && this.enabled) {
                this.onCatEntered.dispatch(this.zoneKey, otherBody, otherShape, myShape);
            }
            this.entries++;
        }
    };
    ZoneSensor.prototype.catUnContacted = function (otherBody, otherShape, myShape, contactEq) {
        if (otherBody != null) {
            --this.entries;
            if (this.entries == 0 && this.enabled) {
                this.onCatLeft.dispatch(this.zoneKey, otherBody, otherShape, myShape);
            }
        }
    };
    return ZoneSensor;
}());
exports.ZoneSensor = ZoneSensor;
