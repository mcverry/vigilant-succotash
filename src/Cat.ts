const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";
import { Paw } from "./paw";
import { CatTail } from "./Tail";
import { CatHead } from "./Head";
import { CatLeg } from "./Leg";
import { CatBody } from "./Body";

export class Cat {
	public catBody: CatBody;
	private game: Phaser.Game;

	private legs: CatLeg[] = [];

	public constructor(
		game: Phaser.Game,
		clsn: CollisionManager,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.game = game;

		this.catBody = new CatBody(game, this, clsn, x, y);

		let legData = [
			{	//front left leg
				x: x + (width / 2),
				y: y + (height / 2),
				attach: this.catBody.chest,
				isFrontLeg: true
			},
			{	//front right leg
				x: x + (width / 2),
				y: y + (height / 2),
				attach: this.catBody.chest,
				isFrontLeg: true
			},
			{	//hind left leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attach: this.catBody.butt,
				isFrontLeg: false
			},
			{	//hind right leg
				x: x + (-width / 2),
				y: y + (height / 2),
				attach: this.catBody.butt,
				isFrontLeg: false
			}
		];

		for (let i :number = 0; i < legData.length; i++) {
			let leg: CatLeg = new CatLeg(
				this.game,
				clsn,
				this,
				legData[i].x,
				legData[i].y,
				legData[i].attach,
				legData[i].isFrontLeg
			);
			leg.setCollisionGroup(clsn.catCollisionGroup);
			leg.collides([clsn.vaseCollisionGroup]);
			this.legs.push(leg);
		}

		let tail = new CatTail(this.game, x - (width / 2), y - (height / 2), this.catBody.butt);
		tail.setCollisionGroup(clsn.catCollisionGroup);
		tail.collides([clsn.vaseCollisionGroup]);

		let head = new CatHead(this.game, x - (width / 2), y - (height / 2), this.catBody.chest);
		head.setCollisionGroup(clsn.catCollisionGroup);
		head.collides([clsn.vaseCollisionGroup]);
	}

	public getHandles(): Phaser.Physics.P2.Body[]
	{
		return this.legs.map(function(leg) { return leg.getHandle() });
	}
}
