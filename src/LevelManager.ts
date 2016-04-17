import {Cat} from "./cat";
import {Treat} from "./treat";
import {ZoneSensor} from "./Sensors";
import {CollisionManager} from "./CollisionManager";
export class LevelManager
{
    private cat: Cat
    private currentLevel: number;

    private game: Phaser.Game;
    private activeWorld: ActiveWorld;
    private collisionManager: CollisionManager;
    private levels: Level[] = [];

    public constructor(game: Phaser.Game, collisionManager: CollisionManager)
    {
        this.game = game;
        this.collisionManager = collisionManager;
        
        let json = game.cache.getJSON("levels");
      
        for (let level of json){
            this.levels.push(new Level(level));
        }
    }

   
   public startLevel(levelNumber:number)
   {
      let level: Level = this.levels[levelNumber];
      this.activeWorld = new ActiveWorld(this.game, this.collisionManager);
      this.currentLevel = levelNumber;

      this.game.world.removeAll(true, true);
      level.setBackground();
      level.createTreats(this.activeWorld);
      
      this.cat = new Cat(this.game, this.collisionManager, 400, Math.random() * 100, 100, 30);
   }
   
   public getCat(): Cat {
       return this.cat;
   }
   
}

class ActiveWorld
{
    public game: Phaser.Game;
    public collisionManager: CollisionManager;
    
    public treats: Treat[] = [];
    public zones: ZoneSensor[] = [];
    
    public constructor(game: Phaser.Game, cm: CollisionManager)
    {
        this.game = game;
        this.collisionManager = cm;
    }
    
    public onTreat(id: number): void {
        
    }
    
    public onZoneEnter(id: number): void {
        
    }
    
    public onZoneLeave(id: number): void {
        
    }
    

}

class Level
{
   private name: String;
   private stages: Stage[] = [];
   
   public constructor(level : any)
   {
       this.name = level.name;
       for(let stage of level.stages)
       {
           this.stages.push(stage);
       }
   }
   
   public setBackground(){
      for (let stage of this.stages){
          stage.setBackgound();
      }
   }
   
   public createTreats(activeWorld: ActiveWorld){
      for (let stage of this.stages){
          stage.createTreats(activeWorld);
      }
      
      for (let treat of activeWorld.treats)
      {
          treat.onCatGotTreat.addOnce(activeWorld.onTreat, activeWorld);
      }
   }
   
   public createZones(activeWorld: ActiveWorld){
       
        for (let stage of this.stages){
            stage.createZones(activeWorld);
        }
        
        for (let zone of activeWorld.zones)
        {
            zone.onCatEntered.add(activeWorld.onZoneEnter, activeWorld);
            zone.onCatLeft.add(activeWorld.onZoneLeave, activeWorld);
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
    
    public constructor(stage: any)
    {
        this.name = stage.name;
        this.startX = stage.startX;
        this.endX = stage.endX;
        this.backgroundImage = stage.backgroundImage;
        
        let i = 0;
        for (let treat of stage.treats)
        {
            this.treats.push(new TreatSpec(treat, i));
            i++;
        }
        
        for (let zone of stage.zones)
        {
            this.zones.push(ZoneSpecFactory.factory(i, zone));
        }
        
        for (let toy of stage.toys)
        {
            this.toys.push(new ToySpec(toy));
        }
    }
    
    public setBackgound(): void {
        this.game.add.sprite(this.startX, 0, this.backgroundImage);
    }
    
    public createTreats(activeWorld: ActiveWorld): void{
        for (let treat of this.treats)
        {
            treat.init(activeWorld);
        }
    }
    
    public createZones(activeWorld: ActiveWorld): void{
        for (let zone of this.zones)
        {
            zone.init(activeWorld);
        }
    }
    
    public createToys(activeWorld: ActiveWorld): void{
        for (let toy of this.toys)
        {
            toy.init(activeWorld);
        }
    }
}

class Spec
{
    public init(activeWorld: ActiveWorld): void {}
}

class TreatSpec extends Spec
{
    private x: number;
    private y: number;
    private hidden: boolean;
    private id: number;
    
    public constructor(treat: any, id: number){
        super();
        this.x = treat.x;
        this.y = treat.y;
        this.hidden = treat.hidden;
        this.id = id;
    }
    
    public init(activeWorld: ActiveWorld): void
    {
        activeWorld.treats.push(
            new Treat(this.id, activeWorld.game, activeWorld.collisionManager, this.x, this.y)
        );
    }

}

class ZoneSpecFactory{
    public static factory(id:number, zone:any): ZoneSpec{
        if (zone.shape === "circle") {
            return new CircleZoneSpec(id, zone.x, zone.y, zone.raidus)
        }
        else {
            return new RectangleZoneSpec(id, zone.x1, zone.x2, zone.y1, zone.y2);
        }
    }
}



class ZoneSpec extends Spec
{
    public init(activeWorld: ActiveWorld): void {}
}

class RectangleZoneSpec extends ZoneSpec
{
    private x1: number;
    private x2: number;
    private y1: number;
    private y2: number;
    private id: number;
    
    public constructor(id: number, x1: number, x2: number, y1: number, y2: number)
    {
        super();
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    public init(activeWorld: ActiveWorld): void {
        activeWorld.zones.push(
            new ZoneSensor(this.id, activeWorld.game, activeWorld.collisionManager)
                .asRectangle(this.x1, this.y1, this.x2, this.y2));
    }
}

class CircleZoneSpec extends ZoneSpec
{
    private id: number;
    private x: number;
    private y: number;
    private radius: number;
    
    public constructor(id: number, x: number, y: number, radius: number)
    {
        super();
        this.x = x
        this.y = y;
        this.radius = radius;
        this.id = id;
    }
    
    public init(activeWorld: ActiveWorld): void {
        activeWorld.zones.push(
            new ZoneSensor(this.id, activeWorld.game, activeWorld.collisionManager)
                .asCircle(this.x, this.y, this.radius));
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
    
    public init(activeWorld: ActiveWorld): void
    {
        
    }
}
