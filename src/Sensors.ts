import { CollisionManager } from "./CollisionManager"

const DEBUG = true;
const SHOW_SENSORS = true;

export class ZoneSensor {
  private game: Phaser.Game;
  private sprite: Phaser.Sprite;
  private myCollisions: CollisionManager;
  private entries: number = 0;

  public onCatEntered: Phaser.Signal = new Phaser.Signal();
  public onCatLeft: Phaser.Signal = new Phaser.Signal();
  public zoneID: string;

  constructor (
    id: string,
    game: Phaser.Game,
    collisions: CollisionManager,
    x: number = 0,
    y: number = 0,
    shape: p2.Shape = null
  ) {
    this.zoneID = id;
    this.game = game;
    this.myCollisions = collisions;
    this.sprite = game.add.sprite(x, y, (SHOW_SENSORS ? "sensor" : "invisible"));

    this.game.physics.p2.enable(this.sprite, DEBUG);
    if(shape != null) {
      this.setShape(shape);
    }
    this.sprite.body.static = true;

    this.sprite.body.onBeginContact.add(this.catContacted, this, 0);
    this.sprite.body.onEndContact.add(this.catUnContacted, this, 0);
  }

  public setShape(shape: p2.Shape) {
    this.sprite.body.clearShapes();
    shape.sensor = true;
    this.sprite.body.addShape(shape.sensor);
    this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
    this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
  }

  public setCenter(x: number, y: number) {
    this.sprite.body.x = x;
    this.sprite.body.y = y;
  }

  public asCircle(x: number, y: number, radius: number) {
    this.setCenter(x, y);
    this.sprite.body.clearShapes();
    this.sprite.body.setCircle(radius);
    this.sprite.body.data.shapes[0].sensor = true;
    this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
    this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
  }

  public asRectangle(x1: number, y1: number, x2: number, y2: number) {
    let width: number = x2 - x1;
    let height: number = y2 - y1;
    this.setCenter(x1 + (0.5*width), y1 + (0.5*height));
    this.sprite.body.clearShapes();
    this.sprite.body.setRectangle(width, height);
    this.sprite.body.data.shapes[0].sensor = true;
    this.sprite.body.setCollisionGroup(this.myCollisions.sensorCollisionGroup);
    this.sprite.body.collides([this.myCollisions.catCollisionGroup, this.myCollisions.pawCollisionGroup]);
  }

  public catContacted(otherBody, otherShape, myShape, contactEq) {
    if(otherBody != null) {
      if(this.entries == 0) {
        this.onCatEntered.dispatch(this.zoneID, otherBody, otherShape, myShape);
      }
      this.entries++;
    }
  }

  public catUnContacted(otherBody, otherShape, myShape, contactEq) {
    if(otherBody != null) {
      --this.entries;
      if(this.entries == 0) {
        this.onCatLeft.dispatch(this.zoneID, otherBody, otherShape, myShape);
      }
    }
  }
}
