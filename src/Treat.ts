import { CollisionManager } from "./CollisionManager";

const DEBUG = true;

export class Treat {
  private game: Phaser.Game;
  private sprite: Phaser.Sprite;
  private myCollisions: CollisionManager;
  private treatRadius: number = 14;
  private TREAT_MASS: number = 15;

  private edible = true;

  public onCatGotTreat: Phaser.Signal = new Phaser.Signal();
  public treatID: string;

  constructor(
    id: string,
    game: Phaser.Game,
    collisions: CollisionManager,
    x: number,
    y: number,
    image: string = "treat_img",
    edible: boolean = true,
    radius: number = 14
  ) {
    this.treatID = id;
    this.game = game;
    this.myCollisions = collisions;
    this.edible = edible;
    this.treatRadius = radius;

    this.sprite = game.add.sprite(x, y, image);
    this.game.physics.p2.enable(this.sprite, DEBUG);

    this.sprite.body.mass = this.TREAT_MASS;
    this.sprite.body.setCircle(this.treatRadius);
    this.sprite.body.setCollisionGroup(collisions.treatCollisionGroup);
    this.sprite.body.collides([collisions.catCollisionGroup], this.catCollided, this);
  }

  public catCollided(myBody, otherBody, myShape, otherShape) {
    //console.log(otherBody.sprite.key);
    if(otherBody.sprite.key == "cat_head") {
      this.onCatGotTreat.dispatch(this.treatID, myBody, otherBody, myShape, otherShape);
      this.sprite.destroy();
    }
  }
}
