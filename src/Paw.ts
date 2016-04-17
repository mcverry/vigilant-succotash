import { CollisionManager } from "./CollisionManager";

const DEBUG = false;

export class Paw {
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;

   public stopOnContact: boolean = true;

   public constructor(
       game: Phaser.Game,
       collisions: CollisionManager,
       x: number,
       y: number,
       legbottom: Phaser.Sprite,
       attachX: number,
<<<<<<< HEAD
       attachY: number,
       DEBUG: boolean) {
=======
       attachY: number
   ) {
>>>>>>> master

       this.game = game;
       this.sprite = game.add.sprite(x, y, "invisible");
       this.game.physics.p2.enable(this.sprite, DEBUG);

       this.sprite.body.setCollisionGroup(collisions.catCollisionGroup);
<<<<<<< HEAD
       this.sprite.body.collides(collisions.vaseCollisionGroup);
       this.sprite.body.createGroupCallback(collisions.vaseCollisionGroup, this.handleWorldCollision, this);
       this.sprite.body.paw = this;
=======
>>>>>>> master

       game.physics.p2.createRevoluteConstraint(
           this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE);
   }

<<<<<<< HEAD
   public handleWorldCollision(body, impactedBody, shape, impactedShape) {
     if(this.stopOnContact) {
       body.static = true;
       body.velocity.x = 0;
       body.velocity.y = 0;
       body.angularVelocity = 0;
     }
   }

=======
>>>>>>> master
   public getHandle(): Phaser.Physics.P2.Body
   {
       return this.sprite.body;
   }

   public getSprite(): Phaser.Sprite
   {
       return this.sprite;
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
