import { CollisionManager } from "./CollisionManager";

export class Paw {
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;
   private dragPaw: DraggablePaw;
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
       
       this.dragPaw = new DraggablePaw(
           game,
           collisions,
           this,
           DEBUG
       );
       
       game.physics.p2.createRevoluteConstraint(
           this.sprite, [0, 0], legbottom, [attachX, attachY], this.MAX_FORCE)
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

class DraggablePaw {
    
    private sprite: Phaser.Sprite;
    private game: Phaser.Game;
    private catPaw: Paw;
    
    private dragged: boolean;
    
    public constructor(
        game: Phaser.Game,
        collisions: CollisionManager,
        catPaw: Paw,
        DEBUG: boolean){
        this.game = game;
        this.catPaw = catPaw;

        this.sprite = game.add.sprite(
            catPaw.getX(), catPaw.getY(), "paw_sprite_drag");

        /*this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag(true);
        this.sprite.input.dragFromCenter = false;

        this.sprite.events.onDragStart.add(this.dragStart, this);
        this.sprite.events.onDragStop.add(this.dragStop, this);
        */
        this.sprite.events.onAnimationStart.add(this.step, this);
        
        this.sprite.bringToTop();
    }

    private step() {
        if (!this.dragged) {
            this.sprite.x = this.catPaw.getX();
            this.sprite.y = this.catPaw.getY();
        } else {
            this.catPaw.setForceAngle(Phaser.Math.angleBetween(
                this.catPaw.getX(),
                this.catPaw.getY(),
                this.sprite.x,
                this.sprite.y));
        }
    }

    private dragStart() {
        this.dragged = true;
    }

    private dragStop() {
        this.dragged = false;
    }
}
