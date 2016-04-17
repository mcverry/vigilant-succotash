const DEBUG:boolean = false;

import { CollisionManager } from "./CollisionManager";
import { CatBodyPart } from "./Body";
import { Cat } from "./Cat";

export class CatHead {
	private HEAD_MASS: number = 10;
	private MAX_FORCE: number = 20000;

	private headHeight: number = 40;
	private headWidth: number = 40;

	private headSprite: Phaser.Sprite;

	constructor(
		game: Phaser.Game,
		cat: Cat,
		x: number,
		y: number,
		attach: CatBodyPart
	) {
		x += attach.getHeadAttachPoint()[0];
		y += attach.getHeadAttachPoint()[1];
		this.headSprite = new Phaser.Sprite(game, x, y, "cat_head", 1);

		game.physics.p2.enable(this.headSprite, DEBUG);

		let headPhys: Phaser.Physics.P2.Body = this.headSprite.body;

		headPhys.clearShapes();
		headPhys.loadPolygon('physics', 'cat-head');

		cat.getSpriteGroup().add(this.headSprite);

		this.headSprite.body.mass = this.HEAD_MASS;
		let neck: Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(
				this.headSprite,
				[0, 0],
				attach,
				attach.getHeadAttachPoint(),
				this.MAX_FORCE);
		neck.setLimits(-Math.PI / 4, Math.PI / 4);
	}

	public setZIndex(zIndex:number) {
		this.headSprite.z = zIndex;
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		this.headSprite.body.setCollisionGroup(collisionGroup);
	}

	public collides(collisionGroup: Phaser.Physics.P2.CollisionGroup[]) {
		this.headSprite.body.collides(collisionGroup);
	}
}
