export class CollisionManager {
	//cat
	public catCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	//vase
	public vaseCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	
	//dragable 
	public pawColisionGroup: Phaser.Physics.P2.CollisionGroup;

	constructor(game: Phaser.Game) {
		this.catCollisionGroup = game.physics.p2.createCollisionGroup();
		this.vaseCollisionGroup = game.physics.p2.createCollisionGroup();
		this.pawColisionGroup = game.physics.p2.createCollisionGroup();
	}
}
