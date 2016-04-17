const DEBUG: boolean = true;

import { CollisionManager } from "./CollisionManager";

export class Vase {
	private game: Phaser.Game;

	private sprite: Phaser.Sprite;

	constructor(
		game:Phaser.Game,
		x:number,
		y:number,
		spriteName: string,
		clsn: CollisionManager
	) {
		this.sprite = game.add.sprite(x, y, spriteName);
		game.physics.p2.enable([this.sprite], DEBUG);
		this.sprite.body.static = true;
		this.sprite.body.clearShapes();
		this.sprite.body.loadPolygon("rcvp", spriteName);
		this.sprite.body.setCollisionGroup(clsn.vaseCollisionGroup);
		this.sprite.body.collides([clsn.catCollisionGroup, clsn.pawCollisionGroup]);
	}
}
