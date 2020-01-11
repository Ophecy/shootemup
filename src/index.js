import Player from "./modules/player.js";
import Enemy from "./modules/enemy.js";
// DON'T FORGET to add .js extension when using WebStorm's auto-import, or Firefox will throw an exception
// GOOD: "./modules/enemy.js"
// BAD: "./modules/enemy" <= Should work, but causes a bug in Firefox

/**
 * @var root
 * @description Keeps a reference to the global scope (this).
 */
var root = this; // Just in case

/**
 * @var config
 * @description Phaser config object.
 * @type {{roundPixels: boolean, backgroundColor: string, pixelArt: boolean, physics: {default: string, arcade: {debug: boolean, gravity: {x: number, y: number}}}, width: number, scale: {mode: integer, autoCenter: integer}, type: (integer|integer), height: number, scene: {mode: integer, parent: string, create: create, update: update, preload: preload}}}
 */
var config = {
    type: Phaser.AUTO,
    width: 256*2,
    height: 512*2,
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

/**
 * @var game
 * @description Phaser game object, initialized with config.
 * @see config
 */
var game = new Phaser.Game(config); // Initializing game with config object

/**
 * Spawns an enemy at given x,y coordinates by instantiating an Enemy object.
 * @param {number} x - The x value.
 * @param {number} y - The y value.
 * @returns {Enemy} The instantiated Enemy.
 */
function spawnEnemy(x, y){
    return new Enemy(
        this,
        x,
        y,
        "sprEnemy"
    );
}

// Collision functions
// Helpful functions
/**
 * Callback function called when a player-owned projectile collides with an enemy.
 * @param {Enemy} enemy - The enemy hit by the projectile.
 * @param {Projectile} projectile - The projectile hitting the enemy.
 */
function hitEnemy(enemy, projectile)
{
    //this.physics.pause();

    //enemy.setTint(0xff0000);
    //enemy.die();
    let newHealth = enemy.getData("health") - projectile.getData("projectileDamage");
    enemy.setData("health", newHealth);
    projectile.die();
    //console.log("collision");

    //enemy.anims.play('turn');

    //gameOver = true;
}

/**
 * Callback function called when the player collides with an enemy.
 * @param {Player} player - The player colliding with the enemy.
 * @param {Enemy} enemy - The enemy colliding with the player.
 */
function hitPlayer(player, enemy)
{
    //this.physics.pause();

    //enemy.setTint(0xff0000);
    let newHealth = player.getData("health") - 9999; // INSTAKILL ON ENEMY HIT
    player.setData("health", newHealth);
    //enemy.die(); // Don't kill or damage the enemy

    //enemy.anims.play('turn');

    //gameOver = true;
}

/**
 * Callback function called when the player collides with an enemy projectile.
 * @param {Player} player - The player colliding with the enemy.
 * @param {Projectile} projectile - The projectile hitting the player.
 */
function projectileHitPlayer(player, projectile)
{
    //this.physics.pause();

    //enemy.setTint(0xff0000);
    let newHealth = player.getData("health") - projectile.getData("projectileDamage");
    player.setData("health", newHealth);
    projectile.die(); // Don't kill or damage the enemy

    //enemy.anims.play('turn');

    //gameOver = true;
}

// Phaser functions
/**
 * The preload function of the scene.
 * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback|Phaser.Types.Scenes.ScenePreloadCallback}
 */
function preload ()
{
    // Loading background image
    this.load.image('bgSpace', 'assets/bgSpace.png');

    // Loading player spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprPlayer", "assets/sprPlayer.png", {
        frameWidth: 64,
        frameHeight: 64
    });

    // Loading enemy spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprEnemy", "assets/sprEnemy.png", {
        frameWidth: 64,
        frameHeight: 64
    });

    // Loading projectile spritesheet (just a single frame at the moment)
    this.load.spritesheet("sprProjectile", "assets/sprProjectile.png", {
        frameWidth: 16,
        frameHeight: 16
    });

    // Loading explosion spritesheet
    this.load.spritesheet("sprExplosion", "assets/sprExplosion.png", {
        frameWidth: 64,
        frameHeight: 64
    });
}

/**
 * The create function of the scene.
 * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback|Phaser.Types.Scenes.SceneCreateCallback}
 */
function create ()
{
    // Handling time
    this.clock = new Phaser.Time.Clock(this);
    //this.playerFireDelay = this.clock.addEvent();

    // Creating physics groups for collisions handling
    this.enemies = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();

    // Setting background properties (tile and scroll speed)
    // TODO: 1) Replace white in bgSpace with alpha; 2) Add bgColor background before bgSpace
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

    // Creating explosion animation from spritesheet
    this.anims.create({
        key: "sprExplosion",
        frames: this.anims.generateFrameNumbers("sprExplosion"),
        frameRate: 74,
        repeat: 0
    });

    // Adding necessary collisions
    this.physics.add.collider(this.player, this.enemies, hitPlayer, null, this);
    this.physics.add.collider(this.enemies, this.playerProjectiles, hitEnemy, null, this);
    this.physics.add.collider(this.player, this.enemyProjectiles, projectileHitPlayer, null, this);

    // Keyboard input variables
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Controls input variables
    // Useful if rebinding keys or control configurations are implemented (ie. the option to choose between QWERTY and AZERTY, etc.)
    this.moveUpKey = this.keyZ;
    this.moveDownKey = this.keyS;
    this.moveLeftKey = this.keyQ;
    this.moveRightKey = this.keyD;
    this.shootKey = this.keySpace;
}

/**
 * The update function of the scene.
 * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#.update__anchor|Phaser.Scene.update}
 */
function update ()
{
    // Background scrolling
    this.bg.tilePositionY -= this.bgScrollSpeed;

    // Entity updates
    this.player.update();
    //this.enemy.update();

    // Loop through enemies for updates
    for (let i = 0; i < this.enemies.countActive(); i++){
        this.enemies.getChildren()[i].update();
    }

    // Loop through projectiles for updates
    for (let i = 0; i < this.playerProjectiles.countActive(); i++){
        this.playerProjectiles.getChildren()[i].update();
    }

    // Loop through projectiles for updates
    for (let i = 0; i < this.enemyProjectiles.countActive(); i++){
        this.enemyProjectiles.getChildren()[i].update();
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
