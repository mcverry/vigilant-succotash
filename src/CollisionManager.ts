export class CollisionManager {
	public frontLeftLegCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	public frontRightLegCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	public backLeftLegCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	public backRightLegCollisionGroup: Phaser.Physics.P2.CollisionGroup;
	public bodyCollisionGroup: Phaser.Physics.P2.CollisionGroup;

	constructor(game: Phaser.Game) {
		this.frontLeftLegCollisionGroup = game.physics.p2.createCollisionGroup();
		this.frontRightLegCollisionGroup = game.physics.p2.createCollisionGroup();
		this.backLeftLegCollisionGroup = game.physics.p2.createCollisionGroup();
		this.backRightLegCollisionGroup = game.physics.p2.createCollisionGroup();
		this.bodyCollisionGroup = game.physics.p2.createCollisionGroup();
	}
}
