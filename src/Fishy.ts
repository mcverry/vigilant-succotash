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
  private time: number = 0;

  private bobRate: number = 1.5*Math.PI;
  private bobAmplitude: number = 2;

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

    let dx: number = this.xTo - this.xFrom;
    let dy: number = this.yTo - this.yFrom;
    let len: number = Math.sqrt(dx*dx + dy*dy);
    dx = dx / len;
    dy = dy / len;
    this.sprite.body.velocity.x = dx*speed;
    this.sprite.body.velocity.y = dy*speed;

    if(this.xTo < this.xFrom) {
      let tempX: number = this.xFrom;
      let tempY: number = this.yFrom;
      this.xFrom = this.xTo;
      this.yFrom = this.yTo;
      this.xTo = tempX;
      this.yFrom = tempY;
    } else {
      this.sprite.scale.x *= -1;
    }
  }

  public touchy(myBody, otherBody, myShape, otherShape) {
    if(otherBody.sprite.key == "cat_head") {
      this.onEaten.dispatch();
      this.sprite.destroy();
      this.sprite = null;
    }
  }

  public update() {
    const rate: number = 1/ 30;
    if(this.sprite != null) {
      if(this.sprite.body.x > this.xTo || this.sprite.body.x < (this.xFrom - 10)) {
        this.sprite.scale.x *= -1;
        this.sprite.body.velocity.x *= -1;
        this.sprite.body.velocity.y *= -1;
      }
      this.time += rate;
      this.sprite.body.y += Math.sin(this.time*this.bobRate)*this.bobAmplitude;
    }
  }
}
