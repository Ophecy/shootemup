/**
 * Game over scene module.
 * @module src/modules/sceneGameOver
 */

/**
 * Represents the game over scene, which starts when the player dies, and where the player can press Space to restart the game.
 */
class SceneGameOver extends Phaser.Scene {
    /**
     * Creates the game over scene with an appropriate key.
     */
    constructor() {
        super({key: "SceneGameOver"});
    }

    /**
     * The preload function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback|Phaser.Types.Scenes.ScenePreloadCallback}
     */
    preload() {
        // Loading background image
        this.load.image('bgSpace', 'assets/bgSpace.png');
    }

    /**
     * The create function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback|Phaser.Types.Scenes.SceneCreateCallback}
     */
    create() {
        //console.log("In SceneGameOver.create()");

        /**
         * @var bg
         * @description The background image of the scene.
         * @type {Phaser.GameObjects.TileSprite}
         */
        this.bg = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'bgSpace');
        this.bgScrollSpeed = 2;
        this.bg.setTint(0xFF6347, 0.5);

        this.bitmapTitle = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height*0.5, 'titleFont', "GAME OVER", 72);
        this.bitmapTitle.setOrigin(0.5);
        this.bitmapTitle.setTint(0xFF0000);

        this.bitmapPrompt = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height*0.6, 'promptFont', "Press START to continue...", 16);
        this.bitmapPrompt.setOrigin(0.5);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restartKey = this.keySpace;
    }

    /**
     * The update function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#.update__anchor|Phaser.Scene.update}
     */
    update() {
        // Background scrolling
        this.bg.tilePositionY -= this.bgScrollSpeed;

        // Shooting
        if (this.restartKey.isDown) {
            this.scene.start("SceneMain");
        }
    }
}

export default SceneGameOver;
