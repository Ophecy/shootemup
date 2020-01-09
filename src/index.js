import Player from "./modules/player.js";
import Enemy from "./modules/enemy.js";

var root = this; // Just in case

// Phaser config object
var config = {
    type: Phaser.AUTO,
    width: 400,
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
    roundPixels: false,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config); // Initializing game with config object

function preload ()
{
    // Background
    this.load.image('bgSpace', 'assets/bgSpace.png');

    // Loading player spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprPlayer", "assets/sprPlayer.png", {
        frameWidth: 16,
        frameHeight: 16
    });

    // Loading enemy spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprEnemy", "assets/sprEnemy.png", {
        frameWidth: 16,
        frameHeight: 16
    });
}

function create ()
{
    // Scaling
    this.scale.setGameSize(this.game.config.width*2, this.game.config.height*2);

    // Background
    this.bg = this.add.tileSprite(0, 0, this.game.config.width*2, this.game.config.height*2, 'bgSpace');

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

    // Creating enemy animation from spritesheet
    this.anims.create({
        key: "sprEnemy",
        frames: this.anims.generateFrameNumbers("sprEnemy"),
        frameRate: 20,
        repeat: -1
    });

    this.enemy = new Enemy(
        this,
        this.game.config.width * 0.25,
        this.game.config.height* 0.25,
        "sprEnemy"
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
    // Background
    this.bg.tilePositionY += 2;

    // Entity updates
    this.player.update();
    this.enemy.update();

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
