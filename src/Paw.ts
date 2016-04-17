import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";

const DEBUG = false;

export class Paw {
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;

   public stopOnContact: boolean = true;

   public constructor(
       game: Phaser.Game,
       cat: Cat,
       collisions: CollisionManager,
       x: number,
       y: number,
       legbottom: Phaser.Sprite,
       attachX: number,
       attachY: number
   ) {

       this.game = game;
       this.sprite = new Phaser.Sprite(game, x, y, "cat_paw");
       cat.getSpriteGroup().add(this.sprite);
       this.game.physics.p2.enable(this.sprite, DEBUG);

       this.sprite.body.setCollisionGroup(collisions.catCollisionGroup);
       this.sprite.body.collides(collisions.vaseCollisionGroup);
       this.sprite.body.createGroupCallback(collisions.vaseCollisionGroup, this.handleWorldCollision, this);
       this.sprite.body.paw = this;

       game.physics.p2.createRevoluteConstraint(
           this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE);
   }

   public handleWorldCollision(body, impactedBody, shape, impactedShape) {
     if(this.stopOnContact) {
       body.static = true;
       body.velocity.x = 0;
       body.velocity.y = 0;
       body.angularVelocity = 0;
     }
   }

   public getHandle(): Phaser.Physics.P2.Body
   {
       return this.sprite.body;
   }

   public getSprite(): Phaser.Sprite
   {
       return this.sprite;
   }

   public setZIndex(zIndex: number) {
     this.sprite.z = zIndex;
   }

   public getX(): number{
       return this.sprite.x;
   }

   public getY(): number{
       return this.sprite.y;
   }

   public setForceAngle(angle:number)
   {
       this.sprite.body.force.x = Math.sin(angle) * 100;
       this.sprite.body.force.y = Math.cos(angle) * 100;
   }
}
