import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";
import { Cat } from "./cat";
import { CatBodyPart } from "./Body";

const DEBUG = false;

export class CatLeg {
	private MAX_FORCE: number = 100000;
	private KNEE_FOLD_ADJUST: number = 0.5;
	private LEG_PART_MASS = 10;

	private BONES_WIDTH = 15;
	private THIGH_BONE_LENGTH = 40;
	private SHIN_BONE_LENGTH = 30;
	private FOOT_BONE_LENGTH = 20;
	private TOE_BONE_LENGTH = 10;

	private LEG_JOINT_STIFFNESS = 20000;
	private LEG_JOINT_RELAXATION = 3;

	private thighBone: Phaser.Sprite;
	private shinBone: Phaser.Sprite;
	private footBone: Phaser.Sprite;
	private toeBone: Phaser.Sprite;

	private paw: Paw;

	private frontBack: string;
	private leftRight: string;

	constructor(
		game: Phaser.Game,
		collisionManager: CollisionManager,
		cat: Cat,
		x: number,
		y: number,
		attach: CatBodyPart,
		frontBack : string,
		leftRight: string
	) {

		this.frontBack = frontBack;
		this.leftRight = leftRight;

		let isFrontLeg = frontBack == "front";

		console.log('cat_' + leftRight + "_" + frontBack + '_thigh');
		this.thighBone = new Phaser.Sprite(game, x, y + (this.THIGH_BONE_LENGTH / 2), 'cat_' + leftRight + "_" + frontBack + '_thigh', 1);
		this.shinBone = new Phaser.Sprite(game, this.thighBone.x, this.thighBone.y + (this.thighBone.height / 2), 'cat_' + leftRight + "_" + frontBack + '_shin', 1);
		if (!isFrontLeg) {
			this.footBone = new Phaser.Sprite(game, this.shinBone.x, this.shinBone.y + (this.shinBone.height / 2), 'cat_' + leftRight + "_" + frontBack + '_foot', 1);
			this.toeBone = new Phaser.Sprite(game, this.footBone.x, this.footBone.y + (this.footBone.height / 2), 'cat_' + leftRight + "_" + frontBack + '_toe', 1);
		} else {
			this.toeBone = new Phaser.Sprite(game, this.shinBone.x, this.shinBone.y + (this.shinBone.height / 2), 'cat_' + leftRight + "_" + frontBack + '_toe', 1);
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

		let hip: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.thighBone,
			[-this.BONES_WIDTH / 2, -this.THIGH_BONE_LENGTH / 2],
			attach,
			attach.getLegAttachPoint(),
			this.MAX_FORCE);
		let knee: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.shinBone,
			[0, -this.SHIN_BONE_LENGTH / 2],
			this.thighBone,
			[0, this.THIGH_BONE_LENGTH / 2],
			this.MAX_FORCE);
		let ankle: Phaser.Physics.P2.RevoluteConstraint;
		let meta: Phaser.Physics.P2.RevoluteConstraint;
		if (isFrontLeg) {
			ankle = game.physics.p2.createRevoluteConstraint(
				this.toeBone,
				[0, -this.TOE_BONE_LENGTH / 2],
				this.shinBone,
				[0, this.SHIN_BONE_LENGTH / 2],
				this.MAX_FORCE);
		} else {
			ankle = game.physics.p2.createRevoluteConstraint(
				this.footBone,
				[0, -this.FOOT_BONE_LENGTH / 2],
				this.shinBone,
				[0, this.SHIN_BONE_LENGTH / 2],
				this.MAX_FORCE);
			meta = game.physics.p2.createRevoluteConstraint(
				this.toeBone,
				[0, -this.TOE_BONE_LENGTH / 2],
				this.footBone,
				[0, this.FOOT_BONE_LENGTH / 2],
				this.MAX_FORCE);
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
		} else {
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


		this.paw = new Paw(
			game,
			cat,
			collisionManager,
			0, 0,
			this.toeBone,
			0, 0
		);
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.thighBone.body.setCollisionGroup(collisionGroup);
		this.shinBone.body.setCollisionGroup(collisionGroup);
		if (this.frontBack == "back") {
			this.footBone.body.setCollisionGroup(collisionGroup);
		}
		this.toeBone.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: Phaser.Physics.P2.CollisionGroup[]) {
		this.thighBone.body.collides(collisionGroup);
		this.shinBone.body.collides(collisionGroup);
		if (this.frontBack == "back") {
			this.footBone.body.collides(collisionGroup);
		}
		this.toeBone.body.collides(collisionGroup);
	}

	public setZIndex(zIndexes: Object) {
		this.thighBone.z = zIndexes[this.leftRight];
		this.shinBone.z = zIndexes[this.leftRight];
		if (this.frontBack == "back") {
			this.footBone.z = zIndexes[this.leftRight];
		}
		this.toeBone.z = zIndexes[this.leftRight];
	}

	public getPaw(): Paw {
		return this.paw;
	}

	public getHandle(): Phaser.Physics.P2.Body
	{
		return this.paw.getHandle();
	}
}
