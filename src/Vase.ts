const DEBUG: boolean = true;

export class Vase {
	private game: Phaser.Game;

	private sprite: Phaser.Sprite;

	constructor(game:Phaser.Game, x:number, y:number, spriteName: string) {
		this.sprite = game.add.sprite(x, y, spriteName);
		game.physics.p2.enable([this.sprite], DEBUG);
		this.sprite.body.static = true;
		this.sprite.body.clearShapes();
		this.sprite.body.loadPolygon("really_crappy_vase_physics", "really_crappy_vase_physics");
	}
}
