const DEBUG:boolean = false;

import { CollisionManager } from "./CollisionManager";
import { CatBodyPart } from "./Body";

export class CatTail {
	private JOINT_MASS: number = 5;
	private MAX_FORCE: number = 20000;

	private jointCount: number = 8;
	private jointLength: number = 15;
	private jointWidth: number = 7;
	private tailFlex: number = Math.PI / 4;

	private tailJoints: Phaser.Sprite[] = [];

	constructor(
		game: Phaser.Game,
		x: number,
		y: number,
		attach: CatBodyPart
	) {
		x += attach.getTailAttachPoint()[0];
		y += attach.getTailAttachPoint()[1];
		let joint: Phaser.Sprite = game.add.sprite(x + this.jointLength*0.5, y, "cat_tail_0", 1);
		game.physics.p2.enable(joint, DEBUG);
		joint.body.setRectangle(this.jointLength, this.jointWidth);
		joint.body.mass = this.JOINT_MASS;
		let butt: Phaser.Physics.P2.RevoluteConstraint
			= game.physics.p2.createRevoluteConstraint(
				joint,
				[this.jointLength*0.5, this.jointWidth*0.5],
				attach,
				attach.getTailAttachPoint(),
				this.MAX_FORCE);
		butt.setLimits(-Math.PI / 4, Math.PI * 3 / 8);
		this.tailJoints.push(joint);
		for(let i: number = 1; i < this.jointCount; ++i) {
			let lastX: number = x;
			let lastY: number = y;
			x -= this.jointLength;

			let lastJoint: Phaser.Sprite = this.tailJoints[i-1];
			joint = game.add.sprite(x + this.jointLength*0.5, y + this.jointWidth*0.5, "cat_tail_" + i, 1);
			game.physics.p2.enable(joint, DEBUG);
			let tailConstraint: Phaser.Physics.P2.RevoluteConstraint
				= game.physics.p2.createRevoluteConstraint(
					joint,
					[this.jointLength*0.5, 0],
					lastJoint,
					[-this.jointLength*0.5, 0],
					this.MAX_FORCE);
			joint.body.setRectangle(this.jointLength, this.jointWidth);
			joint.body.mass = this.JOINT_MASS;
			tailConstraint.setLimits(-this.tailFlex/2, this.tailFlex);
			this.tailJoints.push(joint);
		}
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		for(let i: number = 0; i < this.tailJoints.length; ++i) {
			this.tailJoints[i].body.setCollisionGroup(collisionGroup);
		}
	}

	public collides(collisionGroup: [Phaser.Physics.P2.CollisionGroup]) {
		for(let i: number = 0; i < this.tailJoints.length; ++i) {
			this.tailJoints[i].body.collides(collisionGroup);
		}
	}
}
