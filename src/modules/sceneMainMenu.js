/**
 * Main menu scene module.
 * @module src/modules/sceneMainMenu
 */

/**
 * Represents the main menu scene, where the player is prompted to press Space to start the game.
 */
class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({key: "SceneMainMenu"});
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
        console.log("In SceneMainMenu.create()");

        /**
         * @var bg
         * @description The background image of the scene.
         * @type {Phaser.GameObjects.TileSprite}
         */
        this.bg = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'bgSpace');
        this.bgScrollSpeed = 2;

        /**
         * @var title
         * @description The main menu title text.
         * @type {Phaser.GameObjects.Text}
         */
        this.title = this.add.text(this.game.config.width * 0.5, 128, "SHOOT'EM'UP!", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        /**
         * @var prompt
         * @description The text prompting the player to press a key.
         * @type {Phaser.GameObjects.Text}
         */
        this.prompt = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.9, "Press [Space] to start...", {
            fontFamily: 'monospace',
            fontSize: 22,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.prompt.setOrigin(0.5);

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.startKey = this.keySpace;
        //this.scene.start("SceneMain");
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

/**
 * Exports class SceneMainMenu as default.
 */
export default SceneMainMenu;
