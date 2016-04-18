const DEBUG = false;
import { CollisionManager } from "./CollisionManager";
import { ActiveWorld } from "./LevelManager";

export class Element extends Phaser.Sprite {

	constructor(
		game: Phaser.Game,
		x: number,
		y: number,
		key: string,
		activeWorld: ActiveWorld
	) {
		super(game, x, y, key);

		this.z = 20;

		this.game.physics.p2.enable(this, DEBUG);

		let body: Phaser.Physics.P2.Body = this.body;
		let collisions: CollisionManager = activeWorld.collisionManager;

		body.clearShapes();
		body.loadPolygon('physics', key);
		body.static = true;
		body.setCollisionGroup(collisions.elementsCollisionGroup);
		body.collides([collisions.catCollisionGroup, collisions.treatCollisionGroup], function(){}, this);
	}
}
