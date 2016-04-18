
export class GroupManager {
	public rootGroup: Phaser.Group;
	public catGroup: Phaser.Group;
	public elementGroup: Phaser.Group;

	constructor(game:Phaser.Game) {
		this.rootGroup = game.add.group(undefined, 'root', false);
		this.catGroup = game.add.group(this.rootGroup, 'cat', false);
		this.elementGroup = game.add.group(this.rootGroup, 'element', false);
	}

	public getAllGroups() : Phaser.Group[] {
		return [this.rootGroup, this.catGroup, this.elementGroup];
	}
}
