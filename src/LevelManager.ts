import {Cat} from "./cat";
import {Treat} from "./treat";
import {ZoneSensor} from "./Sensors";
import {CollisionManager} from "./CollisionManager";
import {GroupManager} from "./GroupManager";
import {ForegroundElement} from "./ForegroundElement";
import {Element} from "./Element";

export class LevelManager
{
    public leftWall: Phaser.Sprite;
    public rightWall: Phaser.Sprite;
    
    private cat: Cat;
    private currentLevel: number;

    private game: Phaser.Game;
    private activeWorld: ActiveWorldExt;
    private groupManager: GroupManager;
    private collisionManager: CollisionManager;
    private levels: Level[] = [];
    private cam: CameraManager;

    public constructor(game: Phaser.Game, collisionManager: CollisionManager, groupManager: GroupManager)
    {
        this.game = game;
        this.collisionManager = collisionManager;

        this.cam = new CameraManager(this.game, this);
        
        this.groupManager = groupManager;
        let json = game.cache.getJSON("levels");

        for (let level of json){
            this.levels.push(new Level(level));
        }
    }

   public startLevel(levelNumber: number)
   {
        this.game.world.removeAll(true, true);

        let level: Level = this.levels[levelNumber];
        this.activeWorld = new ActiveWorldExt(this.game, level, this.collisionManager, this.groupManager, this.cam);
        this.currentLevel = levelNumber;


        level.setBackground(this.activeWorld);
        level.createTreats(this.activeWorld);

        this.cat = new Cat(
            this.game,
            this.collisionManager,
            this.groupManager,
            level.cat_startx,
            level.cat_starty,
            100,
            30
        );
        
        this.leftWall = this.game.add.sprite(0, 0, 'invisible');
        this.rightWall = this.game.add.sprite(0, 0, 'invisible');
        this.game.physics.p2.enable(this.leftWall, true);
        this.game.physics.p2.enable(this.rightWall, true);
        let left_body: Phaser.Physics.P2.Body = this.leftWall.body;
        let right_body: Phaser.Physics.P2.Body = this.rightWall.body;
        left_body.setCollisionGroup(this.collisionManager.wallsCollisionGroup);
        right_body.setCollisionGroup(this.collisionManager.wallsCollisionGroup);
        left_body.setRectangle(10, 600);
        right_body.setRectangle(10, 600);

        this.game.camera.focusOnXY(1200, 400);
        this.game.camera.follow(this.cat.catBody.chest);

        level.createZones(this.activeWorld);
        level.createElements(this.activeWorld);
        level.createForegroundElements(this.activeWorld);

        this.cam.change(800, 1600);
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
    public level: Level;
    public collisionManager: CollisionManager;
    public groupManager: GroupManager;

    public treats: Treat[] = [];
    public zones: ZoneSensor[] = [];
    public elements: Element[] = [];
    public foregroundElements: ForegroundElement[] = [];

    public treatToZones: {[key: string]: string} = {};
    public zoneToGoal: {[key: string]: number[]} = {};

    public constructor(game: Phaser.Game, level: Level, cm: CollisionManager, gm: GroupManager){
        this.level = level;
        this.game = game;
        this.collisionManager = cm;
        this.groupManager = gm;
    }

    public getZone(key: string): ZoneSensor {
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
    private cam: CameraManager;
    public constructor(game: Phaser.Game, level: Level, cm: CollisionManager, grp:GroupManager, cam: CameraManager)
    {
        super(game, level, cm, grp);
        this.cam = cam;
    }

    public onTreat(key: string): void {

        let zonekey = this.treatToZones[key];
        if(zonekey){
            this.getZone(zonekey).setEnabled(true);
        }
    }

    public onZoneEnter(key: string): void {

        let goal = this.zoneToGoal[key];
        if (goal) {
            this.cam.change(this.level.stages[goal[1]].startX, this.level.stages[goal[0]].endX);
        }
    }

    public onZoneLeave(key: string): void {

    }
}

class CameraManager {

    private game: Phaser.Game;
    private levelManager: LevelManager
    
    public constructor(game:Phaser.Game, level:LevelManager){
       this.game = game;
       this.levelManager = level;
    }

    public change(x1: number, x2: number){

        this.levelManager.rightWall.x = x2 + 1;
        this.levelManager.leftWall.x = x1 - 1;
        
        console.log(this.levelManager.leftWall);
        
        this.game.camera.bounds.setTo(x1, 0, x2 - x1, 600);
    }
}

class Level
{
   public cat_startx: number;
   public cat_starty: number;
   public name: String;
   public stages: Stage[] = [];


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

   public createElements(activeWorld: ActiveWorldExt) {
       for (let stage of this.stages) {
           stage.createElements(activeWorld);
       }

       for (let element of activeWorld.elements) {
           activeWorld.groupManager.elementGroup.add(element);
       }
   }

   public createForegroundElements(activeWorld: ActiveWorldExt) {
       for (let stage of this.stages) {
           stage.createForegroundElements(activeWorld);
       }

       for (let foregroundElement of activeWorld.foregroundElements) {
           activeWorld.groupManager.elementGroup.add(foregroundElement);
       }
   }
}

class Stage
{
    public startX: number;
    public endX: number;

    private treats: TreatSpec[] = [];
    private zones: ZoneSpec[] = [];
    private toys: ToySpec[] = [];
    private elements: ElementSpec[] = [];
    private foregroundElements: ForegroundElementSpec[] = [];

    private name: String;
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

        if (stage.elements) {
            for (let element of stage.elements) {
                this.elements.push(
                    new ElementSpec(element, this.startX)
                );
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

    public createElements(activeWorld: ActiveWorld): void {
        for (let element of this.elements) {
            element.init(activeWorld);

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
    private key: string;
    private enable_zone_key: string;

    public constructor(treat: any){
        super();
        this.x = treat.x;
        this.y = treat.y;
        this.enable_zone_key = treat.enable_zone || null;
        this.key = treat.key;
    }

    public init(activeWorld: ActiveWorld): void {
        activeWorld.treats.push(
            new Treat(this.key, activeWorld.game, activeWorld.collisionManager, this.x, this.y)
        );

        if (this.enable_zone_key) {
            activeWorld.treatToZones[this.key] = this.enable_zone_key;
        }

    }

}

class ZoneSpecFactory{
    public static factory(zone:any): ZoneSpec{

        let frm = zone.from;
        if (frm === undefined || frm == null) {
            frm = -1;
        }
        let to = zone.to;
        if (to === undefined || to == null) {
            to = -1;
        }

        if (zone.shape === "circle") {
            return new CircleZoneSpec(zone.key, zone.x, zone.y, zone.raidus, zone.enabled, frm, to);
        }
        else {
            return new RectangleZoneSpec(zone.key, zone.x1, zone.x2, zone.y1, zone.y2, zone.enabled, frm, to);
        }
    }
}

class ZoneSpec extends Spec {
    protected key: string;
    private frm: number;
    private to: number;

    public constructor(key: string, frm: number, to: number) {
        super();
        this.frm = frm;
        this.to = to;
        this.key = key;
    }

    public init(activeWorld: ActiveWorld): void {
        if (this.frm >= 0 && this.to >= 0)
        {
            activeWorld.zoneToGoal[this.key] = [this.frm, this.to];
        }
    }
}

class RectangleZoneSpec extends ZoneSpec {
    private x1: number;
    private x2: number;
    private y1: number;
    private y2: number;
    private enabled: boolean;


    public constructor(key: string, x1: number, x2: number, y1: number, y2: number, enabled : boolean, from: number, to: number)
    {
        super(key, from, to);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.enabled = enabled;
    }

    public init(activeWorld: ActiveWorld): void {

        super.init(activeWorld);

        let x = new ZoneSensor(this.key, activeWorld.game, activeWorld.collisionManager, this.enabled)
        x.asRectangle(this.x1, this.y1, this.x2, this.y2);
        activeWorld.zones.push(x);
    }
}

class CircleZoneSpec extends ZoneSpec
{
    private x: number;
    private y: number;
    private radius: number;
    private enabled: boolean;
    private goto: number;

    public constructor(key: string, x: number, y: number, radius: number, enabled: boolean, from:number, to:number)
    {
        super(key, from, to);
        this.x = x
        this.y = y;
        this.radius = radius;
        this.enabled = enabled;
    }

    public init(activeWorld: ActiveWorld): void {
        super.init(activeWorld);

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

class ElementSpec extends Spec {
    public x: number;
    public y: number;
    public key: string;

    public init(activeWorld: ActiveWorld): void {
        activeWorld.elements.push(
            new Element(
                activeWorld.game,
                this.x,
                this.y,
                this.key,
                activeWorld
            )
        );
    }

    constructor(element: any, offsetX: number) {
        super();
        this.key = element.key;
        this.x = element.x + offsetX;
        this.y = element.y;
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
