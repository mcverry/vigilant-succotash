const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";

export class CatHead {
	private HEAD_MASS: number = 10;
	private MAX_FORCE: number = 20000;

	private headHeight: number = 60;
	private headWidth: number = 60;

	private headPhys: Phaser.Sprite;

	constructor(
		game: Phaser.Game,
		body: Cat,
		x: number,
		y: number,
		attachX: number,
		attachY: number) {
			this.headPhys = game.add.sprite(x, y, "cat_head", 1);
			game.physics.p2.enable(this.headPhys, DEBUG);
			this.headPhys.body.setRectangle(this.headWidth, this.headHeight);
			this.headPhys.body.mass = this.HEAD_MASS;
			let neck: Phaser.Physics.P2.RevoluteConstraint
				= game.physics.p2.createRevoluteConstraint(
					this.headPhys,
					[0, 0],
					body.catBody,
					[attachX, attachY],
					this.MAX_FORCE);
			//neck.setLimits(-Math.PI / 2, Math.PI / 2);
		}

		public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
			this.headPhys.body.setCollisionGroup(collisionGroup);
		}

		public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
			this.headPhys.body.collides(collisionGroup);
		}
}

export class CatTail {
	private JOINT_MASS: number = 5;
	private MAX_FORCE: number = 20000;

	private jointCount: number = 8;
	private jointLength: number = 25;
	private jointWidth: number = 7;
	private tailFlex: number = Math.PI / 4;

	private tailJoints: Array<Phaser.Sprite> = [];

	constructor(
		game: Phaser.Game,
		body: Cat,
		x: number,
		y: number,
		attachX: number,
		attachY: number) {
			let joint: Phaser.Sprite = game.add.sprite(x + this.jointLength*0.5, y, "cat_tail", 1);
			game.physics.p2.enable(joint, DEBUG);
			joint.body.setRectangle(this.jointLength, this.jointWidth);
			joint.body.mass = this.JOINT_MASS;
			let butt: Phaser.Physics.P2.RevoluteConstraint
				= game.physics.p2.createRevoluteConstraint(
					joint,
					[this.jointLength*0.5, this.jointWidth*0.5],
					body.catBody,
					[attachX, attachY],
					this.MAX_FORCE);
			butt.setLimits(-Math.PI / 2, Math.PI / 2);
			this.tailJoints.push(joint);
			for(let i: number = 1; i < this.jointCount; ++i) {
				let lastX: number = x;
				let lastY: number = y;
				x -= this.jointLength;

				let lastJoint: Phaser.Sprite = this.tailJoints[i-1];
				joint = game.add.sprite(x + this.jointLength*0.5, y + this.jointWidth*0.5, "cat_tail", 1);
				game.physics.p2.enable(joint, DEBUG);
				let tailConstraint: Phaser.Physics.P2.RevoluteConstraint
					= game.physics.p2.createRevoluteConstraint(
						joint,
						[this.jointLength*0.5, 0],
						lastJoint,
						[-this.jointLength*0.5, 0],
						this.MAX_FORCE);
				joint.body.setRectangle(this.jointLength, this.jointWidth);
				joint.body.mass = this.JOINT_MASS;
				tailConstraint.setLimits(-this.tailFlex, this.tailFlex);
				this.tailJoints.push(joint);
			}
		}

		public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
			for(let i: number = 0; i < this.tailJoints.length; ++i) {
				this.tailJoints[i].body.setCollisionGroup(collisionGroup);
			}
		}

		public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
			for(let i: number = 0; i < this.tailJoints.length; ++i) {
				this.tailJoints[i].body.collides(collisionGroup);
			}
		}
}

export class CatLeg {
	private MAX_FORCE: number = 20000;
	private KNEE_FOLD_ADJUST: number = 0.5;
	private LEG_PART_MASS = 20;

	private BONES_WIDTH = 10;
	private THIGH_BONE_LENGTH = 30;
	private SHIN_BONE_LENGTH = 20;
	private FOOT_BONE_LENGTH = 10;
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

		if (isFrontLeg) {
			hip.setLimits(0, Math.PI / 3);
		} else {
			hip.setLimits(-Math.PI / 3, 0);
		}

		knee.setLimits(-Math.PI - this.KNEE_FOLD_ADJUST, 0);
		ankle.setLimits(0, Math.PI - this.KNEE_FOLD_ADJUST);
		meta.setLimits(0, Math.PI / 4);

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
		this.catBody.body.mass = 20;

		let frontLeftLeg = new CatLeg(this.game, myCollisions, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2, true);
		let frontRightLeg = new CatLeg(this.game, myCollisions, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2, true);
		let backLeftLeg = new CatLeg(this.game, myCollisions, this, x + (width / 2), y + (height / 2), width / 2, height / 2, false);
		let backRightLeg = new CatLeg(this.game, myCollisions, this, x + (width / 2), y + (height / 2), width / 2, height / 2, false);

		this.frontLeftLeg = frontLeftLeg;
		this.frontRightLeg = frontRightLeg;
		this.backLeftLeg = backLeftLeg;
		this.backRightLeg = backRightLeg;

		this.catBody.body.setCollisionGroup(myCollisions.catCollisionGroup);
		frontLeftLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		frontRightLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		backLeftLeg.setCollisionGroup(myCollisions.catCollisionGroup);
		backRightLeg.setCollisionGroup(myCollisions.catCollisionGroup);

		this.catBody.body.collides([myCollisions.vaseCollisionGroup]);
		frontLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		frontRightLeg.collides([myCollisions.vaseCollisionGroup]);
		backLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		backRightLeg.collides([myCollisions.vaseCollisionGroup]);

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
