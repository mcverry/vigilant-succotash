"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cat_1 = require("./cat");
var treat_1 = require("./treat");
var Sensors_1 = require("./Sensors");
var ForegroundElement_1 = require("./ForegroundElement");
var Element_1 = require("./Element");
var WALL_DEBUG = false;
var FULL_DEBUG_MODE = false;
var LevelManager = (function () {
    function LevelManager(game, collisionManager, groupManager, soundManager) {
        this.levels = [];
        this.game = game;
        this.collisionManager = collisionManager;
        this.soundManager = soundManager;
        this.cam = new CameraManager(this.game, this);
        this.groupManager = groupManager;
        var json = game.cache.getJSON("levels");
        for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
            var level = json_1[_i];
            this.levels.push(new Level(level));
        }
    }
    LevelManager.prototype.startLevel = function (levelNumber) {
        this.game.world.removeAll(true, true);
        var level = this.levels[levelNumber];
        this.cat = new cat_1.Cat(this.game, this.collisionManager, this.groupManager, level.cat_startx, level.cat_starty, 100, 30);
        this.activeWorld = new ActiveWorldExt(this.game, level, this.collisionManager, this.groupManager, this.cam, this.soundManager, this.cat);
        this.currentLevel = levelNumber;
        level.setBackground(this.activeWorld);
        level.createTreats(this.activeWorld);
        this.leftWall = this.game.add.sprite(0, 300, 'invisible');
        this.rightWall = this.game.add.sprite(0, 300, 'invisible');
        this.game.physics.p2.enable(this.leftWall, WALL_DEBUG);
        this.game.physics.p2.enable(this.rightWall, WALL_DEBUG);
        var left_body = this.leftWall.body;
        var right_body = this.rightWall.body;
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
    };
    LevelManager.prototype.getCat = function () {
        return this.cat;
    };
    LevelManager.prototype.getActiveWorld = function () {
        return this.activeWorld;
    };
    return LevelManager;
}());
exports.LevelManager = LevelManager;
var ActiveWorld = (function () {
    function ActiveWorld(game, level, cm, gm, sm) {
        this.treats = [];
        this.zones = [];
        this.elements = [];
        this.foregroundElements = [];
        this.treatToZones = {};
        this.zoneToGoal = {};
        this.level = level;
        this.game = game;
        this.collisionManager = cm;
        this.groupManager = gm;
        this.soundManager = sm;
    }
    ActiveWorld.prototype.getZone = function (key) {
        for (var _i = 0, _a = this.zones; _i < _a.length; _i++) {
            var zone = _a[_i];
            if (zone.zoneKey === key) {
                return zone;
            }
        }
        return null;
    };
    return ActiveWorld;
}());
exports.ActiveWorld = ActiveWorld;
var ActiveWorldExt = (function (_super) {
    __extends(ActiveWorldExt, _super);
    function ActiveWorldExt(game, level, cm, grp, cam, soundManager, cat) {
        _super.call(this, game, level, cm, grp, soundManager);
        this.cam = cam;
        this.cat = cat;
    }
    ActiveWorldExt.prototype.onTreat = function (key) {
        var zonekey = this.treatToZones[key];
        if (zonekey) {
            this.getZone(zonekey).setEnabled(true);
        }
    };
    ActiveWorldExt.prototype.onZoneEnter = function (key) {
        var goal = this.zoneToGoal[key];
        if (goal) {
            this.cam.change(this.level.stages[goal[1]].startX, this.level.stages[goal[0]].endX, false);
        }
    };
    ActiveWorldExt.prototype.onZoneLeave = function (key) {
        var goal = this.zoneToGoal[key];
        if (goal && this.cat.getX() <= this.level.stages[goal[1]].endX) {
            this.cam.change(this.level.stages[goal[1]].startX, this.level.stages[goal[1]].endX, true);
        }
    };
    return ActiveWorldExt;
}(ActiveWorld));
var CameraManager = (function () {
    function CameraManager(game, level) {
        this.game = game;
        this.levelManager = level;
    }
    CameraManager.prototype.change = function (x1, x2, room_lock, duration) {
        this.levelManager.rightWall.body.x = x2;
        this.levelManager.leftWall.body.x = x1;
        var ease = (duration === undefined) ? Phaser.Easing.Quadratic.InOut : Phaser.Easing.Linear.None;
        var dur = duration || 500;
        if (!FULL_DEBUG_MODE) {
            if (!room_lock) {
                this.game.camera.follow(this.levelManager.getCat().catBody.chest);
                this.game.camera.deadzone = new Phaser.Rectangle(200, 100, 700, 600);
            }
            else {
                this.game.camera.follow(null);
                var tween = this.game.add.tween(this.game.camera).to({ "x": x1 }, dur, ease).start();
            }
        }
    };
    return CameraManager;
}());
var Level = (function () {
    function Level(level) {
        this.stages = [];
        this.cat_startx = level.catstart.x + ((9 - level.catstart.level) * 800);
        this.cat_starty = level.catstart.y;
        this.name = level.name;
        for (var _i = 0, _a = level.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            this.stages.push(new Stage(stage));
        }
    }
    Level.prototype.setBackground = function (activeWorld) {
        for (var _i = 0, _a = this.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            stage.setBackgound(activeWorld);
        }
    };
    Level.prototype.createTreats = function (activeWorld) {
        for (var _i = 0, _a = this.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            stage.createTreats(activeWorld);
        }
        for (var _b = 0, _c = activeWorld.treats; _b < _c.length; _b++) {
            var treat = _c[_b];
            treat.onCatGotTreat.addOnce(activeWorld.onTreat, activeWorld);
        }
    };
    Level.prototype.createZones = function (activeWorld) {
        for (var _i = 0, _a = this.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            stage.createZones(activeWorld);
        }
        for (var _b = 0, _c = activeWorld.zones; _b < _c.length; _b++) {
            var zone = _c[_b];
            zone.onCatEntered.add(activeWorld.onZoneEnter, activeWorld);
            zone.onCatLeft.add(activeWorld.onZoneLeave, activeWorld);
        }
    };
    Level.prototype.createElements = function (activeWorld) {
        for (var _i = 0, _a = this.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            stage.createElements(activeWorld);
        }
        for (var _b = 0, _c = activeWorld.elements; _b < _c.length; _b++) {
            var element = _c[_b];
            activeWorld.groupManager.elementGroup.add(element);
        }
    };
    Level.prototype.createForegroundElements = function (activeWorld) {
        for (var _i = 0, _a = this.stages; _i < _a.length; _i++) {
            var stage = _a[_i];
            stage.createForegroundElements(activeWorld);
        }
        for (var _b = 0, _c = activeWorld.foregroundElements; _b < _c.length; _b++) {
            var foregroundElement = _c[_b];
            activeWorld.groupManager.elementGroup.add(foregroundElement);
        }
    };
    return Level;
}());
var Stage = (function () {
    function Stage(stage) {
        this.treats = [];
        this.zones = [];
        this.toys = [];
        this.elements = [];
        this.foregroundElements = [];
        this.name = stage.name;
        this.startX = 800 * (9 - stage.number);
        this.endX = 800 * (10 - stage.number);
        this.backgroundImage = stage.backgroundImage;
        if (stage.treats) {
            for (var _i = 0, _a = stage.treats; _i < _a.length; _i++) {
                var treat = _a[_i];
                this.treats.push(new TreatSpec(treat, this.startX));
            }
        }
        if (stage.zones) {
            for (var _b = 0, _c = stage.zones; _b < _c.length; _b++) {
                var zone = _c[_b];
                this.zones.push(ZoneSpecFactory.factory(zone, this.startX, stage.number));
            }
        }
        if (stage.toys) {
            for (var _d = 0, _e = stage.toys; _d < _e.length; _d++) {
                var toy = _e[_d];
                this.toys.push(new ToySpec(toy));
            }
        }
        if (stage.elements) {
            for (var _f = 0, _g = stage.elements; _f < _g.length; _f++) {
                var element = _g[_f];
                this.elements.push(new ElementSpec(element, this.startX));
            }
        }
        if (stage.foregroundElements) {
            for (var _h = 0, _j = stage.foregroundElements; _h < _j.length; _h++) {
                var foregroundElement = _j[_h];
                this.foregroundElements.push(new ForegroundElementSpec(foregroundElement, this.startX));
            }
        }
    }
    Stage.prototype.setBackgound = function (activeWorld) {
        activeWorld.game.add.sprite(this.startX, 0, this.backgroundImage);
    };
    Stage.prototype.createTreats = function (activeWorld) {
        for (var _i = 0, _a = this.treats; _i < _a.length; _i++) {
            var treat = _a[_i];
            treat.init(activeWorld);
        }
    };
    Stage.prototype.createZones = function (activeWorld) {
        for (var _i = 0, _a = this.zones; _i < _a.length; _i++) {
            var zone = _a[_i];
            zone.init(activeWorld);
        }
    };
    Stage.prototype.createToys = function (activeWorld) {
        for (var _i = 0, _a = this.toys; _i < _a.length; _i++) {
            var toy = _a[_i];
            toy.init(activeWorld);
        }
    };
    Stage.prototype.createElements = function (activeWorld) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            element.init(activeWorld);
        }
    };
    Stage.prototype.createForegroundElements = function (activeWorld) {
        for (var _i = 0, _a = this.foregroundElements; _i < _a.length; _i++) {
            var foregroundElement = _a[_i];
            foregroundElement.init(activeWorld);
        }
    };
    return Stage;
}());
var Spec = (function () {
    function Spec() {
    }
    Spec.prototype.init = function (activeWorld) { };
    return Spec;
}());
var TreatSpec = (function (_super) {
    __extends(TreatSpec, _super);
    function TreatSpec(treat, offsetX) {
        _super.call(this);
        this.x = treat.x + offsetX;
        this.y = treat.y;
        this.enable_zone_key = treat.enable_zone || null;
        this.key = treat.key;
    }
    TreatSpec.prototype.init = function (activeWorld) {
        activeWorld.treats.push(new treat_1.Treat(this.key, activeWorld.game, activeWorld.collisionManager, activeWorld.soundManager, this.x, this.y));
        if (this.enable_zone_key) {
            activeWorld.treatToZones[this.key] = this.enable_zone_key;
        }
    };
    return TreatSpec;
}(Spec));
var ZoneSpecFactory = (function () {
    function ZoneSpecFactory() {
    }
    ZoneSpecFactory.factory = function (zone, offsetx, stagenum) {
        var to = -1;
        var frm = -1;
        if (zone.goal) {
            to = stagenum + 1;
            frm = stagenum;
        }
        if (zone.shape === "circle") {
            return new CircleZoneSpec(zone.key, zone.x + offsetx, zone.y, zone.radius, zone.enabled, frm, to);
        }
        else {
            return new RectangleZoneSpec(zone.key, zone.x1 + offsetx, zone.x2 + offsetx, zone.y1, zone.y2, zone.enabled, frm, to);
        }
    };
    return ZoneSpecFactory;
}());
var ZoneSpec = (function (_super) {
    __extends(ZoneSpec, _super);
    function ZoneSpec(key, frm, to) {
        _super.call(this);
        this.frm = frm;
        this.to = to;
        this.key = key;
    }
    ZoneSpec.prototype.init = function (activeWorld) {
        if (this.frm >= 0 && this.to >= 0) {
            activeWorld.zoneToGoal[this.key] = [this.frm, this.to];
        }
    };
    return ZoneSpec;
}(Spec));
var RectangleZoneSpec = (function (_super) {
    __extends(RectangleZoneSpec, _super);
    function RectangleZoneSpec(key, x1, x2, y1, y2, enabled, from, to) {
        _super.call(this, key, from, to);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.enabled = enabled;
    }
    RectangleZoneSpec.prototype.init = function (activeWorld) {
        _super.prototype.init.call(this, activeWorld);
        var x = new Sensors_1.ZoneSensor(this.key, activeWorld.game, activeWorld.collisionManager, this.enabled);
        x.asRectangle(this.x1, this.y1, this.x2, this.y2);
        activeWorld.zones.push(x);
    };
    return RectangleZoneSpec;
}(ZoneSpec));
var CircleZoneSpec = (function (_super) {
    __extends(CircleZoneSpec, _super);
    function CircleZoneSpec(key, x, y, radius, enabled, from, to) {
        _super.call(this, key, from, to);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.enabled = enabled;
    }
    CircleZoneSpec.prototype.init = function (activeWorld) {
        _super.prototype.init.call(this, activeWorld);
        var x = new Sensors_1.ZoneSensor(this.key, activeWorld.game, activeWorld.collisionManager, this.enabled);
        x.asCircle(this.x, this.y, this.radius);
        activeWorld.zones.push(x);
    };
    return CircleZoneSpec;
}(ZoneSpec));
var ToySpec = (function (_super) {
    __extends(ToySpec, _super);
    function ToySpec(toy) {
        _super.call(this);
        this.x = toy.x;
        this.y = toy.y;
        this.type = toy.type;
        this.key = toy.key;
    }
    ToySpec.prototype.getX = function () {
        return this.x;
    };
    ToySpec.prototype.getY = function () {
        return this.y;
    };
    ToySpec.prototype.getType = function () {
        return this.type;
    };
    ToySpec.prototype.init = function (activeWorld) {
    };
    return ToySpec;
}(Spec));
var ElementSpec = (function (_super) {
    __extends(ElementSpec, _super);
    function ElementSpec(element, offsetX) {
        _super.call(this);
        this.key = element.key;
        this.x = element.x + offsetX;
        this.y = element.y;
    }
    ElementSpec.prototype.init = function (activeWorld) {
        activeWorld.elements.push(new Element_1.Element(activeWorld.game, this.x, this.y, this.key, activeWorld));
    };
    return ElementSpec;
}(Spec));
var ForegroundElementSpec = (function (_super) {
    __extends(ForegroundElementSpec, _super);
    function ForegroundElementSpec(foregroundElement, offsetX) {
        _super.call(this);
        this.key = foregroundElement.key;
        this.x = foregroundElement.x + offsetX;
        this.y = foregroundElement.y;
    }
    ForegroundElementSpec.prototype.init = function (activeWorld) {
        activeWorld.foregroundElements.push(new ForegroundElement_1.ForegroundElement(activeWorld.game, this.x, this.y, this.key, activeWorld));
    };
    return ForegroundElementSpec;
}(Spec));
