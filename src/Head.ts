const DEBUG:boolean = false;

import { CollisionManager } from "./CollisionManager";
import { CatBodyPart } from "./Body";
import { Cat } from "./Cat";

export class CatHead {
	private HEAD_MASS: number = 10;
	private MAX_FORCE: number = 20000;

	private headHeight: number = 40;
	private headWidth: number = 40;

	private headPhys: Phaser.Sprite;

	constructor(
		game: Phaser.Game,
		cat: Cat,
		x: number,
		y: number,
		attach: CatBodyPart
	) {
		x += attach.getHeadAttachPoint()[0];
		y += attach.getHeadAttachPoint()[1];
		this.headPhys = new Phaser.Sprite(game, x, y, "cat_head", 1);
		cat.getSpriteGroup().add(this.headPhys);
		game.physics.p2.enable(this.headPhys, DEBUG);
		this.headPhys.body.setRectangle(this.headWidth, this.headHeight);
		this.headPhys.body.mass = this.HEAD_MASS;
		let neck: Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(
				this.headPhys,
				[0, 0],
				attach,
				attach.getHeadAttachPoint(),
				this.MAX_FORCE);
		neck.setLimits(-Math.PI / 4, Math.PI / 4);
	}

	public setZIndex(zIndex:number) {
		this.headPhys.z = zIndex;
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.headPhys.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: Phaser.Physics.P2.CollisionGroup[]) {
		this.headPhys.body.collides(collisionGroup);
	}
}
