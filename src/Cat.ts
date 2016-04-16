const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";

export class CatLeg {
	private MAX_FORCE: number = 20000;

	private width = 10;
	private height = 50;

	private legTop: Phaser.Sprite;

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
		game.physics.p2.createRevoluteConstraint(this.legTop, [-this.width / 2, -this.height / 2], body.catBody, [attachX, attachY], this.MAX_FORCE);

		this.legTop.body.setRectangle(this.width, this.height);
		this.legTop.body.mass = 10;
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.legTop.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
		this.legTop.body.collides(collisionGroup);
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
		this.catBody.body.velocity.x = 100;
		this.catBody.body.mass = 20;

		let frontLeftLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2);
		let frontRightLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2);
		let backLeftLeg = new CatLeg(this.game, this, x + (width / 2), y + (height / 2), width / 2, height / 2);
		let backRightLeg = new CatLeg(this.game, this, x + (width / 2), y + (height / 2), width / 2, height / 2);

		this.catBody.body.setCollisionGroup(myCollisions.bodyCollisionGroup);
		frontLeftLeg.setCollisionGroup(myCollisions.frontLeftLegCollisionGroup);
		frontRightLeg.setCollisionGroup(myCollisions.frontRightLegCollisionGroup);
		backLeftLeg.setCollisionGroup(myCollisions.backLeftLegCollisionGroup);
		backRightLeg.setCollisionGroup(myCollisions.backRightLegCollisionGroup);

		this.catBody.body.collides([myCollisions.vaseCollisionGroup]);
		frontLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		frontRightLeg.collides([myCollisions.vaseCollisionGroup]);
		backLeftLeg.collides([myCollisions.vaseCollisionGroup]);
		backRightLeg.collides([myCollisions.vaseCollisionGroup]);

	}
}

