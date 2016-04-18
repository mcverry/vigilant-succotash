/// <reference path="../definitions/phaser.d.ts"/>

import { GroupManager } from "./GroupManager";
import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";
import { CatSpriteManager } from "./CatSpriteManager";
import { LevelManager } from "./LevelManager";
import { Treat } from "./Treat";
import { ZoneSensor } from "./Sensors";
import { Fishy } from "./Fishy";
import { SoundManager} from "./SoundManager";

const FULL_DEBUG_MODE = false;

class SimpleGame {

    private game: Phaser.Game;
    private handle_bodies: Phaser.Physics.P2.Body[];
    private mouseSpring: Phaser.Physics.P2.Spring;
    private mouseBody: Phaser.Sprite;
    private catSpriteManager: CatSpriteManager;
    private levelManager: LevelManager;
    private collisions: CollisionManager;
    private soundManager: SoundManager;
    private groupManager: GroupManager;
    private trackingBody: Phaser.Physics.P2.Body;
    private pawLock: string = null;

    private fishy: Fishy;

    constructor() {
        this.game
            = new Phaser.Game(FULL_DEBUG_MODE ? 8000 : 800, 600,
                Phaser.CANVAS,
                "content",
                {
                    preload: this.preload,
                    create: this.create,
                    update: this.update,
                });
    }

    public preload() {
        this.game.load.physics('physics', 'cat-physics.json');

        this.game.load.image('invisible', 'invisible.png');

        this.game.load.json("levels", "levels.json");
        this.game.load.image('cat_paw', 'cat-paw.png');
        this.game.load.image('fishy', 'fish.png');

        this.catSpriteManager = new CatSpriteManager(this.game);

        let randCat = Math.random();
        if (randCat < 0.16) {
            this.catSpriteManager.loadSpritesForCat("brown");
        } else if (randCat < 0.32) {
            this.catSpriteManager.loadSpritesForCat("orange");
        } else if (randCat < 0.48) {
            this.catSpriteManager.loadSpritesForCat("fat");
        } else if (randCat < 0.64) {
            this.catSpriteManager.loadSpritesForCat("calico");
        } else if (randCat < 0.80) {
            this.catSpriteManager.loadSpritesForCat("black");
        } else {
            this.catSpriteManager.loadSpritesForCat("hairless");
        }

        /* Debug Sprites */
        this.game.load.image("debug_wall", "debug_wall.png");

        /* Start Level */
        this.game.load.image("start_background", "levels/start/start_background.png");
        this.game.load.image("start_sprite_floor", "levels/start/start_sprite_floor.png");

        /* Box Level*/
        this.game.load.image("box_background", "levels/box/box_background.png");
        this.game.load.image("box_foreground_box", "levels/box/box_foreground_box.png");
        this.game.load.image("box_sprite_box_and_ground", "levels/box/box_sprite_box_and_ground.png");

        /* Post Level */
        this.game.load.image("post_background", "levels/post/post_background.png");
        this.game.load.image("post_sprites", "levels/post/post_sprites.png");

        /* Vase Level */
        this.game.load.image("vase_background", "levels/vase/vase_background.png");
        this.game.load.image("vase_foreground", "levels/vase/vase_foreground.png");
        this.game.load.image("vase_sprites", "levels/vase/vase_sprites.png");

        /* Boot Level */
        this.game.load.image("boot_background", "levels/boot/boot_background.png");
        this.game.load.image("boot_foreground", "levels/boot/boot_foreground.png");
        this.game.load.image("boot_sprites", "levels/boot/boot_sprites.png");

        /* Bar Level */
        this.game.load.image("bar_background", "levels/bar/bar_background.png");
        this.game.load.image("bar_foreground", "levels/bar/bar_foreground.png");
        this.game.load.image("bar_sprites_stools", "levels/bar/bar_sprites_stools.png");
        this.game.load.image("bar_sprites_drinks", "levels/bar/bar_sprites_drinks.png");

        /* Outdoor 1 Level */
        this.game.load.image("outdoor_1_background", "levels/outdoor_1/outdoor_1_background.png");
        this.game.load.image("outdoor_1_foreground_window", "levels/outdoor_1/outdoor_1_foreground_window.png");
        this.game.load.image("outdoor_1_sprites_main", "levels/outdoor_1/outdoor_1_sprites_main.png");
        this.game.load.image("outdoor_1_sprites_window_top", "levels/outdoor_1/outdoor_1_sprites_window_top.png");

        /* Outdoor 2 Level */
        this.game.load.image("outdoor_2_background", "levels/outdoor_2/outdoor_2_background.png");
        this.game.load.image("outdoor_2_sprites_main", "levels/outdoor_2/outdoor_2_sprites_main.png");
        this.game.load.image("outdoor_2_foreground_trash", "levels/outdoor_2/outdoor_2_foreground_trash.png");

        /* Outdoor 3 Level */
        this.game.load.image("outdoor_3_background", "levels/outdoor_3/outdoor_3_background.png");
        this.game.load.image("outdoor_3_sprites_main", "levels/outdoor_3/outdoor_3_sprites_main.png");
        this.game.load.image("outdoor_3_sprites_window_top", "levels/outdoor_3/outdoor_3_sprites_window_top.png");
        this.game.load.image("outdoor_3_foreground_window", "levels/outdoor_3/outdoor_3_foreground_window.png");


        /* Fish Level */
        this.game.load.image("fish_sprite_table_and_bowl", "levels/fish/fish_sprite_table_and_bowl.png");
        this.game.load.image("fish_background", "levels/fish/fish_background.png");
        this.game.load.image("fish_foreground_water", "levels/fish/fish_foreground_water.png");

        /* SOUNDS */
        this.game.load.audio("music", "audio/Heavy-Thoughts-Ludum-Dare-Edit.mp3");
        this.game.load.audio("meow", "audio/Cat-meow-1.mp3");
    }

    public create() {

        let worldW = 800 * 10;
        let worldH = 600;

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.gravity.y = 200;
        this.game.physics.p2.setBounds(0, 0, 800, 600, true, true, true, true, true);
        this.game.world.setBounds(0, 0, worldW, worldH);
        this.game.camera.setBoundsToWorld();

        this.game.add.sound("music", 1, true).play();

        this.collisions = new CollisionManager(this.game);
        this.soundManager = new SoundManager(this.game);
        this.soundManager.addSound("meow");

        let treat = new Treat("my_treat", this.game, this.collisions, this.soundManager, 600, 500);
        treat.onCatGotTreat.add(function(id) { console.log("You got the " + id + " treat!!"); });
        let zone = new ZoneSensor("my_zone", this.game, this.collisions, true);
        zone.asRectangle(0, 400, 800, 500);

        zone.onCatEntered.add(function(id) { alert("The cat has entered zone " + id); });
        zone.onCatLeft.add(function(id) { alert("The cat has left zone " + id); });

        //let cat = new Cat(this.game, this.collisions, 400, Math.random() * 100, 100, 30);
        //zone.onCatEntered.add(function(id) {alert ("The cat has entered zone " + id);});
        //zone.onCatLeft.add(function(id) {alert ("The cat has left zone " + id);});

        zone.onCatEntered.add(function(id) {
            console.log("The cat has entered zone " + id);
            zone.setEnabled(false);
        });
        zone.onCatLeft.add(function(id) { console.log("The cat has left zone " + id); });

        this.groupManager = new GroupManager(this.game);
        this.levelManager = new LevelManager(this.game, this.collisions, this.groupManager, this.soundManager);
        this.levelManager.startLevel(0);

        this.fishy = new Fishy(this.game, this.collisions, 100, 400, 400, 500, 50);
        //this.fishy.onEaten.add(function() {console.log("The fish has been eaten, you won!");});

        this.mouseBody = this.game.add.sprite(100, 100, 'cursor');
        this.game.physics.p2.enable(this.mouseBody, true);
        this.mouseBody.body.static = true;
        this.mouseBody.body.setCircle(10);
        this.mouseBody.body.data.shapes[0].sensor = true;

        this.handle_bodies = this.levelManager.getCat().getHandles();
        //this.handle_bodies = cat.getHandles();
        this.game.input.onDown.add(click, this);
        this.game.input.onUp.add(release, this);
        this.game.input.addMoveCallback(move, this);
        let zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        let xKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        zKey.onDown.add(frontClawsIn, this);
        zKey.onUp.add(frontClawsOut, this);
        xKey.onDown.add(backClawsIn, this);
        xKey.onUp.add(backClawsOut, this);

        this.groupManager.getAllGroups().forEach(function(group) {
            this.game.add.existing(group);
        }, this);

    }

    public update() {
        this.mouseBody.body.x = this.game.input.x + this.game.camera.x;
        this.mouseBody.body.y = this.game.input.y + this.game.camera.y;
    }
}

function click(pointer) {

    let bodies = this.game.physics.p2.hitTest(this.mouseBody.body, this.handle_bodies);

    if (bodies.length) {
        if (this.levelManager.cat != null && this.levelManager.cat.anyPawsTouchy()) {
            if ('paw' in bodies[0].parent) {
                this.trackingBody = bodies[0].parent;
                bodies[0].parent.paw.beginDrag();
            }
            this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 500, 1);
        }
    }
}

function release() {
    this.game.physics.p2.removeSpring(this.mouseSpring);
    if (this.trackingBody != null) {
        this.trackingBody.paw.endDrag();
    }
    this.trackingBody = null;
}

function move(pointer, x, y, isDown) {
    if (this.levelManager.cat != null && !this.levelManager.cat.anyPawsTouchy()) {
        this.game.physics.p2.removeSpring(this.mouseSpring);
        if (this.trackingBody != null) {
            this.trackingBody.paw.endDrag();
        }
        this.trackingBody = null;
    } else {
        if (this.trackingBody != null) {
            this.trackingBody.static = false;
            this.trackingBody.dynamic = true;
        }
        this.mouseBody.body.x = x + this.game.camera.x;
        this.mouseBody.body.y = y + this.game.camera.y;
        // line.setTo(cow.x, cow.y, mouseBody.x, mouseBody.y);
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
  if(this.levelManager.cat != null && this.pawLock == 'back') {
    this.levelManager.cat.enablePaws("back", false);
    this.pawLock = null;
  }
}

window.onload = () => {
    let game = new SimpleGame();
};
