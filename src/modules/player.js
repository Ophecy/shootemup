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
     * @param {Phaser.Scene} scene - The scene this entity belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {string} key - The key of the animation to play.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player"); // Calls parent constructor, assigning this object the data (type: "Player") (accessed with getData(key))

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 200);

        // Shooting
        this.setData("canShoot", true); // Used to add a delay between fires
        this.setData("fireRate", 10); // The fire rate in projectile/second

        // Default stats
        this.setData("maxHealth", 100);
        this.setData("health", this.getData("maxHealth"));
        this.setData("maxShield", 50);
        this.setData("shield", this.getData("maxShield"));
        this.setData("projectileDamage", 50); // The damage inflicted by this entity's projectiles
        this.setData("isInvincible", false); // Used to add invincibility frames between hits
        this.setData("invincibilityDuration", 500); // The time in ms the entity will ignore damage after being hit
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
        if (this.getData("canShoot")) {
            var projectile = new Projectile(this.scene, this.x, this.y, -1, "sprProjectile", this.getData("type"), this.getData("projectileDamage"));
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000 / this.getData("fireRate");
        }
    }

    /**
     * Checks that this entity's health is > 0. Kills it otherwise by calling die().
     */
    checkLife() {
        if (this.getData("health") <= 0) {
            this.die();
        }
    }

    /**
     * Kills this entity.
     */
    die() {
        this.setTint(0xffffff); // Revert tint to normal
        this.setData("isDead", true);
        this.play("sprExplosion");
        this.despawnDelay = this.scene.time.now + 2000;
        //this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        //this.disableBody(true, true);
    }

    /**
     * Applies damage to an entity, and sets a temporary invincibility.
     * @param {number} damage - The incoming damage.
     */
    damageEntity(damage) {
        let appliedDamage = damage; // TODO: Add algorithms like damage - shield, then decrease shield, etc.

        if (!this.getData("isInvincible")) {
            this.setTint(0xFF0000);
            let newHealth = this.getData("health") - appliedDamage;
            this.setData("health", newHealth);

            this.setData("isInvincible", true);
            this.invincibilityTime = this.scene.time.now + this.getData("invincibilityDuration");

            //this.checkLife();
        }
    }

    /**
     * Updates this entity.
     */
    update() {
        if (!this.getData("isDead")) // Updates if player IS NOT dead
        {
            this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
            // pass
            this.checkLife(); // Check alive status
            // Checks if next shot delay has been reached to allow the player to shoot again
            if (this.scene.time.now > this.nextShot) {
                this.setData("canShoot", true);
            }

            // Checking invincibility frames
            if (this.getData("isInvincible") && this.scene.time.now > this.invincibilityTime) // Remove temporary invincibility
            {
                this.setData("isInvincible", false);
                this.setTint(0xffffff); // Revert tint to normal
            }
        } else { // Updates if player IS dead
            console.log("Inside Player isDead");
            this.body.destroy();
            this.y += 2;
            // Destroys player if delay is reached
            if (this.scene.time.now > this.despawnDelay) {
                console.log("Inside Player after despawn Delay");
                //this.scene.physics.world.disableBody(this);

                // TODO: Check that the following don't cause bugs
                // TODO: Implement scene change to SceneGameOver (NEED TO IMPLEMENT SCENE SWITCHING FIRST)
                this.scene.scene.start("SceneGameOver");
                //this.destroy(true);
                //delete this;
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
