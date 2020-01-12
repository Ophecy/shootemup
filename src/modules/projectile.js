/**
 * Projectile module.
 * @module src/modules/projectile
 * @see module:src/modules/entity
 */
import Entity from "./entity.js";

/**
 * Represents a projectile.
 * @extends Entity
 */
class Projectile extends Entity {
    /**
     * Creates a projectile.
     * @param {Object} scene - The scene this object belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} direction - The y direction or the projectile (-1: up, 0: static, 1: down).
     * @param {string} key - The key of the animation to play.
     * @param {string} owner - The string representation of the entity that fired this ("Player" or "Enemy").
     * @param {number} damage - The damage inflicted to entities colliding with this.
     */
    constructor(scene, x, y, direction, key, owner, damage) {
        super(scene, x, y, key, "Projectile"); // Calls parent constructor

        /**
         * The owner of the projectile, either the player or an enemy.
         * @var owner
         * @type {string}
         */
        this.owner = owner;

        /**
         * The direction the projectile moves on the y-axis. Either -1 for up, 0 for none, 1 for down.
         * @var direction
         * @type {number}
         */
        this.direction = direction;

        // Gameplay related data (as opposed to functional, OOP data if that makes sense)
        this.setData("speed", 400); // The speed at which the projectiles moves
        this.setData("damage", damage); // The damage inflicted by the projectile

        // Add projectile to appropriate physics group
        if (this.owner == "Player") {
            this.scene.playerProjectiles.add(this);
        } else if (this.owner == "Enemy") {
            this.scene.enemyProjectiles.add(this);
        }

        console.log(this.owner);
    }

    /**
     * Destroys the projectile.
     */
    die() {
        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        this.scene.physics.world.disableBody(this);
        this.destroy(true);
        delete this;
    }

    /**
     * Updates the projectile. Should be called
     */
    update() {
        this.body.velocity.y = this.direction * this.getData("speed");

        // Destroys projectile when out of bounds by calling die()
        if (this.x <= 0 || this.y <= 0 || this.x >= this.scene.game.config.width || this.y >= this.scene.game.config.height) {
            this.die();
        }
    }
}

/**
 * Exports the Projectile class as default.
 */
export default Projectile;
