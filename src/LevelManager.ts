import {Cat} from "./cat";
import {Treat} from "./treat";
import {ZoneSensor} from "./Sensors";
import {CollisionManager} from "./CollisionManager";
import {ForegroundElement} from "./ForegroundElement";

export class LevelManager
{
    private cat: Cat;
    private currentLevel: number;

    private game: Phaser.Game;
    private activeWorld: ActiveWorldExt;
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

   public startLevel(levelNumber: number)
   {

      this.game.world.removeAll(true, true);
      this.cat = new Cat(this.game, this.collisionManager, 400, Math.random() * 100, 100, 30);

      let level: Level = this.levels[levelNumber];
      this.activeWorld = new ActiveWorldExt(this.game, this.collisionManager, this.cat.getSpriteGroup());
      this.currentLevel = levelNumber;


      level.setBackground(this.activeWorld);
      level.createTreats(this.activeWorld);

      this.cat = new Cat(this.game, this.collisionManager, level.cat_startx, level.cat_starty, 100, 30);
      this.game.camera.focusOnXY(1200, 400);

      level.createZones(this.activeWorld);
      level.createForegroundElements(this.activeWorld);

   }

   public getCat(): Cat {
       return this.cat;
   }

   public getActiveWorld(): ActiveWorld{
       return this.activeWorld;
   }

}


export class ActiveWorld
{
    public game: Phaser.Game;
    public collisionManager: CollisionManager;
    public catSpriteGroup: Phaser.Group;

    public treats: Treat[] = [];
    public zones: ZoneSensor[] = [];
    public foregroundElements: ForegroundElement[] = [];

    public constructor(game: Phaser.Game, cm: CollisionManager, catSpriteGroup: Phaser.Group)
    {
        this.game = game;
        this.collisionManager = cm;
        this.catSpriteGroup = catSpriteGroup; //for foregroundelement
    }

    public getZone(key: string): ZoneSensor
    {
        for(let zone of this.zones) {
            if (zone.zoneKey === key) {
                return zone;
            }
        }
        return null;
    }
}

class ActiveWorldExt extends ActiveWorld
{
    public constructor(game: Phaser.Game, cm: CollisionManager, catSpriteGroup:Phaser.Group)
    {
        super(game, cm, catSpriteGroup);
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
   public cat_startx: number;
   public cat_starty: number;
   
   public constructor(level : any)
   {
       this.cat_startx = level.catstart.x;
       this.cat_starty = level.catstart.y;
        
       this.name = level.name;
       for(let stage of level.stages)
       {
           this.stages.push(new Stage(stage));
       }
   }

   public setBackground(activeWorld: ActiveWorld){
      for (let stage of this.stages){
          stage.setBackgound(activeWorld);
      }
   }

   public createTreats(activeWorld: ActiveWorldExt){
      for (let stage of this.stages){
          stage.createTreats(activeWorld);
      }

      for (let treat of activeWorld.treats)
      {
          treat.onCatGotTreat.addOnce(activeWorld.onTreat, activeWorld);
      }
   }

   public createZones(activeWorld: ActiveWorldExt){

        for (let stage of this.stages){
            stage.createZones(activeWorld);
        }

        for (let zone of activeWorld.zones)
        {
            zone.onCatEntered.add(activeWorld.onZoneEnter, activeWorld);
            zone.onCatLeft.add(activeWorld.onZoneLeave, activeWorld);
        }
   }

   public createForegroundElements(activeWorld: ActiveWorldExt) {
       for (let stage of this.stages) {
           stage.createForegroundElements(activeWorld);
       }

       for (let foregroundElement of activeWorld.foregroundElements) {
           activeWorld.catSpriteGroup.add(foregroundElement);
       }
   }
}

class Stage
{
    private treats: TreatSpec[] = [];
    private zones: ZoneSpec[] = [];
    private toys: ToySpec[] = [];
    private foregroundElements: ForegroundElementSpec[] = [];

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
        if(stage.treats)
        {
            for (let treat of stage.treats)
            {
                this.treats.push(new TreatSpec(treat));
                i++;
            }
        }

        if (stage.zones){
            for (let zone of stage.zones)
            {
                this.zones.push(ZoneSpecFactory.factory(zone));
            }
        }

        if (stage.toys){
            for (let toy of stage.toys)
            {
                this.toys.push(new ToySpec(toy));
            }
        }

        if (stage.foregroundElements) {
            for (let foregroundElement of stage.foregroundElements) {
                this.foregroundElements.push(
                    new ForegroundElementSpec(foregroundElement)
                );
            }
        }
    }

    public setBackgound(activeWorld: ActiveWorld): void {
        activeWorld.game.add.sprite(this.startX, 0, this.backgroundImage);
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

    public createForegroundElements(activeWorld: ActiveWorld): void {
        for (let foregroundElement of this.foregroundElements) {
            foregroundElement.init(activeWorld);

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
    private id: string;

    public constructor(treat: any){
        super();
        this.x = treat.x;
        this.y = treat.y;
        this.hidden = treat.hidden;
        this.id = treat.id;
    }

    public init(activeWorld: ActiveWorld): void
    {
        activeWorld.treats.push(
            new Treat(this.id, activeWorld.game, activeWorld.collisionManager, this.x, this.y)
        );
    }

}

class ZoneSpecFactory{
    public static factory(zone:any): ZoneSpec{
        if (zone.shape === "circle") {
            return new CircleZoneSpec(zone.key, zone.x, zone.y, zone.raidus, zone.enabled);
        }
        else {
            return new RectangleZoneSpec(zone.key, zone.x1, zone.x2, zone.y1, zone.y2, zone.enabled);
        }
    }
}



class ZoneSpec extends Spec {
    public init(activeWorld: ActiveWorld): void {}
}

class RectangleZoneSpec extends ZoneSpec {
    private x1: number;
    private x2: number;
    private y1: number;
    private y2: number;
    private key: string;
    private enabled: boolean;

    public constructor(key: string, x1: number, x2: number, y1: number, y2: number, enabled : boolean)
    {
        super();
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.key = key;
        this.enabled = enabled;
    }

    public init(activeWorld: ActiveWorld): void {
        let x = new ZoneSensor(this.key, activeWorld.game, activeWorld.collisionManager, this.enabled)
        x.asRectangle(this.x1, this.y1, this.x2, this.y2);
        activeWorld.zones.push(x);
    }
}

class CircleZoneSpec extends ZoneSpec
{
    private key: string;
    private x: number;
    private y: number;
    private radius: number;
    private enabled: boolean;

    public constructor(key: string, x: number, y: number, radius: number, enabled: boolean)
    {
        super();
        this.x = x
        this.y = y;
        this.radius = radius;
        this.key = key;
        this.enabled = enabled;
    }

    public init(activeWorld: ActiveWorld): void {
        let x = new ZoneSensor(this.key, activeWorld.game, activeWorld.collisionManager, this.enabled)
        x.asCircle(this.x, this.y, this.radius);
        activeWorld.zones.push(x);
    }
}

class ToySpec extends Spec
{
    private x: number;
    private y: number;
    private type: string;
    private key: string;

    public constructor(toy: any){
        super()
        this.x = toy.x;
        this.y = toy.y;
        this.type = toy.type;
        this.key = toy.key;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getType(): String{
        return this.type;
    }


    public init(activeWorld: ActiveWorld): void
    {

    }
}

class ForegroundElementSpec extends Spec {
    public x: number;
    public y: number;
    public key: string;

    public init(activeWorld: ActiveWorld): void {
        activeWorld.foregroundElements.push(
            new ForegroundElement(
                activeWorld.game,
                activeWorld.catSpriteGroup,
                this.x,
                this.y,
                this.key,
                activeWorld
            )
        );
    }

    constructor(foregroundElement: any) {
        super();
        this.key = foregroundElement.key;
        this.x = foregroundElement.x;
        this.y = foregroundElement.y;
    }
}
