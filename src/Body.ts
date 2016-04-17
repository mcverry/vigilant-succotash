import { CollisionManager } from "./CollisionManager";
import { Cat } from "./cat";

const DEBUG = true;

export class CatBodyPart extends Phaser.Sprite {
	private radius: number;
	constructor(game: Phaser.Game, x:number, y:number, key:string, radius:number, clsn:CollisionManager) {
		super(game, x, y, key);
		this.radius = radius;

		game.physics.p2.enable(this, DEBUG);

		let bod: Phaser.Physics.P2.Body = this.body;
		bod.collideWorldBounds = true;
		bod.setCircle(radius);
		bod.mass = 20;
		bod.setCollisionGroup(clsn.catCollisionGroup);
		bod.collides([clsn.vaseCollisionGroup]);
	}

	public getLegAttachPoint() : number[] {
		return [0, this.radius];
	}

	public getTailAttachPoint(reversed: boolean = false) {
		return reversed ? [-this.radius, 0] : [this.radius, 0];
	}

	public getHeadAttachPoint(reversed:boolean = false) {
		return this.getTailAttachPoint(!reversed);
	}
}

export class CatBody {
	public chest: CatBodyPart;
	public belly: CatBodyPart;
	public butt: CatBodyPart;

	private RADIUS: number = 25;
	private SEPERATION: number = 35;
	private MAX_FORCE: number = 10000;

	constructor(
		game: Phaser.Game,
		cat: Cat,
		clsn: CollisionManager,
		startX: number,
		startY: number
	) {
		this.chest = new CatBodyPart(game, startX, startY, 'cat_chest', this.RADIUS, clsn);
		this.belly = new CatBodyPart(game, startX + this.SEPERATION, startY, 'cat_belly', this.RADIUS, clsn);
		this.butt = new CatBodyPart(game, startX + (this.SEPERATION * 2), startY, 'cat_butt', this.RADIUS, clsn);

		let parts: Phaser.Sprite[] = [this.chest, this.belly, this.butt];

		game.add.existing(this.chest);
		game.add.existing(this.belly);
		game.add.existing(this.butt);

		for (let i = 1; i < parts.length; i++) {
			let joint: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
				parts[i],
				[-this.SEPERATION / 2, 0],
				parts[i - 1],
				[this.SEPERATION / 2, 0],
				this.MAX_FORCE);
			joint.setLimits(-Math.PI / 4, Math.PI / 4)
		}
	}
}
