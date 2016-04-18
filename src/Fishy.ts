import { CollisionManager } from "./CollisionManager";

export class Fishy {
  private game: Phaser.Game;
  private sprite: Phaser.Sprite;
  private myCollisions: CollisionManager;

  private speed: number;
  private xFrom: number;
  private yFrom: number;
  private xTo: number;
  private yTo: number;

  public onEaten: Phaser.Signal = new Phaser.Signal();

  constructor(
    game: Phaser.Game,
    collisions: CollisionManager,
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    speed: number
  ) {
    this.game = game;
    this.myCollisions = collisions;

    this.xFrom = xFrom;
    this.yFrom = yFrom;
    this.xTo = xTo;
    this.yTo = yTo;
    this.speed = speed;

    this.sprite = this.game.add.sprite(this.xFrom, this.yFrom, "fishy");
    this.game.physics.p2.enable(this.sprite, false);
    this.sprite.body.setCollisionGroup(this.myCollisions.fishCollisionGroup);
    this.sprite.body.collides(this.myCollisions.catCollisionGroup, this.touchy, this);
    this.sprite.body.kinematic = true;
  }

  public touchy(myBody, otherBody, myShape, otherShape) {
    if(otherBody.sprite.key == "cat_head") {
      this.onEaten.dispatch();
    }
  }

  public update(time: number) {
    let dx: number = this.xTo - this.xFrom;
    this.sprite.x += time;
  }
}
