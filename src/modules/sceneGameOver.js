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
        console.log("In SceneGameOver.create()");

        /**
         * @var bg
         * @description The background image of the scene.
         * @type {Phaser.GameObjects.TileSprite}
         */
        this.bg = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'bgSpace');
        this.bgScrollSpeed = 2;
        this.bg.setTint(0xFF6347, 0.5);

        /**
         * @var title
         * @description The game over title text.
         * @type {Phaser.GameObjects.Text}
         */
        this.title = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.5, "GAME OVER", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#8B0000',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        /**
         * @var prompt
         * @description The text prompting the player to press a key.
         * @type {Phaser.GameObjects.Text}
         */
        this.prompt = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.9, "Press [Space] to restart...", {
            fontFamily: 'monospace',
            fontSize: 22,
            fontStyle: 'bold',
            color: '#8B0000',
            align: 'center'
        });
        this.prompt.setOrigin(0.5);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.startKey = this.keySpace;
    }

    /**
     * The update function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#.update__anchor|Phaser.Scene.update}
     */
    update() {
        // Background scrolling
        this.bg.tilePositionY -= this.bgScrollSpeed;

        // Shooting
        if (this.startKey.isDown) {
            this.scene.start("SceneMain");
        }
    }
}

export default SceneGameOver;
