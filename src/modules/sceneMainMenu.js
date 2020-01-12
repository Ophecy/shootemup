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
        this.load.bitmapFont('titleFont', 'assets/fonts/titleFont.png', 'assets/fonts/titleFont.fnt');
        this.load.bitmapFont('promptFont', 'assets/fonts/promptFont.png', 'assets/fonts/promptFont.fnt');
    }

    /**
     * The create function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback|Phaser.Types.Scenes.SceneCreateCallback}
     */
    create() {
        this.add.text(0, 0, "hack", {font: "1px 04b11", fill: "#0FFFFFF"});
        console.log("In SceneMainMenu.create()");

        /**
         * @var bg
         * @description The background image of the scene.
         * @type {Phaser.GameObjects.TileSprite}
         */
        this.bg = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'bgSpace');
        this.bgScrollSpeed = 2;

        this.bitmapTitle = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height*0.5, 'titleFont', "LEPERRANGER", 72);
        this.bitmapTitle.setOrigin(0.5);

        this.bitmapPrompt = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height*0.6, 'promptFont', "Press START to continue...", 16);
        this.bitmapPrompt.setOrigin(0.5);

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
