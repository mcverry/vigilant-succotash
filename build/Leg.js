"use strict";
var paw_1 = require("./paw");
var DEBUG = false;
var CatLeg = (function () {
    function CatLeg(game, collisionManager, cat, x, y, attach, frontBack, leftRight) {
        this.MAX_FORCE = 100000;
        this.KNEE_FOLD_ADJUST = 0.5;
        this.LEG_PART_MASS = 10;
        this.BONES_WIDTH = 15;
        this.THIGH_BONE_LENGTH = 40;
        this.SHIN_BONE_LENGTH = 30;
        this.FOOT_BONE_LENGTH = 20;
        this.TOE_BONE_LENGTH = 10;
        this.LEG_JOINT_STIFFNESS = 20000;
        this.LEG_JOINT_RELAXATION = 3;
        this.frontBack = frontBack;
        this.leftRight = leftRight;
        var isFrontLeg = frontBack == "front";
        this.thighBone = new Phaser.Sprite(game, x, y + (this.THIGH_BONE_LENGTH / 2), cat.catName + 'cat_' + leftRight + "_" + frontBack + '_thigh', 1);
        this.shinBone = new Phaser.Sprite(game, this.thighBone.x, this.thighBone.y + (this.thighBone.height / 2), cat.catName + 'cat_' + leftRight + "_" + frontBack + '_shin', 1);
        if (!isFrontLeg) {
            this.footBone = new Phaser.Sprite(game, this.shinBone.x, this.shinBone.y + (this.shinBone.height / 2), cat.catName + 'cat_' + leftRight + "_" + frontBack + '_foot', 1);
            this.toeBone = new Phaser.Sprite(game, this.footBone.x, this.footBone.y + (this.footBone.height / 2), cat.catName + 'cat_' + leftRight + "_" + frontBack + '_toe', 1);
        }
        else {
            this.toeBone = new Phaser.Sprite(game, this.shinBone.x, this.shinBone.y + (this.shinBone.height / 2), cat.catName + 'cat_' + leftRight + "_" + frontBack + '_toe', 1);
        }
        cat.getSpriteGroup().add(this.thighBone);
        cat.getSpriteGroup().add(this.shinBone);
        if (!isFrontLeg) {
            cat.getSpriteGroup().add(this.footBone);
        }
        cat.getSpriteGroup().add(this.toeBone);
        game.physics.p2.enable(this.thighBone, DEBUG);
        game.physics.p2.enable(this.shinBone, DEBUG);
        if (!isFrontLeg) {
            game.physics.p2.enable(this.footBone, DEBUG);
        }
        game.physics.p2.enable(this.toeBone, DEBUG);
        var hip = game.physics.p2.createRevoluteConstraint(this.thighBone, [-this.BONES_WIDTH / 2, -this.THIGH_BONE_LENGTH / 2], attach, attach.getLegAttachPoint(), this.MAX_FORCE);
        var knee = game.physics.p2.createRevoluteConstraint(this.shinBone, [0, -this.SHIN_BONE_LENGTH / 2], this.thighBone, [0, this.THIGH_BONE_LENGTH / 2], this.MAX_FORCE);
        var ankle;
        var meta;
        if (isFrontLeg) {
            ankle = game.physics.p2.createRevoluteConstraint(this.toeBone, [0, -this.TOE_BONE_LENGTH / 2], this.shinBone, [0, this.SHIN_BONE_LENGTH / 2], this.MAX_FORCE);
        }
        else {
            ankle = game.physics.p2.createRevoluteConstraint(this.footBone, [0, -this.FOOT_BONE_LENGTH / 2], this.shinBone, [0, this.SHIN_BONE_LENGTH / 2], this.MAX_FORCE);
            meta = game.physics.p2.createRevoluteConstraint(this.toeBone, [0, -this.TOE_BONE_LENGTH / 2], this.footBone, [0, this.FOOT_BONE_LENGTH / 2], this.MAX_FORCE);
        }
        this.thighBone.body.setRectangle(this.BONES_WIDTH, this.THIGH_BONE_LENGTH);
        this.shinBone.body.setRectangle(this.BONES_WIDTH, this.SHIN_BONE_LENGTH);
        if (!isFrontLeg) {
            this.footBone.body.setRectangle(this.BONES_WIDTH, this.FOOT_BONE_LENGTH);
        }
        this.toeBone.body.setRectangle(this.BONES_WIDTH, this.TOE_BONE_LENGTH);
        if (isFrontLeg) {
            hip.setLimits(-Math.PI / 2, Math.PI / 4);
            knee.setLimits(-Math.PI * 3 / 4, -Math.PI / 6);
            ankle.setLimits(0, Math.PI / 4);
        }
        else {
            hip.setLimits(-Math.PI / 4, Math.PI / 2);
            knee.setLimits(0, Math.PI * 3 / 4);
            ankle.setLimits(-Math.PI / 4, Math.PI / 4);
            meta.setLimits(0, Math.PI / 6);
        }
        this.thighBone.body.mass = this.LEG_PART_MASS;
        this.shinBone.body.mass = this.LEG_PART_MASS;
        if (!isFrontLeg) {
            this.footBone.body.mass = this.LEG_PART_MASS;
        }
        this.toeBone.body.mass = this.LEG_PART_MASS;
        hip.setStiffness(this.LEG_JOINT_STIFFNESS);
        knee.setStiffness(this.LEG_JOINT_STIFFNESS);
        ankle.setStiffness(this.LEG_JOINT_STIFFNESS);
        if (!isFrontLeg) {
            meta.setStiffness(this.LEG_JOINT_STIFFNESS);
        }
        hip.setRelaxation(this.LEG_JOINT_RELAXATION);
        knee.setRelaxation(this.LEG_JOINT_RELAXATION);
        ankle.setRelaxation(this.LEG_JOINT_RELAXATION);
        if (!isFrontLeg) {
            meta.setRelaxation(this.LEG_JOINT_RELAXATION);
        }
        this.paw = new paw_1.Paw(game, cat, collisionManager, this.toeBone.x, this.toeBone.y, this.toeBone, 0, 0);
    }
    CatLeg.prototype.loadCat = function (catName) {
        this.thighBone.loadTexture(catName + 'cat_' + this.leftRight + "_" + this.frontBack + '_thigh');
        this.shinBone.loadTexture(catName + 'cat_' + this.leftRight + "_" + this.frontBack + '_shin');
        if (this.frontBack != 'front') {
            this.footBone.loadTexture(catName + 'cat_' + this.leftRight + "_" + this.frontBack + '_foot');
            this.toeBone.loadTexture(catName + 'cat_' + this.leftRight + "_" + this.frontBack + '_toe');
        }
        else {
            this.toeBone.loadTexture(catName + 'cat_' + this.leftRight + "_" + this.frontBack + '_toe');
        }
    };
    CatLeg.prototype.setCollisionGroup = function (collisionGroup) {
        this.thighBone.body.setCollisionGroup(collisionGroup);
        this.shinBone.body.setCollisionGroup(collisionGroup);
        if (this.frontBack == "back") {
            this.footBone.body.setCollisionGroup(collisionGroup);
        }
        this.toeBone.body.setCollisionGroup(collisionGroup);
    };
    CatLeg.prototype.collides = function (collisionGroup) {
        this.thighBone.body.collides(collisionGroup);
        this.shinBone.body.collides(collisionGroup);
        if (this.frontBack == "back") {
            this.footBone.body.collides(collisionGroup);
        }
        this.toeBone.body.collides(collisionGroup);
    };
    CatLeg.prototype.setZIndex = function (zIndexes) {
        this.thighBone.z = zIndexes[this.leftRight];
        this.shinBone.z = zIndexes[this.leftRight];
        if (this.frontBack == "back") {
            this.footBone.z = zIndexes[this.leftRight];
        }
        this.toeBone.z = zIndexes[this.leftRight];
    };
    CatLeg.prototype.getPaw = function () {
        return this.paw;
    };
    CatLeg.prototype.getFrontBack = function () {
        return this.frontBack;
    };
    CatLeg.prototype.getHandle = function () {
        return this.paw.getHandle();
    };
    return CatLeg;
}());
exports.CatLeg = CatLeg;
