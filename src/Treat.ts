import { CollisionManager } from "./CollisionManager";
import { SoundManager } from "./SoundManager";

const DEBUG = false;

export class Treat {
  private game: Phaser.Game;
  private sprite: Phaser.Sprite;
  private myCollisions: CollisionManager;
  private treatRadius: number = 14;
  private TREAT_MASS: number = 15;
  private soundManager: SoundManager;

  private edible = true;

  public onCatGotTreat: Phaser.Signal = new Phaser.Signal();
  public treatID: string;

  constructor(
    id: string,
    game: Phaser.Game,
    collisions: CollisionManager,
    sounds: SoundManager,
    x: number,
    y: number,
    image: string = "fish_treat",
    edible: boolean = true,
    radius: number = 14
  ) {
    this.treatID = id;
    this.game = game;
    this.myCollisions = collisions;
    this.edible = edible;
    this.treatRadius = radius;

    this.soundManager = sounds;

    this.sprite = game.add.sprite(x, y, image);
    this.game.physics.p2.enable(this.sprite, DEBUG);

    this.sprite.body.mass = this.TREAT_MASS;
    this.sprite.body.setRectangle(49, 23);
    this.sprite.body.setCollisionGroup(collisions.treatCollisionGroup);
    this.sprite.body.collides([collisions.catCollisionGroup, collisions.elementsCollisionGroup, collisions.wallsCollisionGroup], this.catCollided, this);
  }

  public catCollided(myBody, otherBody, myShape, otherShape) {
    if (otherBody.sprite.key == "cat_head") {
      this.onCatGotTreat.dispatch(this.treatID, myBody, otherBody, myShape, otherShape);
      this.soundManager.playSound("meow");
      this.sprite.destroy();
    }
  }
}
