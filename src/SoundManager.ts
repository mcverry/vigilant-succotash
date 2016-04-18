
export class SoundManager {
    
    private game: Phaser.Game;
    private sounds: {[key: string]: Phaser.Sound} = {};
    
    public constructor(game: Phaser.Game) {
        this.game = game;
    }
    
    public addSound(key: string){
        this.sounds[key] = this.game.add.audio(key, 1, false);
    }
    
    public playSound(key: string) {
        let sound = this.sounds[key];
        if (sound !== null) {
            sound.play("", 0, 1, false, true);
        }   
    }
}