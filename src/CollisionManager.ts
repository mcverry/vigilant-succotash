export class CollisionManager {
	//cat
	public catCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	//vase
	public vaseCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	//dragable
	public pawCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	//treat
	public treatCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	//Things the cat can collide with
	public catCollidesWith: Array<Phaser.Physics.P2.CollisionGroup>;

	constructor(game: Phaser.Game) {
		this.catCollisionGroup = game.physics.p2.createCollisionGroup();
		this.vaseCollisionGroup = game.physics.p2.createCollisionGroup();
		this.pawCollisionGroup = game.physics.p2.createCollisionGroup();
		this.treatCollisionGroup = game.physics.p2.createCollisionGroup();

		this.catCollidesWith = [this.vaseCollisionGroup, this.treatCollisionGroup];
	}
}
