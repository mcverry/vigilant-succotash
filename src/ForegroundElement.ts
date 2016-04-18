import { ActiveWorld } from "./LevelManager";
import { ZoneSensor } from "./Sensors";

export class ForegroundElement extends Phaser.Sprite {
	constructor(
		game:Phaser.Game,
		spriteGroup: Phaser.Group,
		x:number,
		y:number,
		key:string,
		activeWorld:ActiveWorld
	) {
		super(game, x, y, key);

		this.z = 30; //see Cat.sortSprites

		let sensor:ZoneSensor = activeWorld.getZone(key);

		sensor.onCatEntered.add(function() {
			this.setTransparent(true);
		}, this);

		sensor.onCatLeft.add(function() {
			this.setTransparent(false);
		}, this);
	}

	public setTransparent(isTransparent:boolean) {
		this.alpha = 0.4;
	}
}
