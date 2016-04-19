"use strict";
var DEBUG = false;
var Tail_1 = require("./Tail");
var Head_1 = require("./Head");
var Leg_1 = require("./Leg");
var Body_1 = require("./Body");
var Cat = (function () {
    function Cat(game, clsn, grp, x, y, width, height) {
        this.catName = "brown/";
        this.legs = [];
        this.game = game;
        this.spriteGroup = grp.catGroup;
        this.catBody = new Body_1.CatBody(game, this, clsn, x, y);
        var legData = [
            {
                x: x + (width / 2),
                y: y + (height / 2),
                attach: this.catBody.chest,
                isFrontLeg: true,
                leftRight: "left",
                frontBack: "front"
            },
            {
                x: x + (width / 2),
                y: y + (height / 2),
                attach: this.catBody.chest,
                isFrontLeg: true,
                leftRight: "right",
                frontBack: "front"
            },
            {
                x: x + (-width / 2),
                y: y + (height / 2),
                attach: this.catBody.butt,
                isFrontLeg: false,
                leftRight: "left",
                frontBack: "back"
            },
            {
                x: x + (-width / 2),
                y: y + (height / 2),
                attach: this.catBody.butt,
                isFrontLeg: false,
                leftRight: "right",
                frontBack: "back"
            }
        ];
        for (var i = 0; i < legData.length; i++) {
            var leg = new Leg_1.CatLeg(this.game, clsn, this, legData[i].x, legData[i].y, legData[i].attach, legData[i].frontBack, legData[i].leftRight);
            leg.setCollisionGroup(clsn.catCollisionGroup);
            leg.collides(clsn.catCollidesWith);
            this.legs.push(leg);
        }
        this.tail = new Tail_1.CatTail(this.game, this, x - (width / 2), y - (height / 2), this.catBody.butt);
        this.tail.setCollisionGroup(clsn.catCollisionGroup);
        this.tail.collides(clsn.catCollidesWith);
        this.head = new Head_1.CatHead(this.game, this, x - (width / 2), y - (height / 2), this.catBody.chest);
        this.head.setCollisionGroup(clsn.catCollisionGroup);
        this.head.collides(clsn.catCollidesWith);
        this.sortSprites();
    }
    Cat.prototype.loadCat = function (catName) {
        this.catName = catName;
        this.catBody.loadCat(catName);
        this.legs.forEach(function (leg) {
            leg.loadCat(catName);
        });
        this.tail.loadCat(catName);
        this.head.loadCat(catName);
    };
    Cat.prototype.sortSprites = function () {
        this.legs.forEach(function (leg) {
            leg.setZIndex({
                "left": 9,
                "right": 5
            });
            leg.getPaw().setZIndex(10);
        });
        this.catBody.setZIndex(7);
        this.tail.setZIndex(6);
        this.head.setZIndex(8);
        this.getSpriteGroup().sort('z', Phaser.Group.SORT_ASCENDING);
    };
    Cat.prototype.getX = function () {
        return this.catBody.belly.x;
    };
    Cat.prototype.getY = function () {
        return this.catBody.belly.y;
    };
    Cat.prototype.getHead = function () {
        return this.head;
    };
    Cat.prototype.enablePaws = function (frontBack, e) {
        this.legs.forEach(function (leg) {
            if (leg.getFrontBack() == frontBack) {
                if (e) {
                    leg.getPaw().beginDrag();
                }
                else {
                    leg.getPaw().endDrag();
                }
            }
        });
    };
    Cat.prototype.anyPawsTouchy = function () {
        var touchy = false;
        this.legs.forEach(function (leg) {
            if (leg.getPaw().isTouchy()) {
                touchy = true;
                return;
            }
        });
        return touchy;
    };
    Cat.prototype.getHandles = function () {
        return this.legs.map(function (leg) { return leg.getHandle(); });
    };
    Cat.prototype.getSpriteGroup = function () {
        return this.spriteGroup;
    };
    return Cat;
}());
exports.Cat = Cat;
