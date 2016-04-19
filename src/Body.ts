import { CollisionManager } from "./CollisionManager";
import { Cat } from "./cat";

const DEBUG = false;

export class CatBodyPart extends Phaser.Sprite {
	private radius: number;
	constructor(
		game: Phaser.Game,
		x:number,
		y:number,
		key:string,
		radius:number,
		clsn:CollisionManager) {
		super(game, x, y, key);
		this.radius = radius;

		game.physics.p2.enable(this, DEBUG);

		let bod: Phaser.Physics.P2.Body = this.body;
		bod.collideWorldBounds = true;
		bod.setCircle(radius);
		bod.mass = 20;
		bod.setCollisionGroup(clsn.catCollisionGroup);
		bod.collides(clsn.catCollidesWith);
	}

	public getLegAttachPoint() : number[] {
		return [0, 0];
	}

	public getTailAttachPoint(reversed: boolean = false) {
		return reversed ? [-this.radius *  3/4, 0] : [this.radius * 3/4, 0];
	}

	public getHeadAttachPoint(reversed:boolean = false) {
		return reversed ? [this.radius, 0] : [-this.radius, 0];
	}
}

export class CatBody {
	public chest: CatBodyPart;
	public belly: CatBodyPart;
	public butt: CatBodyPart;

	private RADIUS: number = 40;
	private SEPERATION: number = 35;
	private MAX_FORCE: number = 100000;

	constructor(
		game: Phaser.Game,
		cat: Cat,
		clsn: CollisionManager,
		startX: number,
		startY: number
	) {
		this.chest = new CatBodyPart(game, startX, startY, DEBUG ? '' : cat.catName + 'cat_chest', this.RADIUS, clsn);
		this.belly = new CatBodyPart(game, startX + this.SEPERATION, startY, DEBUG ? '' : cat.catName + 'cat_belly', this.RADIUS, clsn);
		this.butt = new CatBodyPart(game, startX + (this.SEPERATION * 2), startY, DEBUG ? '' : cat.catName + 'cat_butt', this.RADIUS, clsn);

		let parts: Phaser.Sprite[] = [this.chest, this.belly, this.butt];

		cat.getSpriteGroup().add(this.chest);
		cat.getSpriteGroup().add(this.belly);
		cat.getSpriteGroup().add(this.butt);

		for (let i = 1; i < parts.length; i++) {
			let joint: Phaser.Physics.P2.RevoluteConstraint = game.physics.p2.createRevoluteConstraint(
				parts[i],
				[-this.SEPERATION / 2, 0],
				parts[i - 1],
				[this.SEPERATION / 2, 0],
				this.MAX_FORCE);
			joint.setLimits(-Math.PI / 6, Math.PI / 6)
		}
	}

	public loadCat(catName: string) {
		this.chest.loadTexture(catName + 'cat_chest');
		this.belly.loadTexture(catName + 'cat_belly');
		this.butt.loadTexture(catName + 'cat_butt');
	}

	setZIndex(zIndex:number) :void {
		this.chest.z = zIndex;
		this.belly.z = zIndex;
		this.butt.z = zIndex;
	}
}
