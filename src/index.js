import Player from "./modules/player.js";
import Enemy from "./modules/enemy.js";
// DON'T FORGET to add .js extension when using WebStorm's auto-import, or Firefox will throw an exception
// GOOD: "./modules/enemy.js"
// BAD: "./modules/enemy" <= Should work, but causes a bug in Firefox

var root = this; // Just in case

// Phaser config object
var config = {
    type: Phaser.AUTO,
    width: 256,
    height: 512,
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
    roundPixels: false, // Keeps it crispy
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config); // Initializing game with config object

function preload ()
{
    // Loading background image
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

    // Loading projectile spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprProjectile", "assets/sprProjectile.png", {
        frameWidth: 16,
        frameHeight: 16
    });
}

function create ()
{
    // Creating physics groups for collisions handling
    this.enemies = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group();

    // Setting background properties (tile and scroll speed)
    this.bg = this.add.tileSprite(0, 0, this.game.config.width*2, this.game.config.height*2, 'bgSpace');
    this.bgScrollSpeed = 2;

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

    // Instantiating test enemy
    // TODO: Add multiple enemies once their behaviour has been improved
    this.enemy = new Enemy(
        this,
        this.game.config.width * 0.25,
        this.game.config.height* 0.25,
        "sprEnemy"
    );

    // Creating projectile animation from spritesheet
    this.anims.create({
        key: "sprProjectile",
        frames: this.anims.generateFrameNumbers("sprProjectile"),
        frameRate: 20,
        repeat: -1
    });

    // Adding necessary collisions
    this.physics.add.collider(this.player, this.enemies);
    this.physics.add.collider(this.enemies, this.playerProjectiles);

    // Keyboard input variables
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Controls input variables
    // Useful if rebinding keys or control configurations are implemented
    this.moveUpKey = this.keyZ;
    this.moveDownKey = this.keyS;
    this.moveLeftKey = this.keyQ;
    this.moveRightKey = this.keyD;
    this.shootKey = this.keySpace;
}

function update ()
{
    // Background scrolling
    this.bg.tilePositionY += this.bgScrollSpeed;

    // Entity updates
    this.player.update();
    this.enemy.update();

    // Loop through projectiles for updates
    for (let i = 0; i < this.playerProjectiles.countActive(); i++){
        console.log(this.playerProjectiles.getChildren());
        this.playerProjectiles.getChildren()[i].update();
    }

    // Handling controls
    // TODO: Put in a handleInput() function
    // TODO: Refactor controls to fix faster diagonal movement (ie. y_axis = down - up; x_axis = right - left; movement = clamped vector(x_axis, y_axis)
    // Movement
    if (this.moveUpKey.isDown) {
        this.player.moveUp();
    }
    else if (this.moveDownKey.isDown) {
        this.player.moveDown();
    }
    if (this.moveLeftKey.isDown) {
        this.player.moveLeft();
    }
    else if (this.moveRightKey.isDown) {
        this.player.moveRight();
    }
    // Shooting
    if (this.shootKey.isDown){
        this.player.shoot();
    }
}
