import {Cat} from "./cat";

export class LevelManager
{
    private cat: Cat
    private currentLevel: number;
    private currentScene: number;
    private game: Phaser.Game;
    
    private levels: Level[] = [];

    public constructor(game: Phaser.Game, cat: Cat)
    {
        this.game = game;
        this.cat = cat;
       
        let json = game.cache.getJSON("levels");
      
        for (let level of json){
            this.levels.push(new Level(game, level));
        }
    }
<<<<<<< HEAD
   
   
   public startLevel(levelNumber:number)
   {
      let level: Level = this.levels[levelNumber];

      this.game.world.removeAll(true, true);
      
      level.setBackground();
      
      level.createTreats();
      
      
   }
   
}

class Level
{
   private name: String;
   private stages: Stage[] = [];
   private game: Phaser.Game;
   
   public constructor(game: Phaser.Game, level : any)
   {
       this.game = game;
       this.name = level.name;
       for(let stage of level.stages)
       {
           this.stages.push(new Stage(game, stage));
       }
   }
   
   public setBackground()
   {
      for (let stage of this.stages){
          stage.setBackgound();
      }
   }
}

class Stage 
{
    private treats: TreatSpec[] = [];
    private zones: ZoneSpec[] = [];
    private toys: ToySpec[] = [];
    private name: String;
    private startX: number;
    private endX: number;
    private backgroundImage: String;
    private game: Phaser.Game;
    
    public constructor(game: Phaser.Game, stage: any)
    {
        this.name = stage.name;
        this.startX = stage.startX;
        this.endX = stage.endX;
        this.backgroundImage = stage.backgroundImage;
        
        for (let treat of stage.treats)
        {
            this.treats.push(new TreatSpec(treat));
        }
        
        for (let zone of stage.zones)
        {
            this.zones.push(ZoneSpecFactory.factory(zone));
        }
        
        for (let toy of stage.toys)
        {
            this.toys.push(new ToySpec(toy));
        }
    }
    
    public setBackgound(): void {
        this.game.add.sprite(this.startX, 0, this.backgroundImage);
    }
}

class Spec
{
    public init(): void {}
}

class TreatSpec
{
    private x: number;
    private y: number;
    private hidden: boolean;
    
    public constructor(treat: any){
        this.x = treat.x;
        this.y = treat.y;
        this.hidden = treat.hidden;
    }
    
    public init(): void
    {
        
    }

}

class ZoneSpecFactory{
    public static factory(zone:any): ZoneSpec{
        if (zone.shape === "circle") {
            return new CircleZoneSpec(zone.x, zone.y, zone.raidus)
        }
        else {
            return new RectangleZoneSpec(zone.x1, zone.x2, zone.y1, zone.y2);
        }
    }
}



class ZoneSpec extends Spec
{
    public init(): void {}
}

class RectangleZoneSpec extends ZoneSpec
{
    private x1: number;
    private x2: number;
    private y1: number;
    private y2: number;
    
    public constructor(x1: number, x2: number, y1: number, y2: number)
    {
        super();
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    
    public init(): void {
        
    }
}

class CircleZoneSpec extends ZoneSpec
{
    private x: number;
    private y: number;
    private radius: number;
    
    public constructor(x: number, y: number, radius: number)
    {
        super();
        this.x = x
        this.y = y;
        this.radius = radius;
    }
    
    public init(): void {
        
    }
}

class ToySpec extends Spec
{
    private x: number;
    private y: number;
    private type: String;
    
    public constructor(toy: any){
        super()
        this.x = toy.x;
        this.y = toy.y;
        this.type = toy.type;
    }
    
    public getX(): number {
        return this.x;
    }
    
    public getY(): number {
        return this.y;
    }
    
    public getHidden(): String{
        return this.type;
    }
    
    public init(): void
    {
        
    }
}
