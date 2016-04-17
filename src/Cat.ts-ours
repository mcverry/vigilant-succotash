const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";
import { CatTail } from "./Tail"
import { CatHead } from "./Head"

export class CatLeg {
	private MAX_FORCE: number = 20000;
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

	constructor(
		game: Phaser.Game,
		collisionManager: CollisionManager,
		body: Cat,
		x: number,
		y: number,
		attachX: number,
		attachY: number,
		isFrontLeg: boolean
	) {

		this.thighBone = game.add.sprite(x, y + (this.THIGH_BONE_LENGTH / 2), 'invisible', 1);
		this.shinBone = game.add.sprite(this.thighBone.x, this.thighBone.y + (this.thighBone.height / 2), 'invisible', 1);
		this.footBone = game.add.sprite(this.shinBone.x, this.shinBone.y + (this.shinBone.height / 2), 'invisible', 1);
		this.toeBone = game.add.sprite(this.footBone.x, this.footBone.y + (this.footBone.height / 2), 'invisible', 1);

		game.physics.p2.enable(this.thighBone, DEBUG);
		game.physics.p2.enable(this.shinBone, DEBUG);
		game.physics.p2.enable(this.footBone, DEBUG);
		game.physics.p2.enable(this.toeBone, DEBUG);

		let hip: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.thighBone,
			[-this.BONES_WIDTH / 2, -this.THIGH_BONE_LENGTH / 2],
			body.catBody,
			[attachX, attachY],
			this.MAX_FORCE);
		let knee: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.shinBone,
			[0, -this.SHIN_BONE_LENGTH / 2],
			this.thighBone,
			[0, this.THIGH_BONE_LENGTH / 2],
			this.MAX_FORCE);
		let ankle: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.footBone,
			[0, -this.FOOT_BONE_LENGTH / 2],
			this.shinBone,
			[0, this.SHIN_BONE_LENGTH / 2],
			this.MAX_FORCE);
		let meta: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
			this.toeBone,
			[0, -this.TOE_BONE_LENGTH / 2],
			this.footBone,
			[0, this.FOOT_BONE_LENGTH / 2],
			this.MAX_FORCE);

		this.thighBone.body.setRectangle(this.BONES_WIDTH, this.THIGH_BONE_LENGTH);
		this.shinBone.body.setRectangle(this.BONES_WIDTH, this.SHIN_BONE_LENGTH);
		this.footBone.body.setRectangle(this.BONES_WIDTH, this.FOOT_BONE_LENGTH);
		this.toeBone.body.setRectangle(this.BONES_WIDTH, this.TOE_BONE_LENGTH);

		hip.setLimits(-Math.PI / 4, Math.PI / 2);

		if (isFrontLeg) {
			knee.setLimits(0, Math.PI * 3 / 4);
			ankle.setLimits(-Math.PI / 4, Math.PI / 4);
		} else {
			knee.setLimits(-Math.PI * 3 / 4, -Math.PI / 6);
			ankle.setLimits(0, Math.PI / 4);
		}


		meta.setLimits(0, Math.PI / 6);
		// knee.setLimits(-Math.PI - this.KNEE_FOLD_ADJUST, 0);
		// ankle.setLimits(0, Math.PI - this.KNEE_FOLD_ADJUST);
		// meta.setLimits(0, Math.PI / 4);

		this.thighBone.body.mass = this.LEG_PART_MASS;
		this.shinBone.body.mass = this.LEG_PART_MASS;
		this.footBone.body.mass = this.LEG_PART_MASS;
		this.toeBone.body.mass = this.LEG_PART_MASS;

		hip.setStiffness(this.LEG_JOINT_STIFFNESS);
		knee.setStiffness(this.LEG_JOINT_STIFFNESS);
		ankle.setStiffness(this.LEG_JOINT_STIFFNESS);
		meta.setStiffness(this.LEG_JOINT_STIFFNESS);

		hip.setRelaxation(this.LEG_JOINT_RELAXATION);
		knee.setRelaxation(this.LEG_JOINT_RELAXATION);
		ankle.setRelaxation(this.LEG_JOINT_RELAXATION);
		meta.setRelaxation(this.LEG_JOINT_RELAXATION);


		this.paw = new Paw(
		 	game,
			collisionManager,
			0, 0,
			this.footBone,
			0, 0,
			DEBUG
		);
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.thighBone.body.setCollisionGroup(collisionGroup);
		this.shinBone.body.setCollisionGroup(collisionGroup);
		this.footBone.body.setCollisionGroup(collisionGroup);
		this.toeBone.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
		this.thighBone.body.collides(collisionGroup);
		this.shinBone.body.collides(collisionGroup);
		this.footBone.body.collides(collisionGroup);
		this.toeBone.body.collides(collisionGroup);
	}

	public getHandle(): Phaser.Physics.P2.Body
	{
		return this.paw.getHandle();
	}
}

export class Cat {
	public catBody: Phaser.Sprite;
	private game: Phaser.Game;

	private frontLeftLeg: CatLeg;
	private frontRightLeg: CatLeg;
	private backLeftLeg: CatLeg;
	private backRightLeg: CatLeg;

	public constructor(game: Phaser.Game, myCollisions: CollisionManager, x: number, y: number, width: number, height: number) {
		this.game = game;

		this.catBody = game.add.sprite(x, y, 'invisible');
		this.game.physics.p2.enable(this.catBody, DEBUG);
		this.catBody.body.collideWorldBounds = true;
		this.catBody.body.setRectangle(width, height);

		let b: Phaser.Physics.P2.Body = this.catBody.body;
		b.applyForce([Math.random() * 10, Math.random() * 10], x, y);

		this.catBody.body.mass = 20;

		this.frontLeftLeg = new CatLeg(this.game, myCollisions, this, x + (width / 2), y + (height / 2), width / 2, height / 2, true);
		this.frontRightLeg = new CatLeg(this.game, myCollisions, this, x + (width / 2), y + (height / 2), width / 2, height / 2, true);
		this.backLeftLeg = new CatLeg(this.game, myCollisions, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2, false);
		this.backRightLeg = new CatLeg(this.game, myCollisions, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2, false);


		this.catBody.body.setCollisionGroup(myCollisions.catCollisionGroup);
		this.frontLeftLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		this.frontRightLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		this.backLeftLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		this.backRightLeg.setCollisionGroup(myCollisions.catCollisionGroup);

		this.catBody.body.collides([myCollisions.vaseCollisionGroup]);
		this.frontLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		this.frontRightLeg.collides([myCollisions.vaseCollisionGroup]);
		this.backLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		this.backRightLeg.collides([myCollisions.vaseCollisionGroup]);

		let tail = new CatTail(this.game, this, x - (width/2), y - (height/2), -width / 2, -height / 2);
		tail.setCollisionGroup(myCollisions.catCollisionGroup);
		tail.collides([myCollisions.vaseCollisionGroup]);

		let head = new CatHead(this.game, this, x + (width/2), y - (height/2), width / 2, -height / 2);
		head.setCollisionGroup(myCollisions.catCollisionGroup);
		head.collides([myCollisions.vaseCollisionGroup]);

	}

	public getHandles(): Phaser.Physics.P2.Body[]
	{
		return [
			this.frontLeftLeg.getHandle(),
			this.frontRightLeg.getHandle(),
			this.backLeftLeg.getHandle(),
			this.backRightLeg.getHandle()];
	}
}
