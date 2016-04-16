/// <reference path="../definitions/phaser.d.ts"/>
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
        this.game.load.physics('really_crappy_vase_physics', 'really-crappy-vase-sprite.json');

    }

    public create() {

        this.game.physics.startSystem(Phaser.Physics.P2JS);
       this.game.physics.p2.gravity.y = 1200;

        let cat = new Cat(this.game, 400, 200, 100, 30);
        let vase = new Vase(this.game, 400, 400, 'really_crappy_vase_sprite');

        // let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        // logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {
    let game = new SimpleGame();
};
