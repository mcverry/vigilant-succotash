import { CollisionManager } from "./CollisionManager";

export class Paw {
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;
   public constructor(
       game: Phaser.Game,
       collisions: CollisionManager,
       x: number,
       y: number,
       legbottom: Phaser.Sprite,
       attachX: number,
       attachY: number,
       DEBUG: boolean) {
           
       this.game = game;
       this.sprite = game.add.sprite(x, y, "paw_sprite");
       this.game.physics.p2.enable(this.sprite, DEBUG);
       
       this.sprite.body.setCollisionGroup(collisions.catCollisionGroup);
       
       game.physics.p2.createRevoluteConstraint(
           this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE)
   }
   
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
