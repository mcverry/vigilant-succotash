/// <reference path="../definitions/phaser.d.ts"/>

import { GroupManager } from "./GroupManager";
import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";
import { CatSpriteManager } from "./CatSpriteManager";
import { LevelManager } from "./LevelManager";
import { Treat } from "./Treat";
import { ZoneSensor } from "./Sensors";
import { Fishy } from "./Fishy";

class SimpleGame {

    private game: Phaser.Game;
    private handle_bodies: Phaser.Physics.P2.Body[];
    private mouseSpring: Phaser.Physics.P2.Spring;
    private mouseBody: Phaser.Sprite;
    private catSpriteManager: CatSpriteManager;
    private levelManager: LevelManager;
    private collisions: CollisionManager;
    private groupManager: GroupManager;
    private trackingBody: Phaser.Physics.P2.Body;

    private fishy: Fishy;

    constructor() {
        this.game
          = new Phaser.Game(800, 600,
              Phaser.CANVAS,
              "content",
              { preload: this.preload,
                create: this.create
              });
    }

    public preload() {
        this.game.load.physics('physics', 'cat-physics.json');

        this.game.load.image('invisible', 'invisible.png');

        this.game.load.json("levels", "levels.json");
        this.game.load.image('cat_paw', 'cat-paw.png');
        this.game.load.image('fishy', 'fish.png');

        this.catSpriteManager = new CatSpriteManager(this.game);
        this.catSpriteManager.loadSpritesForCat("brown");
        //this.catSpriteManager.loadSpritesForCat("orange");
        //this.catSpriteManager.loadSpritesForCat("fat");
        //this.catSpriteManager.loadSpritesForCat("calico");

        // this.catSpriteManager.loadSpritesForCat("black");
        // this.catSpriteManager.loadSpritesForCat("hairless");

        //this.catSpriteManager.loadSpritesForCat("black");
        //this.catSpriteManager.loadSpritesForCat("hairless");

        /* Start Level */
        this.game.load.image("start_background", "levels/start/start_background.png");
        this.game.load.image("start_sprite_floor", "levels/start/start_sprite_floor.png");

        /* Box Level*/
        this.game.load.image("box_background", "levels/box/box_background.png");
        this.game.load.image("box_foreground_box", "levels/box/box_foreground_box.png");
        this.game.load.image("box_sprite_box_and_ground", "levels/box/box_sprite_box_and_ground.png");

        /* Fish Level */
        this.game.load.image("fish_background", "levels/fish/fish_background.png");
    }

    public create() {

        let worldW = 800 * 6;
        let worldH = 600;

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.gravity.y = 200;
        this.game.physics.p2.setBounds(0, 0, 800, 600, true, true, true, true, true);
        this.game.world.setBounds(0, 0, worldW, worldH);
        this.game.camera.setBoundsToWorld();

        this.collisions = new CollisionManager(this.game);

        let treat = new Treat("my_treat", this.game, this.collisions, 600, 500);
        treat.onCatGotTreat.add(function(id) {console.log("You got the " + id + " treat!!");} );
        let zone = new ZoneSensor("my_zone", this.game, this.collisions, true);
        zone.asRectangle(0, 400, 800, 500);


        zone.onCatEntered.add(function(id) {alert ("The cat has entered zone " + id);});
        zone.onCatLeft.add(function(id) {alert ("The cat has left zone " + id);});

        //let cat = new Cat(this.game, this.collisions, 400, Math.random() * 100, 100, 30);
        //zone.onCatEntered.add(function(id) {alert ("The cat has entered zone " + id);});
        //zone.onCatLeft.add(function(id) {alert ("The cat has left zone " + id);});

        zone.onCatEntered.add(function(id) {
          console.log("The cat has entered zone " + id);
          zone.setEnabled(false);
        });
        zone.onCatLeft.add(function(id) { console.log("The cat has left zone " + id);} );

        this.groupManager = new GroupManager(this.game);
        this.levelManager = new LevelManager(this.game, this.collisions, this.groupManager);
        this.levelManager.startLevel(0);

        this.fishy = new Fishy(this.game, this.collisions, 100, 400, 400, 500, 50);
        this.game.time.events.loop(Phaser.Timer.SECOND * (1 / 30), this.fishy.update, this.fishy);
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

        this.groupManager.getAllGroups().forEach(function(group) {
            this.game.add.existing(group);
        }, this);

    }
}

function click(pointer) {

        let bodies = this.game.physics.p2.hitTest(this.mouseBody.body, this.handle_bodies);

        if (bodies.length) {
            if('paw' in bodies[0].parent) {
              this.trackingBody = bodies[0].parent;
              bodies[0].parent.paw.beginDrag();
            }
            this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 500, 1);
        }
    }

function release() {
        this.game.physics.p2.removeSpring(this.mouseSpring);
        if(this.trackingBody != null) {
          this.trackingBody.paw.endDrag();
        }
        this.trackingBody = null;
    }

function move(pointer, x, y, isDown) {
        if(this.trackingBody != null) {
          this.trackingBody.static = false;
          this.trackingBody.dynamic = true;
        }
        this.mouseBody.body.x = x + this.game.camera.x;
        this.mouseBody.body.y = y + this.game.camera.y;
        // line.setTo(cow.x, cow.y, mouseBody.x, mouseBody.y);
    }

window.onload = () => {
    let game = new SimpleGame();
};
