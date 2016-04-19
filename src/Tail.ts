const DEBUG:boolean = false;

import { CollisionManager } from "./CollisionManager";
import { CatBodyPart } from "./Body";
import { Cat } from "./Cat";

export class CatTail {
	private JOINT_MASS: number = 5;
	private MAX_FORCE: number = 20000;

	private jointCount: number = 8;
	private jointLength: number = 15;
	private jointWidth: number = 7;
	private tailFlexMin: number = 0;
	private tailFlexMax: number = Math.PI / 4;

	private tailJoints: Phaser.Sprite[] = [];

	constructor(
		game: Phaser.Game,
		cat: Cat,
		x: number,
		y: number,
		attach: CatBodyPart
	) {
		x += attach.getTailAttachPoint()[0];
		y += attach.getTailAttachPoint()[1];
		let joint: Phaser.Sprite = new Phaser.Sprite(game, x + this.jointLength*0.5, y, cat.catName + "cat_tail_0", 1);
		cat.getSpriteGroup().add(joint);
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
		butt.setLimits(0, 0 );
		this.tailJoints.push(joint);
		for(let i: number = 1; i < this.jointCount; ++i) {
			let lastX: number = x;
			let lastY: number = y;
			x -= this.jointLength;

			let lastJoint: Phaser.Sprite = this.tailJoints[i-1];
			joint = new Phaser.Sprite(game, x + this.jointLength*0.5, y + this.jointWidth*0.5, cat.catName + "cat_tail_" + i, 1);
			cat.getSpriteGroup().add(joint)
			game.physics.p2.enable(joint, DEBUG);
			let tailConstraint: Phaser.Physics.P2.RevoluteConstraint
				= game.physics.p2.createRevoluteConstraint(
					joint,
					[-this.jointLength*0.5, 0],
					lastJoint,
					[this.jointLength*0.5, 0],
					this.MAX_FORCE);
			joint.body.setRectangle(this.jointLength, this.jointWidth);
			joint.body.mass = this.JOINT_MASS;
			tailConstraint.setLimits(this.tailFlexMin, this.tailFlexMax);
			this.tailJoints.push(joint);
		}
	}

	public loadCat(catName: string) {
		for(let i: number = 0; i < this.tailJoints.length; ++i) {
			this.tailJoints[i].loadTexture(catName + "cat_tail_" + i);
		}
	}

	public setZIndex(zIndex:number ){
		this.tailJoints.forEach(function(joint, index) {
			joint.z = zIndex + (1 - (index / 10)) - 1;
		});
	}

	public setCollisionGroup(collisionGroup: Phaser.Physics.P2.CollisionGroup) {
		for(let i: number = 0; i < this.tailJoints.length; ++i) {
			this.tailJoints[i].body.setCollisionGroup(collisionGroup);
		}
	}

	public collides(collisionGroup: Phaser.Physics.P2.CollisionGroup[]) {
		for(let i: number = 0; i < this.tailJoints.length; ++i) {
			this.tailJoints[i].body.collides(collisionGroup);
		}
	}
}
