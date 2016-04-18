import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";

const DEBUG = false;

export class Paw {
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;
   private myCollisions: CollisionManager;

   private stopOnContact: boolean = true;
   private inContact: boolean = false;

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
       this.myCollisions = collisions;
       this.game.physics.p2.enable(this.sprite, DEBUG);

       this.sprite.body.setCollisionGroup(collisions.catCollisionGroup);
       this.sprite.body.collides(collisions.elementsCollisionGroup);
       this.sprite.body.onBeginContact.add(this.contactBegan, this, 0);
       this.sprite.body.onEndContact.add(this.contactEnded, this, 0);
       this.sprite.body.paw = this;

       game.physics.p2.createRevoluteConstraint(
           this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE);
   }

   private stick() {
     this.sprite.body.static = true;
     this.sprite.body.velocity.x = 0;
     this.sprite.body.velocity.y = 0;
     this.sprite.body.angularVelocity = 0;
   }

   private unstick() {
     this.sprite.body.static = false;
     this.sprite.body.dynamic = true;
   }

   public beginDrag() {
     this.stopOnContact = false;
     this.unstick();
   }

   public endDrag() {
     this.stopOnContact = true;
     if(this.inContact) {
       this.stick();
     }
   }

   public contactBegan(otherBody, otherShape, myShape, contactEq) {
     if(otherBody != null) {
       this.inContact = true;
       if(this.stopOnContact) {
         this.stick();
       }
     }
   }

   public contactEnded(otherBody, otherShape, myShape, contactEq) {
     if(otherBody != null) {
       this.inContact = false;
     }
   }

   public isTouchy() : boolean {
     return this.inContact;
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
