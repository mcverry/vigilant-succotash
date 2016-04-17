/// <reference path="../definitions/phaser.d.ts"/>

import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";
import { Vase } from "./Vase";

class SimpleGame {

    private game: Phaser.Game;
    private handle_bodies: Phaser.Physics.P2.Body[];
    private mouseSpring: Phaser.Physics.P2.Spring;
    private mouseBody: Phaser.Sprite;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: this.preload, create: this.create });
    }

    public preload() {
        //this.game.load.image("logo", "phaser.png");

        this.game.load.image('really_crappy_vase_sprite', 'really-crappy-vase-sprite.png');
        this.game.load.image('super-crappy-tall-vase', 'super-crappy-tall-vase.png');
        this.game.load.physics('rcvp', 'vases.json');

        this.game.load.image('invisible', 'invisible.png');

        this.game.load.image('cat_tail', 'invisible.png');
        this.game.load.image('cat_head', 'invisible.png');

    }
    
    public create() {

        let worldW = 800 * 6;
        let worldH = 600;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 200;
        this.game.physics.p2.setBounds(0, 0, worldW, worldH, true, true, true, true, true);
        this.game.world.setBounds(0, 0, worldW, worldH);
        this.game.camera.setBoundsToWorld();
        

        let collisions = new CollisionManager(this.game);

        let vase = new Vase(this.game, 400, 500, 'super-crappy-tall-vase', collisions);
        let cat = new Cat(this.game, collisions, 400, Math.random() * 100, 100, 30);

        this.mouseBody = this.game.add.sprite(100, 100, 'cursor');
        this.game.physics.p2.enable(this.mouseBody, true);
        this.mouseBody.body.static = true;
        this.mouseBody.body.setCircle(10);
        this.mouseBody.body.data.shapes[0].sensor = true;

        this.handle_bodies = cat.getHandles();
        this.game.camera.follow(cat.catBody);

        this.game.input.onDown.add(click, this);
        this.game.input.onUp.add(release, this);
        this.game.input.addMoveCallback(move, this);
    }
}

function click(pointer) {

        let bodies = this.game.physics.p2.hitTest(pointer.position, this.handle_bodies);
        if (bodies.length) {
            this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 2000, 1);
        }
    }

function release() {
        this.game.physics.p2.removeSpring(this.mouseSpring);
    }

function move(pointer, x, y, isDown) {

        this.mouseBody.body.x = x;
        this.mouseBody.body.y = y;
        // line.setTo(cow.x, cow.y, mouseBody.x, mouseBody.y);
    }

window.onload = () => {
    let game = new SimpleGame();
};
