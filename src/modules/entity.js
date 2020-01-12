/**
 * Entity module.
 * @module src/modules/entity
 */

/**
 * Represents an entity with a graphical representation and data attributes.
 * @extends Phaser.GameObjects.Sprite
 */
class Entity extends Phaser.GameObjects.Sprite {
    /**
     * Creates an Entity.
     * @param {Phaser.Scene} scene - The scene this entity belongs to.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {string} key - The key of the animation to play.
     * @param {string} type - The type of this entity, ie. "Player" or "Enemy".
     */
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key); // Calls parent constructor
        this.scene = scene;
        this.scene.add.existing(this); // Adds this entity to the scene
        this.scene.physics.world.enableBody(this, 0); // Enables this entity's physics body

        // setData() keeps game-related data neatly separated from the objects' programming
        this.setData("type", type);
        this.setData("isDead", false);
        this.play(key); // TODO: Put this function call in child entities? ie. Player
    }

    /**
     * Kills this entity.
     */
    die() {
        this.setTint(0xffffff); // Revert tint to normal
        this.setData("isDead", true);
        this.play("sprExplosion");
        // this.scene.physics.world.disableBody(this);
        //this.body.velocity.y = this.getData("speed");
        //this.setPosition(this.x, this.y);

        this.despawnDelay = this.scene.time.now + 2000; // Keeps track of time since death to delay object deletion
        //this.destroy();
        //delete this;
    }
}

/**
 * Exports the Entity class as default.
 */
export default Entity;
