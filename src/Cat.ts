const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";
import { CatTail } from "./Tail";
import { CatHead } from "./Head";
import { CatLeg } from "./Leg";

export class Cat {
	public catBody: Phaser.Sprite;
	private game: Phaser.Game;

	private legs: CatLeg[] = [];

	public constructor(game: Phaser.Game, myCollisions: CollisionManager, x: number, y: number, width: number, height: number) {
		this.game = game;

		this.catBody = game.add.sprite(x, y, 'invisible');
		this.game.physics.p2.enable(this.catBody, DEBUG);
		this.catBody.body.collideWorldBounds = true;
		this.catBody.body.setRectangle(width, height);

		let b: Phaser.Physics.P2.Body = this.catBody.body;
		b.applyForce([Math.random() * 10, Math.random() * 10], x, y);

		this.catBody.body.mass = 20;

		this.catBody.body.setCollisionGroup(myCollisions.catCollisionGroup);

		this.catBody.body.collides([myCollisions.vaseCollisionGroup]);

		let legData = [
			{	//front left leg
				x: x + (width / 2),
				y: y + (height / 2),
				attachX: width / 2,
				attachY: height / 2,
				isFrontLeg: true
			},
			{	//front right leg
				x: x + (width / 2),
				y: y + (height / 2),
				attachX: width / 2,
				attachY: height / 2,
				isFrontLeg: true
			},
			{	//hind left leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attachX: -width / 2,
				attachY: height / 2,
				isFrontLeg: false
			},
			{	//hind right leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attachX: -width / 2,
				attachY: height / 2,
				isFrontLeg: false
			}
		];

		for (let i :number = 0; i < legData.length; i++) {
			let leg: CatLeg = new CatLeg(
				this.game,
				myCollisions,
				this,
				legData[i].x,
				legData[i].y,
				legData[i].attachX,
				legData[i].attachY,
				legData[i].isFrontLeg
			);
			leg.setCollisionGroup(myCollisions.catCollisionGroup);
			leg.collides([myCollisions.vaseCollisionGroup]);
			this.legs.push(leg);
		}

		let tail = new CatTail(this.game, this, x - (width/2), y - (height/2), -width / 2, -height / 2);
		tail.setCollisionGroup(myCollisions.catCollisionGroup);
		tail.collides([myCollisions.vaseCollisionGroup]);

		let head = new CatHead(this.game, this, x + (width/2), y - (height/2), width / 2, -height / 2);
		head.setCollisionGroup(myCollisions.catCollisionGroup);
		head.collides([myCollisions.vaseCollisionGroup]);

	}

	public getHandles(): Phaser.Physics.P2.Body[]
	{
		return this.legs.map(function(leg) { return leg.getHandle() });
	}
}
