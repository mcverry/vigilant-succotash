import { CollisionManager } from "./CollisionManager";

const DEBUG = true;

export class Treat {
  private game: Phaser.Game;
  private sprite: Phaser.Sprite;
  private myCollisions: CollisionManager;
  private treatRadius: number = 14;
  private TREAT_MASS: number = 15;

  public onCatGotTreat: Phaser.Signal = new Phaser.Signal();
  public treatID: number;

  constructor(
    id: number,
    game: Phaser.Game,
    collisions: CollisionManager,
    x: number,
    y: number
  ) {
    this.treatID = id;
    this.game = game;
    this.myCollisions = collisions;

    this.sprite = game.add.sprite(x, y, "treat_img");
    this.game.physics.p2.enable(this.sprite, DEBUG);

    this.sprite.body.mass = this.TREAT_MASS;
    this.sprite.body.setCircle(this.treatRadius);
    this.sprite.body.setCollisionGroup(collisions.treatCollisionGroup);
    this.sprite.body.collides([collisions.catCollisionGroup], this.catCollided, this);
    //this.sprite.body.static = true;
  }

  public catCollided(myBody, otherBody, myShape, otherShape) {
    this.onCatGotTreat.dispatch(this.treatID, myBody, otherBody, myShape, otherShape);
    this.sprite.destroy();
  }
}
