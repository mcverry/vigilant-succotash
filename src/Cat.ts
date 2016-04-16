const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";

export class CatTail {
	private JOINT_MASS: number = 5;

	public joints: number = 10;
	public jointLength: number = 0.5;
}

export class CatLeg {
	private MAX_FORCE: number = 20000;
	private KNEE_FOLD_ADJUST: number = 0.5;
	private LEG_PART_MASS = 20;

	private width = 10;
	private height = 50;

	private legTop: Phaser.Sprite;
	private legMid: Phaser.Sprite;
	private legBot: Phaser.Sprite;

	constructor(
		game: Phaser.Game,
		body: Cat,
		x: number,
		y: number,
		attachX: number,
		attachY: number
	) {
		this.legTop = game.add.sprite(x, y + (this.height / 2), 'cat_leg', 1);
		game.physics.p2.enable(this.legTop, DEBUG);
		let hip : Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(this.legTop,
																									[-this.width / 2, -this.height / 2],
																									body.catBody,
																									[attachX, attachY],
																									this.MAX_FORCE);
		hip.setLimits(-Math.PI / 2, Math.PI / 2);
		this.legTop.body.setRectangle(this.width, this.height);
		this.legTop.body.mass = this.LEG_PART_MASS;

		this.legMid = game.add.sprite(this.legTop.x, this.legTop.y + (this.height / 2), 'cat_leg', 1);
		game.physics.p2.enable(this.legMid, DEBUG);
		this.legMid.body.setRectangle(this.width, this.height);
		this.legMid.body.mass = this.LEG_PART_MASS;
		let knee  : Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(this.legMid,
																									[0, -this.height / 2],
																									this.legTop,
																									[0, this.height / 2],
																									this.MAX_FORCE);
		knee.setLimits(-Math.PI - this.KNEE_FOLD_ADJUST, 0);

		this.legBot = game.add.sprite(this.legMid.x, this.legMid.y + (this.height / 2), 'cat_leg', 1);
		game.physics.p2.enable(this.legBot, DEBUG);
		this.legBot.body.setRectangle(this.width, this.height);
		this.legBot.body.mass = this.LEG_PART_MASS;
		let ankle: Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(this.legBot,
																									[0, -this.height / 2],
																									this.legMid,
																									[0, this.height / 2],
																									this.MAX_FORCE);
		ankle.setLimits(-Math.PI - this.KNEE_FOLD_ADJUST, 0);
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.legTop.body.setCollisionGroup(collisionGroup);
		this.legMid.body.setCollisionGroup(collisionGroup);
		this.legBot.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
		this.legTop.body.collides(collisionGroup);
		this.legMid.body.collides(collisionGroup);
		this.legBot.body.collides(collisionGroup);
	}
}

export class Cat {
	public catBody: Phaser.Sprite;
	private game: Phaser.Game;

	public constructor(game: Phaser.Game, myCollisions: CollisionManager, x: number, y: number, width: number, height: number) {
		this.game = game;

		this.catBody = game.add.sprite(x, y, 'cat_body');
		this.game.physics.p2.enable(this.catBody, DEBUG);
		this.catBody.body.collideWorldBounds = true;
		this.catBody.body.setRectangle(width, height);
		this.catBody.body.mass = 20;

		let frontLeftLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2);
		let frontRightLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2);
		let backLeftLeg = new CatLeg(this.game, this, x + (width / 2), y + (height / 2), width / 2, height / 2);
		let backRightLeg = new CatLeg(this.game, this, x + (width / 2), y + (height / 2), width / 2, height / 2);

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

	}
}
