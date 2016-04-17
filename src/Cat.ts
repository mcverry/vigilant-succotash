const DEBUG:boolean = false;

import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";
import { CatTail } from "./Tail";
import { CatHead } from "./Head";
import { CatLeg } from "./Leg";
import { CatBody } from "./Body";

export class Cat {
	public catBody: CatBody;
	private game: Phaser.Game;

	private spriteGroup: Phaser.Group;

	private legs: CatLeg[] = [];
	private head: CatHead;
	private tail: CatTail;

	public constructor(
		game: Phaser.Game,
		clsn: CollisionManager,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.game = game;

		this.spriteGroup = game.add.group(undefined, 'cat', true);

		this.catBody = new CatBody(game, this, clsn, x, y);

		let legData = [
			{	//front left leg
				x: x + (width / 2),
				y: y + (height / 2),
				attach: this.catBody.chest,
				isFrontLeg: true,
				leftRight: "left",
				frontBack: "front"
			},
			{	//front right leg
				x: x + (width / 2),
				y: y + (height / 2),
				attach: this.catBody.chest,
				isFrontLeg: true,
				leftRight: "right",
				frontBack: "front"
			},
			{	//hind left leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attach: this.catBody.butt,
				isFrontLeg: false,
				leftRight: "left",
				frontBack: "back"
			},
			{	//hind right leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attach: this.catBody.butt,
				isFrontLeg: false,
				leftRight: "right",
				frontBack: "back"
			}
		];

		for (let i: number = 0; i < legData.length; i++) {
			let leg: CatLeg = new CatLeg(
				this.game,
				clsn,
				this,
				legData[i].x,
				legData[i].y,
				legData[i].attach,
				legData[i].frontBack,
				legData[i].leftRight
			);
			leg.setCollisionGroup(clsn.catCollisionGroup);
			leg.collides(clsn.catCollidesWith);
			this.legs.push(leg);
		}

		this.tail = new CatTail(this.game, this, x - (width / 2), y - (height / 2), this.catBody.butt);
		this.tail.setCollisionGroup(clsn.catCollisionGroup);
		this.tail.collides(clsn.catCollidesWith);


		this.head = new CatHead(this.game, this, x - (width / 2), y - (height / 2), this.catBody.chest);
		this.head.setCollisionGroup(clsn.catCollisionGroup);
		let headCollisions = [clsn.treatCollisionGroup];
		headCollisions = headCollisions.concat(clsn.catCollidesWith);
		this.head.collides(headCollisions);

		this.sortSprites();
	}

	private sortSprites() : void {
		//paw = 10
		//left legs = 9
		//head = 8
		//body = 7
		//tail = 6
		//right legs = 5

		this.legs.forEach(function(leg) {
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
	}

	public getX(): number {
		return this.catBody.belly.x;
	}
	public getY(): number {
		return this.catBody.belly.y;
	}

	public getHandles(): Phaser.Physics.P2.Body[]
	{
		return this.legs.map(function(leg) { return leg.getHandle() });
	}

	public getSpriteGroup() :Phaser.Group {
		return this.spriteGroup;
	}
}
