export class Paw {
   
   private game: Phaser.Game;
   private sprite: Phaser.Sprite;
   private MAX_FORCE = 20000;
   
   public constructor(
       game: Phaser.Game,
       world: Phaser.Physics.P2,
       x: number,
       y: number,
       legbottom: Phaser.Sprite,
       dragPaw: DraggablePaw,
       attachX: number,
       attachY: number,
       DEBUG: boolean) {
           
       this.game = game;
       this.sprite = game.add.sprite(x, y, "paw_sprite");

       this.game.physics.p2.enable(this.sprite, DEBUG);
       
       this.dragPaw = new DraggablePaw(
           game,
           world,
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
}

class DraggablePaw {
    
    private sprite: Phaser.Sprite;
    private game: Phaser.Game;
    private catPaw: Paw;
    
    private dragged: boolean;
    
    public constructor(
        game: Phaser.Game,
        world: Phaser.Physics.P2,
        catPaw: Paw,
        DEBUG: boolean){
        this.game = game;
        this.catPaw = catPaw;

        this.sprite = game.add.sprite(
            catPaw.getX(), catPaw.getY(), "paw_sprite_drag");

        game.physics.p2.enable(this.sprite, DEBUG);

        let spring = new Phaser.Physics.P2.Spring(
            world,
            this.sprite.body,
            catPaw.getSprite().body,
            1,
            100,
            20
        );
        
        game.physics.p2.addSpring(spring);

        this.sprite.inputEnabled = true;
        this.sprite.input.enableDrag(true);
        this.sprite.input.dragFromCenter = false;

        this.sprite.events.onDragStart.add(this.dragStart, this);
        this.sprite.events.onDragStop.add(this.dragStop, this);
        this.sprite.events.onAnimationStart.add(this.step, this);
    }

    private step() {
        if (!this.dragged) {
            this.sprite.x = this.catPaw.getX();
            this.sprite.y = this.catPaw.getY();
        }
    }

    private dragStart() {
        this.dragged = true;
    }

    private dragStop() {
        this.dragged = false;
    }
}
