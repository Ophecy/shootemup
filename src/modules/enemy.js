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
     * @param {Phaser.Scene} scene - The scene this object belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {string} key - The key of the animation to play.
     */
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Enemy");

        this.body.velocity.y = Phaser.Math.Between(50, 100); // Temporary
        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 200);

        // Shooting
        this.setData("canShoot", true); // Used to add a delay between fires
        this.setData("fireRate", RNG.getRandomInt(1, 3, true)); // The fire rate in projectile/second

        // Default stats
        this.setData("maxHealth", 100);
        this.setData("health", this.getData("maxHealth"));
        this.setData("maxShield", 50);
        this.setData("shield", this.getData("maxShield"));
        this.setData("projectileDamage", 10); // The damage inflicted by this entity's projectiles

        this.setData("isInvincible", false); // Used to add invincibility frames between hits
        this.setData("invincibilityDuration", 100); // The time in ms the entity will ignore damage after being hit

        // Scoring
        this.setData("scoreValue", 10);

        // Set angle of enemy to face downward
        this.angle = 180;
        // Add enemy to the physics group of enemies
        this.scene.enemies.add(this); // TODO: Move this inside SceneMain enemy spawner
    }

    // TODO: Improve and fix movement
    /**
     * Moves this object randomly.
     */
    moveRandom() {
        let decision = RNG.getRandomInt(0, 4, true);
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
        let decision = RNG.getRandomInt(0, chance, true);
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
            var projectile = new Projectile(this.scene, this.x, this.y, 1, "sprProjectile", this.getData("type"), this.getData("projectileDamage"));
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000 / this.getData("fireRate");
        }
    }

    /**
     * Checks this entity's health data and kills it if its health is <= 0. Also destroys it if outside of bounds.
     */
    checkLife() {
        if (this.getData("health") <= 0) {
            //this.scene.game.global.score += this.getData("scoreValue");
            //console.log("add 10 to score: " + this.scene.game.global.score)
            //this.scene.enemies.remove(this);
            this.die(); // Kills entity
        }
        if (this.x > this.scene.game.config.width || this.y > this.scene.game.config.height) {
            this.setData("isDead", true);
            this.despawnDelay = this.scene.time.now + 2000; // Keeps track of time since death to delay object deletion
        }
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
     * Kills this enemy.
     */
    die() {
        this.setTint(0xffffff); // Revert tint to normal
        this.setData("isDead", true);
        this.play("sprExplosion");

        this.despawnDelay = this.scene.time.now + 2000; // Keeps track of time since death to delay object deletion

        // Scoring
        this.scene.game.global.addedPoints += this.getData("scoreValue");
        this.scene.game.global.noHitCount += 1;
        if (this.scene.game.global.noHitCount > 1)
        {
            this.scene.game.global.addedPointsMultiplier = 1 + this.scene.game.global.noHitCount/10;
        }
        else
        {
            this.scene.game.global.addedPointsMultiplier = 1;
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

            // Checking invincibility frames
            if (this.getData("isInvincible") && this.scene.time.now > this.invincibilityTime) // Remove temporary invincibility
            {
                this.setData("isInvincible", false);
                this.setTint(0xffffff); // Revert tint to normal
            }

            //this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

            if (this.scene.time.now > this.nextShot) {
                this.setData("canShoot", true);
            }

            // Moves randomly and tries shooting
            //this.moveRandom();
            this.moveDown();
            this.shoot();

            // Keeps enemy inside the bounds of the screen
            /*this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
            this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);*/
        } else // Updates if entity IS dead
        {
            //this.scene.physics.world.disableBody(this);
            //this.moveDown();
            this.body.destroy();
            //this.body.checkCollision.none = true;
            this.y += 2; // Moves this entity downwards. Can't use moveDown() because the entity's body is destroyed, thus unaffected by physics.

            // Destroys this entity and delete the object if despawn delay is reached
            if (this.scene.time.now > this.despawnDelay) {
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
