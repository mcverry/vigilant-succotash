
export class LevelManager
{
    private currentLevel: number;
    private currentScene: number;
    
    private levels = [[
        {"startX" : 0},
        {"startX" : 600}]];
    
    private game: Phaser.Game;
    
    public progress(){
        let tween = new Phaser.Tween(this.game.camera, this.game, this.game.tweens);
        tween.from({"Camera.x": this.sceneX()});
        this.currentScene++;
        tween.to({"Camera.x": this.sceneX()});
        tween.onComplete.add(this.startScene, this);
        tween.start();
    }
    
    public testForProgress(){
        
        if (this.getCurrentScene().goalReached)
        {
            
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