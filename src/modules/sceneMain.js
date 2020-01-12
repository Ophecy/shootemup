/**
 * Main scene module.
 * @module src/modules/sceneMain
 */
import Enemy from "./enemy.js";
import Player from "./player.js";

/**
 * Represents the main scene of the game, where the gameplay takes place.
 */
class SceneMain extends Phaser.Scene {

    /**
     * Creates the main scene with an appropriate key.
     */
    constructor() {
        super({key: "SceneMain"});
    }

    /**
     * Spawns an enemy at given x,y coordinates by instantiating an Enemy object.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @returns {Enemy} The instantiated Enemy.
     */
    spawnEnemy(x, y) {
        if (this.game.global.debug) console.log("In SceneMain.spawnEnemy()");
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
    hitEnemy(enemy, projectile) {
        enemy.damageEntity(projectile.getData("damage"));
        projectile.die();
        //enemy.anims.play('hurt'); // May play an animation
    }

    /**
     * Callback function called when the player collides with an enemy.
     * @param {Player} player - The player colliding with the enemy.
     * @param {Enemy} enemy - The enemy colliding with the player.
     */
    hitPlayer(player, enemy) {
        player.damageEntity(9999);
        //player.anims.play('hurt'); // May play an animation
    }

    /**
     * Callback function called when the player collides with an enemy projectile.
     * @param {Player} player - The player colliding with the enemy.
     * @param {Projectile} projectile - The projectile hitting the player.
     */
    projectileHitPlayer(player, projectile) {
        player.damageEntity(projectile.getData("damage"));
        projectile.die(); // Destroy projectile
        //player.anims.play('hurt'); // May play an animation
    }

    // Phaser functions
    /**
     * The preload function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback|Phaser.Types.Scenes.ScenePreloadCallback}
     */
    preload() {
        // Loading font for score & stuff
        this.load.bitmapFont('promptFont', 'assets/fonts/promptFont.png', 'assets/fonts/promptFont.fnt');

        // Loading background image
        this.load.image('bgSpace', 'assets/bgSpace.png');

        // HealthBar
        this.load.image('sprHealthBarFull', 'assets/sprHealthbarFull.png');
        this.load.image('sprHealthBarEmpty', 'assets/sprHealthbarEmpty.png');

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
    create() {
        // HUD
        /*
        this.bitmapScore = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height*0.6, 'promptFont', "...", 16);
        this.bitmapScore.setOrigin(0.5);
        this.bitmapScore.setDepth(1000);
         */

        // Handling time
        this.clock = new Phaser.Time.Clock(this);
        //this.playerFireDelay = this.clock.addEvent();

        // Creating physics groups for collisions handling
        this.enemies = this.physics.add.group();
        this.playerProjectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();

        // Setting background properties (tile and scroll speed)
        /**
         * @var bg
         * @description The background image of the scene.
         * @todo 1) Replace white in bgSpace with alpha; 2) Add bgColor background before bgSpace
         * @type {Phaser.GameObjects.TileSprite}
         */
        this.bg = this.add.tileSprite(0, 0, this.game.config.width * 2, this.game.config.height * 2, 'bgSpace');
        this.bgScrollSpeed = 2;

        this.playerHealthBar = this.add.image(this.game.config.width*0.10, this.game.config.height*0.010, "sprHealthBarFull");
        this.playerHealthBarBackground = this.add.image(this.game.config.width*0.10, this.game.config.height*0.010, "sprHealthBarEmpty");

        this.playerHealthBar.setOrigin(0, 0);
        this.playerHealthBarBackground.setOrigin(0, 0);

        this.playerHealthBar.setDepth(2);
        this.playerHealthBarBackground.setDepth(1);

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
        this.physics.add.collider(this.player, this.enemies, this.hitPlayer, null, this);
        this.physics.add.collider(this.enemies, this.playerProjectiles, this.hitEnemy, null, this);
        this.physics.add.collider(this.player, this.enemyProjectiles, this.projectileHitPlayer, null, this);

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

        // Spawning enemies
        this.time.addEvent({
            delay: 1000, // Spawns one enemy every 5 seconds
            callback: function () {
                var enemy = this.spawnEnemy(Phaser.Math.Between(0, this.game.config.width), 0)
            },
            callbackScope: this,
            loop: true
        });

        this.bitmapScore = this.add.bitmapText(this.game.config.width * 0.20, this.game.config.height*0.05, 'promptFont', `Score: ${this.game.global.score}`, 16);
        this.bitmapScore.setOrigin(0.5);
        this.bitmapScore.setDepth(1);
        if (this.game.global.debug) console.log(this.bitmapScore)
    }

    /**
     * The update function of the scene.
     * @see {@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#.update__anchor|Phaser.Scene.update}
     */
    update() {
        // Background scrolling
        this.bg.tilePositionY -= this.bgScrollSpeed;
        //this.bitmapScore.text = `Score: ${this.game.global.score}`;

        // Scoring
        if (this.game.global.addedPoints != 0 && this.game.global.addedPointsMultiplier != 0){
            this.bitmapScore.text = `Score: ${this.game.global.score}\n+${this.game.global.addedPoints}x${this.game.global.addedPointsMultiplier}`;
        }
        else if (this.game.global.addedPoints != 0 && this.game.global.addedPointsMultiplier == 0)
        {
            this.bitmapScore.text = `Score: ${this.game.global.score}\n+${this.game.global.addedPoints}`;

        }
        else {
            this.bitmapScore.text = `Score: ${this.game.global.score}`;
        }


        // Entity updates
        this.player.update();

        // Healthbar, updated AFTER player

        this.playerHealthBar.scaleX = this.player.getData("health");
        //this.playerHealthBarBackground.scaleX = this.player.getData("maxHealth");

        // Loop through enemies for updates
        for (let i = 0; i < this.enemies.countActive(); i++) {
            this.enemies.getChildren()[i].update();
        }

        // Loop through projectiles for updates
        for (let i = 0; i < this.playerProjectiles.countActive(); i++) {
            this.playerProjectiles.getChildren()[i].update();
        }

        // Loop through projectiles for updates
        for (let i = 0; i < this.enemyProjectiles.countActive(); i++) {
            this.enemyProjectiles.getChildren()[i].update();
        }

        // Handling controls
        // TODO: Put in a handleInput() function
        // TODO: Refactor controls to fix faster diagonal movement (ie. y_axis = down - up; x_axis = right - left; movement = clamped vector(x_axis, y_axis)
        // Movement
        if (this.moveUpKey.isDown) {
            this.player.moveUp();
        } else if (this.moveDownKey.isDown) {
            this.player.moveDown();
        }
        if (this.moveLeftKey.isDown) {
            this.player.moveLeft();
        } else if (this.moveRightKey.isDown) {
            this.player.moveRight();
        }
        // Shooting
        if (this.shootKey.isDown) {
            this.player.shoot();
        }
    }
}

/**
 * Exports class SceneMain as default.
 */
export default SceneMain;
