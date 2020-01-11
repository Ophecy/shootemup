/**
 * Player module.
 * @module src/modules/player
 * @see module:src/modules/entity
 */
import Entity from "./entity.js";
import Projectile from "./projectile.js";

/**
 * Represents the player entity.
 * @extends Entity
 */
class Player extends Entity {
    /**
     * Creates the player object.
     * @param {Object} scene - The scene this entity belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {string} key - The key of the animation to play.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player"); // Calls parent constructor, assigning this object the data (type: "Player") (accessed with getData(key))

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 200);

        // Shooting
        this.setData("canShoot", true);
        this.setData("fireRate",5);

        // Default stats
        this.setData("maxHealth", 100);
        this.setData("health", this.getData("maxHealth"));
        this.setData("maxShield", 50);
        this.setData("shield", this.getData("maxShield"));
        this.setData("projectileDamage", 50)
    }

    // TODO: Rework controls to 1) prevent faster diagonal movement; 2) add acceleration and deceleration
    /**
     * Moves this entity up.
     */
    moveUp() {
        this.body.velocity.y = -this.getData("speed");
    }

    /**
     * Moves this entity down.
     */
    moveDown() {
        this.body.velocity.y = this.getData("speed");
    }

    /**
     * Moves this entity left.
     */
    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
    }

    /**
     * Moves this entity right.
     */
    moveRight() {
        this.body.velocity.x = this.getData("speed");
    }

    /**
     * Fires a projectile.
     */
    shoot() {
        if (this.getData("canShoot")){
            var projectile = new Projectile(this.scene, this.x, this.y, -1, "sprProjectile", "Player", this.getData("projectileDamage"));
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000/this.getData("fireRate");
        }
    }

    /**
     * Checks that this entity's health is > 0. Kills it otherwise by calling die().
     */
    checkLife()
    {
        if (this.getData("health") <= 0)
        {
            this.die();
        }
    }

    /**
     * Kills this entity.
     */
    die(){
        this.setData("isDead", false);
        this.play("sprExplosion");
        this.despawnDelay = this.scene.time.now + 2000;
        //this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        //this.disableBody(true, true);
    }

    /**
     * Updates this entity.
     */
    update() {
        this.checkLife(); // Check alive status

        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

        // Checks if next shot delay has been reached to allow the player to shoot again
        if (this.scene.time.now > this.nextShot)
        {
            this.setData("canShoot", true);
        }

        if (!this.getData("isDead")) // Updates if player IS NOT dead
        {
            // pass
        }
        else { // Updates if player IS dead
            this.body.destroy();
            this.y += 2;
            // Destroys player if delay is reached
            if (this.scene.time.now > this.despawnDelay) {
                //this.scene.physics.world.disableBody(this);

                // TODO: Check that the following don't cause bugs
                // TODO: Implement scene change to SceneGameOver (NEED TO IMPLEMENT SCENE SWITCHING FIRST)
                this.destroy(true);
                delete this;
            }
        }


        // Keeps player inside the bounds of the screen
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    }
}

/**
 * Exports the Player class as default.
 */
export default Player;
