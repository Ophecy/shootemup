/**
 * Enemy module.
 * @module src/modules/enemy
 * @see module:src/modules/entity
 */
import Entity from "./entity.js";
import RNG from "./rng.js";
import Projectile from "./projectile.js";

/**
 * Represents an enemy.
 * @extends Entity
 */
class Enemy extends Entity {
    /**
     * Creates an enemy.
     * @param {Object} scene - The scene this object belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {string} key - The key of the animation to play.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Enemy");

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
        this.setData("projectileDamage", 50);

        // Add enemy to the physics group of enemies
        this.scene.enemies.add(this);
    }

    // TODO: Improve and fix movement
    /**
     * Moves this object randomly.
     */
    moveRandom() {
        let decision = RNG.getRandomInt(0, 4);
        switch (decision) {
            case 0:
                break;
            case 1:
                this.moveUp();
                break;
            case 2:
                this.moveDown();
                break;
            case 3:
                this.moveLeft();
                break;
            case 4:
                this.moveRight();
                break;
            default:
                break;
        }
    }

    /**
     * Tries shooting a projectile. Succeeds if random number == chance.
     * @param chance
     */
    tryShooting(chance) {
        let decision = RNG.getRandomInt(0, chance);
        switch (decision) {
            case 0:
                break;
            case chance:
                this.shoot();
                break;
            default:
                break;
        }
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
            var projectile = new Projectile(this.scene, this.x, this.y, 1, "sprProjectile", "Enemy", this.getData("projectileDamage"));
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000 / this.getData("fireRate");
        }
    }

    /**
     * Checks this entity's health data and kills it if its health is <= 0.
     */
    checkLife()
    {
        if (this.getData("health") <= 0)
        {
            //this.scene.enemies.remove(this);
            this.die(); // Kills entity
        }
    }

    /**
     * Updates this entity.
     * @todo Delete useless expressions.
     */
    update() {
        if (!this.getData("isDead")) // Updates if entity IS NOT dead
        {
            this.checkLife();

            this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

            if (this.scene.time.now > this.nextShot)
            {
                this.setData("canShoot", true);
            }

            // Moves randomly and tries shooting
            this.moveRandom();
            this.tryShooting(5);

            // Keeps player inside the bounds of the screen
            this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
            this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
        }
        else // Updates if entity IS dead
        {
            //this.scene.physics.world.disableBody(this);
            //this.moveDown();
            this.body.destroy();
            //this.body.checkCollision.none = true;
            this.y += 2; // Moves this entity downwards. Can't use moveDown() because the entity's body is destroyed, thus unaffected by physics.

            // Destroys this entity and delete the object if despawn delay is reached
            if (this.scene.time.now > this.despawnDelay)
            {
                this.destroy(true);
                delete this;
            }
        }
    }
}

/**
 * Exports the Enemy class as default.
 */
export default Enemy;
