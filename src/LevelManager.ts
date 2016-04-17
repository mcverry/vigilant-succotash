import {Cat} from "./cat";

export class LevelManager
{
    private cat: Cat
    private currentLevel: number;
    private currentScene: number;
    private game: Phaser.Game;

    private levels = [
        [
            {"startX" : 0, "endX": 600, "goalReached" : true},
            {"startX" : 600, "endX": 1200}
        ]
    ];

    public constructor(game: Phaser.Game, cat: Cat)
    {
        this.game = game;
        this.cat = cat;
    }


    public progress(){
        let tween = new Phaser.Tween(this.game.camera, this.game, this.game.tweens);
        tween.from({"Camera.x": this.sceneX()});
        this.currentScene++;
        tween.to({"Camera.x": this.sceneX()});
        tween.onComplete.add(this.startScene, this);
        tween.start();
    }

    public testForProgress(){
        if (this.getCurrentScene().goalReached && this.cat.getX() >= this.getCurrentScene().endX) {
            this.progress();
        }
    }

    public startScene()
    {
        this.game.physics.p2.setBounds(this.sceneX(), 0, this.game.width, this.game.height, true, true, true, true);
    }


    private getCurrentScene(): any
    {
        return this.levels[this.currentLevel][this.currentScene];
    }

    private sceneX(): number
    {
        return this.getCurrentScene().startX;
    }





}
