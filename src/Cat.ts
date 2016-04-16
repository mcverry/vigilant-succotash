const DEBUG:boolean = true;

const LEG_GROUP = 2;
const BODY_GROUP = 4;

export class CatLeg {
	private MAX_FORCE: number = 20000;

	private width = 10;
	private height = 50;

	private legTop: Phaser.Sprite;

	constructor(
		game:Phaser.Game,
		body:Cat,
		x:number,
		y:number,
		attachX: number,
		attachY: number
	) {
		this.legTop = game.add.sprite(x, y + (this.height / 2), 'cat_leg', 1);
		game.physics.p2.enable(this.legTop, DEBUG);
		game.physics.p2.createRevoluteConstraint(this.legTop, [-this.width / 2, -this.height / 2], body.body, [attachX, attachY], this.MAX_FORCE);
		this.legTop.body.clearCollision(true, true);
		this.legTop.body.setRectangle(this.width, this.height);
		this.legTop.body.mass = 10;
	}
}

export class Cat {

	private debug: boolean = true;

	public body: Phaser.Sprite;

	private game: Phaser.Game;

	public constructor(game:Phaser.Game, x:number, y:number, width: number, height: number) {
		this.game = game;

		this.body = game.add.sprite(x, y, 'cat_body');
		this.game.physics.p2.enable(this.body, DEBUG);
		this.body.body.setRectangle(width, height);
		this.body.body.velocity.x = 100;
		this.body.body.mass = 20;
		this.body.bodt.

		var frontLeftLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2),-width / 2, height / 2);

		var frontRightLeg = new CatLeg(this.game, this, x + (-width / 2), y + (height / 2), -width / 2, height / 2);
	}


	public createRope(xAnchor:number, yAnchor:number) {
		let length = 20;
		var lastRect;
		var height = 20;        //  Height for the physics body - your image height is 8px
		var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
		var maxForce = 20000;   //  The force that holds the rectangles together.

		var newRect;

		for (var i = 0; i <= length; i++) {
			var x = xAnchor;                    //  All rects are on the same x position
			var y = yAnchor + (i * height);     //  Every new rect is positioned below the last

			if (i % 2 === 0) {
				//  Add sprite (and switch frame every 2nd time)
				newRect = this.game.add.sprite(x, y, 'chain', 1);
			}
			else {
				newRect = this.game.add.sprite(x, y, 'chain', 0);
				lastRect.bringToTop();
			}

			//  Enable physicsbody
			this.game.physics.p2.enable(newRect, false);

			//  Set custom rectangle
			newRect.body.setRectangle(width, height);

			if (i === 0) {
				newRect.body.static = true;
			}
			else {
				//  Anchor the first one created
				newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
				newRect.body.mass = length / i;     //  Reduce mass for evey rope element
			}

			//  After the first rectangle is created we can add the constraint
			if (lastRect) {
				this.game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
			}

			lastRect = newRect;

		}

	}
}
