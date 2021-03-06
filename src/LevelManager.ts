import {Cat} from "./cat";
import {Treat} from "./treat";
import {ZoneSensor} from "./Sensors";
import {CollisionManager} from "./CollisionManager";
import {GroupManager} from "./GroupManager";
import {ForegroundElement} from "./ForegroundElement";
import {Element} from "./Element";
import {SoundManager} from "./SoundManager";

const WALL_DEBUG = false;
const FULL_DEBUG_MODE = false;

export class LevelManager {
    public leftWall: Phaser.Sprite;
    public rightWall: Phaser.Sprite;

    private cat: Cat;
    private currentLevel: number;

    private soundManager: SoundManager;
    private game: Phaser.Game;
    private activeWorld: ActiveWorldExt;
    private groupManager: GroupManager;
    private collisionManager: CollisionManager;
    private levels: Level[] = [];
    private cam: CameraManager;

    public constructor(game: Phaser.Game, collisionManager: CollisionManager, groupManager: GroupManager, soundManager: SoundManager) {
        this.game = game;
        this.collisionManager = collisionManager;
        this.soundManager = soundManager;

        this.cam = new CameraManager(this.game, this);

        this.groupManager = groupManager;
        let json = game.cache.getJSON("levels");

        for (let level of json) {
            this.levels.push(new Level(level));
        }
    }

    public startLevel(levelNumber: number) {
        this.game.world.removeAll(true, true);

        let level: Level = this.levels[levelNumber];

        this.cat = new Cat(
            this.game,
            this.collisionManager,
            this.groupManager,
            level.cat_startx,
            level.cat_starty,
            100,
            30
        );

        this.activeWorld = new ActiveWorldExt(
            this.game,
            level,
            this.collisionManager,
            this.groupManager,
            this.cam,
            this.soundManager,
            this.cat);
        this.currentLevel = levelNumber;

        level.setBackground(this.activeWorld);
        level.createTreats(this.activeWorld);

        this.leftWall = this.game.add.sprite(0, 300, 'invisible');
        this.rightWall = this.game.add.sprite(0, 300, 'invisible');
        this.game.physics.p2.enable(this.leftWall, WALL_DEBUG);
        this.game.physics.p2.enable(this.rightWall, WALL_DEBUG);
        let left_body: Phaser.Physics.P2.Body = this.leftWall.body;
        let right_body: Phaser.Physics.P2.Body = this.rightWall.body;
        left_body.setRectangle(10, 600);
        right_body.setRectangle(10, 600);
        left_body.setCollisionGroup(this.collisionManager.wallsCollisionGroup);
        right_body.setCollisionGroup(this.collisionManager.wallsCollisionGroup);

        left_body.collides([this.collisionManager.catCollisionGroup, this.collisionManager.treatCollisionGroup]);
        right_body.collides([this.collisionManager.catCollisionGroup, this.collisionManager.treatCollisionGroup]);

        left_body.static = true;
        right_body.static = true;

        level.createZones(this.activeWorld);
        level.createElements(this.activeWorld);
        level.createForegroundElements(this.activeWorld);
    }

    public getCat(): Cat {
        return this.cat;
    }

    public getActiveWorld(): ActiveWorld {
        return this.activeWorld;
    }

}


export class ActiveWorld {
    public game: Phaser.Game;
    public level: Level;
    public collisionManager: CollisionManager;
    public groupManager: GroupManager;
    public soundManager: SoundManager;

    public treats: Treat[] = [];
    public zones: ZoneSensor[] = [];
    public elements: Element[] = [];
    public foregroundElements: ForegroundElement[] = [];

    public treatToZones: { [key: string]: string } = {};
    public zoneToGoal: { [key: string]: number[] } = {};

    public constructor(game: Phaser.Game, level: Level, cm: CollisionManager, gm: GroupManager, sm: SoundManager) {
        this.level = level;
        this.game = game;
        this.collisionManager = cm;
        this.groupManager = gm;
        this.soundManager = sm;
    }

    public getZone(key: string): ZoneSensor {
        for (let zone of this.zones) {
            if (zone.zoneKey === key) {
                return zone;
            }
        }
        return null;
    }
}

class ActiveWorldExt extends ActiveWorld {
    private cam: CameraManager;
    private cat: Cat;
    public constructor(game: Phaser.Game, level: Level, cm: CollisionManager, grp: GroupManager, cam: CameraManager, soundManager: SoundManager, cat: Cat) {
        super(game, level, cm, grp, soundManager);
        this.cam = cam;
        this.cat = cat;
    }

    public onTreat(key: string): void {

        let zonekey = this.treatToZones[key];
        if (zonekey) {
            this.getZone(zonekey).setEnabled(true);
        }
    }

    public onZoneEnter(key: string): void {

        let goal = this.zoneToGoal[key];
        if (goal) {
            this.cam.change(this.level.stages[goal[1]].startX, this.level.stages[goal[0]].endX, false);
        }
    }

    public onZoneLeave(key: string): void {
        let goal = this.zoneToGoal[key]
        if (goal && this.cat.getX() <= this.level.stages[goal[1]].endX) {
            this.cam.change(this.level.stages[goal[1]].startX, this.level.stages[goal[1]].endX, true);
        }

    }
}

class CameraManager {
    private game: Phaser.Game;
    private levelManager: LevelManager;

    public constructor(game: Phaser.Game, level: LevelManager) {
        this.game = game;
        this.levelManager = level;
    }

    public change(x1: number, x2: number, room_lock: boolean, duration?: number) {
        this.levelManager.rightWall.body.x = x2;
        this.levelManager.leftWall.body.x = x1;

        let ease = (duration === undefined) ? Phaser.Easing.Quadratic.InOut : Phaser.Easing.Linear.None;


        let dur = duration || 500;

        if (!FULL_DEBUG_MODE) {
            if (!room_lock) {
                this.game.camera.follow(this.levelManager.getCat().catBody.chest);
                this.game.camera.deadzone = new Phaser.Rectangle(200, 100, 700, 600);
            } else {
                this.game.camera.follow(null);
                let tween = this.game.add.tween(this.game.camera).to({ "x": x1 }, dur, ease).start();
            }
        }
    }
}

class Level {
    public cat_startx: number;
    public cat_starty: number;
    public name: String;
    public stages: Stage[] = [];


    public constructor(level: any) {
        this.cat_startx = level.catstart.x + ((9 - level.catstart.level) * 800);
        this.cat_starty = level.catstart.y;

        this.name = level.name;
        for (let stage of level.stages) {
            this.stages.push(new Stage(stage));
        }
    }

    public setBackground(activeWorld: ActiveWorld) {
        for (let stage of this.stages) {
            stage.setBackgound(activeWorld);
        }
    }

    public createTreats(activeWorld: ActiveWorldExt) {
        for (let stage of this.stages) {
            stage.createTreats(activeWorld);
        }

        for (let treat of activeWorld.treats) {
            treat.onCatGotTreat.addOnce(activeWorld.onTreat, activeWorld);
        }
    }

    public createZones(activeWorld: ActiveWorldExt) {

        for (let stage of this.stages) {
            stage.createZones(activeWorld);
        }

        for (let zone of activeWorld.zones) {
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

class Stage {
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


    public constructor(stage: any) {
        this.name = stage.name;
        this.startX = 800 * (9 - stage.number);
        this.endX = 800 * (10 - stage.number);
        this.backgroundImage = stage.backgroundImage;

        if (stage.treats) {
            for (let treat of stage.treats) {
                this.treats.push(new TreatSpec(treat, this.startX));
            }
        }

        if (stage.zones) {
            for (let zone of stage.zones) {
                this.zones.push(ZoneSpecFactory.factory(zone, this.startX, stage.number));
            }
        }

        if (stage.toys) {
            for (let toy of stage.toys) {
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
                    new ForegroundElementSpec(foregroundElement, this.startX)
                );
            }
        }
    }

    public setBackgound(activeWorld: ActiveWorld): void {
        activeWorld.game.add.sprite(this.startX, 0, this.backgroundImage);
    }

    public createTreats(activeWorld: ActiveWorld): void {
        for (let treat of this.treats) {
            treat.init(activeWorld);
        }
    }

    public createZones(activeWorld: ActiveWorld): void {
        for (let zone of this.zones) {
            zone.init(activeWorld);
        }
    }

    public createToys(activeWorld: ActiveWorld): void {
        for (let toy of this.toys) {
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

class Spec {
    public init(activeWorld: ActiveWorld): void { }
}

class TreatSpec extends Spec {
    private x: number;
    private y: number;
    private key: string;
    private enable_zone_key: string;

    public constructor(treat: any, offsetX: number) {
        super();
        this.x = treat.x + offsetX;
        this.y = treat.y;
        this.enable_zone_key = treat.enable_zone || null;
        this.key = treat.key;
    }

    public init(activeWorld: ActiveWorld): void {
        activeWorld.treats.push(
            new Treat(this.key, activeWorld.game, activeWorld.collisionManager, activeWorld.soundManager, this.x, this.y)
        );

        if (this.enable_zone_key) {
            activeWorld.treatToZones[this.key] = this.enable_zone_key;
        }

    }

}

class ZoneSpecFactory {
    public static factory(zone: any, offsetx: number, stagenum: number): ZoneSpec {

        let to = -1;
        let frm = -1;
        if (zone.goal)
        {
            to = stagenum + 1;
            frm = stagenum;
        }

        if (zone.shape === "circle") {
            return new CircleZoneSpec(zone.key, zone.x + offsetx, zone.y, zone.radius, zone.enabled, frm, to);
        }
        else {
            return new RectangleZoneSpec(zone.key, zone.x1 + offsetx, zone.x2 + offsetx, zone.y1, zone.y2, zone.enabled, frm, to);
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
        if (this.frm >= 0 && this.to >= 0) {
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


    public constructor(key: string, x1: number, x2: number, y1: number, y2: number, enabled: boolean, from: number, to: number) {
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

class CircleZoneSpec extends ZoneSpec {
    private x: number;
    private y: number;
    private radius: number;
    private enabled: boolean;
    private goto: number;

    public constructor(key: string, x: number, y: number, radius: number, enabled: boolean, from: number, to: number) {
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

class ToySpec extends Spec {
    private x: number;
    private y: number;
    private type: string;
    private key: string;

    public constructor(toy: any) {
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

    public getType(): String {
        return this.type;
    }


    public init(activeWorld: ActiveWorld): void {

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

    constructor(foregroundElement: any, offsetX: number) {
        super();
        this.key = foregroundElement.key;
        this.x = foregroundElement.x + offsetX;
        this.y = foregroundElement.y;
    }
}
