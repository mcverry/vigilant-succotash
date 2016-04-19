"use strict";
var GroupManager_1 = require("./GroupManager");
var CollisionManager_1 = require("./CollisionManager");
var CatSpriteManager_1 = require("./CatSpriteManager");
var LevelManager_1 = require("./LevelManager");
var Treat_1 = require("./Treat");
var Sensors_1 = require("./Sensors");
var Fishy_1 = require("./Fishy");
var SoundManager_1 = require("./SoundManager");
var FULL_DEBUG_MODE = false;
var DEBUG = false;
var DEBUG_ALLOW_CAT_FLY = false;
var DEBUG_CAT_FLY = false;
var SimpleGame = (function () {
    function SimpleGame() {
        this.pawLock = null;
        this.game
            = new Phaser.Game(FULL_DEBUG_MODE ? 8000 : 800, 600, Phaser.CANVAS, "content", {
                preload: this.preload,
                create: this.create,
                update: this.update,
            });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.physics('physics', 'cat-physics.json');
        this.game.load.image('invisible', 'invisible.png');
        this.game.load.json("levels", "levels.json");
        this.game.load.image('cat_paw', 'cat-paw.png');
        this.game.load.image('cat_paw_red', 'cat-paw-red.png');
        this.game.load.image('cat_paw_blue', 'cat-paw-blue.png');
        this.game.load.image('cat_paw_green', 'cat-paw-green.png');
        this.game.load.image('cat_paw_black', 'cat-paw-black.png');
        this.game.load.image('fishy', 'fish.png');
        this.catSpriteManager = new CatSpriteManager_1.CatSpriteManager(this.game);
        this.catSpriteManager.loadSpritesForCat("brown");
        this.catSpriteManager.loadSpritesForCat("orange");
        this.catSpriteManager.loadSpritesForCat("fat");
        this.catSpriteManager.loadSpritesForCat("calico");
        this.catSpriteManager.loadSpritesForCat("black");
        this.catSpriteManager.loadSpritesForCat("hairless");
        this.game.load.image("title", "floppy-cat-title.png");
        this.game.load.image("credits", "credits.png");
        this.game.load.image("fish_treat", "fish_treat.png");
        this.game.load.image("debug_wall", "debug_wall.png");
        this.game.load.image("start_background", "levels/start/start_background_mona_inst.png");
        this.game.load.image("start_sprite_floor", "levels/start/start_sprite_floor.png");
        this.game.load.image("start_sprite_bed", "levels/start/start_sprite_bed.png");
        this.game.load.image("start_sprite_curtains", "levels/start/start_sprite_curtains.png");
        this.game.load.image("box_background", "levels/box/box_background.png");
        this.game.load.image("box_foreground_box", "levels/box/box_foreground_box.png");
        this.game.load.image("box_sprite_box_and_ground", "levels/box/box_sprite_box_and_ground.png");
        this.game.load.image("post_background", "levels/post/post_background.png");
        this.game.load.image("post_sprites", "levels/post/post_sprites.png");
        this.game.load.image("vase_background", "levels/vase/vase_background.png");
        this.game.load.image("vase_foreground", "levels/vase/vase_foreground.png");
        this.game.load.image("vase_sprites", "levels/vase/vase_sprites.png");
        this.game.load.image("boot_background", "levels/boot/boot_background.png");
        this.game.load.image("boot_foreground", "levels/boot/boot_foreground.png");
        this.game.load.image("boot_sprites", "levels/boot/boot_sprites.png");
        this.game.load.image("bar_background", "levels/bar/bar_background.png");
        this.game.load.image("bar_foreground", "levels/bar/bar_foreground.png");
        this.game.load.image("bar_sprites_stools", "levels/bar/bar_sprites_stools.png");
        this.game.load.image("bar_sprites_drinks", "levels/bar/bar_sprites_drinks.png");
        this.game.load.image("outdoor_1_background", "levels/outdoor_1/outdoor_1_background.png");
        this.game.load.image("outdoor_1_foreground_window", "levels/outdoor_1/outdoor_1_foreground_window.png");
        this.game.load.image("outdoor_1_sprites_main", "levels/outdoor_1/outdoor_1_sprites_main.png");
        this.game.load.image("outdoor_1_sprites_window_top", "levels/outdoor_1/outdoor_1_sprites_window_top.png");
        this.game.load.image("outdoor_2_background", "levels/outdoor_2/outdoor_2_background.png");
        this.game.load.image("outdoor_2_sprites_main", "levels/outdoor_2/outdoor_2_sprites_main.png");
        this.game.load.image("outdoor_2_foreground_trash", "levels/outdoor_2/outdoor_2_foreground_trash.png");
        this.game.load.image("outdoor_3_background", "levels/outdoor_3/outdoor_3_background_lunch.png");
        this.game.load.image("outdoor_3_sprites_main", "levels/outdoor_3/outdoor_3_sprites_main.png");
        this.game.load.image("outdoor_3_sprites_window_top", "levels/outdoor_3/outdoor_3_sprites_window_top.png");
        this.game.load.image("outdoor_3_foreground_window", "levels/outdoor_3/outdoor_3_foreground_window.png");
        this.game.load.image("fish_sprite_table_and_bowl", "levels/fish/fish_sprite_table_and_bowl.png");
        this.game.load.image("fish_background", "levels/fish/fish_background.png");
        this.game.load.image("fish_foreground_water", "levels/fish/fish_foreground_water.png");
        this.game.load.audio("music", "audio/Heavy-Thoughts-Ludum-Dare-Edit.mp3");
        this.game.load.audio("meow", "audio/Cat-meow-1.mp3");
    };
    SimpleGame.prototype.create = function () {
        var worldW = 800 * 10;
        var worldH = 600;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.gravity.y = 200;
        this.game.physics.p2.setBounds(0, 0, 800, 600, true, true, true, true, true);
        this.game.world.setBounds(0, 0, worldW, worldH);
        this.game.camera.setBoundsToWorld();
        this.game.add.sound("music", 1, true).play();
        this.collisions = new CollisionManager_1.CollisionManager(this.game);
        this.soundManager = new SoundManager_1.SoundManager(this.game);
        this.soundManager.addSound("meow");
        var treat = new Treat_1.Treat("my_treat", this.game, this.collisions, this.soundManager, 600, 500);
        treat.onCatGotTreat.add(function (id) { console.log("You got the " + id + " treat!!"); });
        var zone = new Sensors_1.ZoneSensor("my_zone", this.game, this.collisions, true);
        zone.asRectangle(0, 400, 800, 500);
        zone.onCatEntered.add(function (id) { alert("The cat has entered zone " + id); });
        zone.onCatLeft.add(function (id) { alert("The cat has left zone " + id); });
        zone.onCatEntered.add(function (id) {
            console.log("The cat has entered zone " + id);
            zone.setEnabled(false);
        });
        zone.onCatLeft.add(function (id) { console.log("The cat has left zone " + id); });
        this.groupManager = new GroupManager_1.GroupManager(this.game);
        this.levelManager = new LevelManager_1.LevelManager(this.game, this.collisions, this.groupManager, this.soundManager);
        this.levelManager.startLevel(0);
        this.fishy = new Fishy_1.Fishy(this.game, this.collisions, 350, 250, 450, 270, 20);
        this.fishy.onEaten.add(function () {
            var credits = this.game.add.sprite(0, 0, "credits");
        }, this);
        this.mouseBody = this.game.add.sprite(100, 100, 'invisible');
        this.game.physics.p2.enable(this.mouseBody, DEBUG);
        this.mouseBody.body.static = true;
        this.mouseBody.body.setCircle(10);
        this.mouseBody.body.data.shapes[0].sensor = true;
        this.handle_bodies = this.levelManager.getCat().getHandles();
        this.game.input.onDown.add(click, this);
        this.game.input.onUp.add(release, this);
        this.game.input.addMoveCallback(move, this);
        var zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        var xKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        if (DEBUG_ALLOW_CAT_FLY) {
            var flyKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
            flyKey.onDown.add(makeCatFly, this);
        }
        zKey.onDown.add(frontClawsIn, this);
        zKey.onUp.add(frontClawsOut, this);
        xKey.onDown.add(backClawsIn, this);
        xKey.onUp.add(backClawsOut, this);
        var oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        var twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        var threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        var fourKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        var fiveKey = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        var sixKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX);
        oneKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('brown/');
            }
        }, this);
        twoKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('orange/');
            }
        }, this);
        threeKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('fat/');
            }
        }, this);
        fourKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('calico/');
            }
        }, this);
        fiveKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('black/');
            }
        }, this);
        sixKey.onDown.add(function () {
            if (this.levelManager.cat != null) {
                this.levelManager.cat.loadCat('hairless/');
            }
        }, this);
        this.groupManager.getAllGroups().forEach(function (group) {
            this.game.add.existing(group);
        }, this);
        this.splash = new Phaser.Sprite(this.game, 35, 200, 'title');
        this.splash.fixedToCamera = true;
        this.game.add.existing(this.splash);
    };
    SimpleGame.prototype.update = function () {
        this.mouseBody.body.x = this.game.input.x + this.game.camera.x;
        this.mouseBody.body.y = this.game.input.y + this.game.camera.y;
    };
    return SimpleGame;
}());
function click(pointer) {
    if (this.splash) {
        this.splash.destroy();
        this.splash = null;
        this.levelManager.cam.change(800 * 9, 800 * 10, true, 6000);
        return;
    }
    var bodies = this.game.physics.p2.hitTest(this.mouseBody.body, this.handle_bodies);
    if (bodies.length) {
        if (this.levelManager.cat != null && (this.levelManager.cat.anyPawsTouchy()
            || DEBUG_CAT_FLY)) {
            if ('paw' in bodies[0].parent) {
                this.trackingBody = bodies[0].parent;
                bodies[0].parent.paw.beginDrag(true);
            }
            this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 500, 1);
        }
    }
}
function release() {
    this.game.physics.p2.removeSpring(this.mouseSpring);
    if (this.trackingBody != null) {
        this.trackingBody.paw.endDrag(true);
    }
    this.trackingBody = null;
}
function move(pointer, x, y, isDown) {
    if (this.levelManager.cat != null && !this.levelManager.cat.anyPawsTouchy() && !DEBUG_CAT_FLY) {
        this.game.physics.p2.removeSpring(this.mouseSpring);
        if (this.trackingBody != null) {
            this.trackingBody.paw.endDrag(true);
        }
        this.trackingBody = null;
    }
    else {
        this.mouseBody.body.x = x + this.game.camera.x;
        this.mouseBody.body.y = y + this.game.camera.y;
        if (this.trackingBody != null) {
            this.trackingBody.static = false;
            this.trackingBody.dynamic = true;
        }
    }
}
function makeCatFly() {
    DEBUG_CAT_FLY = true;
    if (this.levelManager.cat != null) {
        this.levelManager.cat.enablePaws("front", true);
        this.levelManager.cat.enablePaws("back", true);
    }
}
function frontClawsIn() {
    if (this.levelManager.cat != null && this.pawLock != 'back') {
        this.levelManager.cat.enablePaws("front", true);
        this.pawLock = 'front';
    }
}
function frontClawsOut() {
    if (this.levelManager.cat != null && this.pawLock == 'front') {
        this.levelManager.cat.enablePaws("front", false);
        this.pawLock = null;
    }
}
function backClawsIn() {
    if (this.levelManager.cat != null && this.pawLock != 'front') {
        this.levelManager.cat.enablePaws("back", true);
        this.pawLock = 'back';
    }
}
function backClawsOut() {
    if (this.levelManager.cat != null && this.pawLock == 'back') {
        this.levelManager.cat.enablePaws("back", false);
        this.pawLock = null;
    }
}
window.onload = function () {
    var game = new SimpleGame();
};
