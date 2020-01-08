import Player from "./modules/player.js";

var root = this; // Just in case

// Phaser config object
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 'black',
    physics:  {
        default: 'arcade', // Simple physics
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: { // TODO: Create different scenes in modules (SceneMainMenu, SceneMain, and SceneGameOver)
        mode: Phaser.Scale.NONE,
        parent: 'shootemup',
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config); // Initializing game with config object

function preload ()
{
    // Loading player spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprPlayer", "assets/sprPlayer.png", {
        frameWidth: 16,
        frameHeight: 16
    });
}

function create ()
{
    // Creating player animation from spritesheet
    this.anims.create({
        key: "sprPlayer",
        frames: this.anims.generateFrameNumbers("sprPlayer"),
        frameRate: 20,
        repeat: -1
    });

    // Instantiating Player object
    this.player = new Player(
        this,
        this.game.config.width * 0.5,
        this.game.config.height * 0.5,
        "sprPlayer"
    );

    // Keyboard input variables
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update ()
{
    this.player.update();

    // Handling controls
    // TODO: Put in a handleInput() function
    // TODO: Refactor controls to fix faster diagonal movement (ie. y_axis = down - up; x_axis = right - left; movement = clamped vector(x_axis, y_axis)
    if (this.keyZ.isDown) {
        this.player.moveUp();
    }
    else if (this.keyS.isDown) {
        this.player.moveDown();
    }
    if (this.keyQ.isDown) {
        this.player.moveLeft();
    }
    else if (this.keyD.isDown) {
        this.player.moveRight();
    }
}
