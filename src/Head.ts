const DEBUG:boolean = true;

import { CollisionManager } from "./CollisionManager";
import { CatBodyPart } from "./Body";

export class CatHead {
	private HEAD_MASS: number = 10;
	private MAX_FORCE: number = 20000;

	private headHeight: number = 40;
	private headWidth: number = 40;

	private headPhys: Phaser.Sprite;

	constructor(
		game: Phaser.Game,
		x: number,
		y: number,
		attach: CatBodyPart
	) {
		x += attach.getHeadAttachPoint()[0];
		y += attach.getHeadAttachPoint()[1];
		this.headPhys = game.add.sprite(x, y, "cat_head", 1);
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
		//neck.setLimits(-Math.PI / 2, Math.PI / 2);
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.headPhys.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
		this.headPhys.body.collides(collisionGroup);
	}
}
