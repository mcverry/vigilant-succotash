/// <reference path="../definitions/phaser.d.ts"/>

import { CollisionManager } from "./CollisionManager";
import { Cat } from "./Cat";
import { Vase } from "./Vase";

class SimpleGame {

    private game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: this.preload, create: this.create });
    }

    public preload() {
        //this.game.load.image("logo", "phaser.png");

        this.game.load.image('really_crappy_vase_sprite', 'really-crappy-vase-sprite.png');
        this.game.load.image('super-crappy-tall-vase', 'super-crappy-tall-vase.png');
        this.game.load.physics('rcvp', 'vases.json');

        this.game.load.image('invisible', 'invisible.png');

    }

    public create() {

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 200;
        this.game.physics.p2.setBounds(0, 0, 800, 600, true, true, true, true, true);

        let collisions = new CollisionManager(this.game);
        let cat = new Cat(this.game, collisions, 400, Math.random() * 100, 100, 30);
        //let vase = new Vase(this.game, 400, 500, 'super-crappy-tall-vase', collisions);


        // let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        // logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {
    let game = new SimpleGame();
};
