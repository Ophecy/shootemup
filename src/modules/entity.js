/**
 * Represents a graphical entity.
 */
class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type){
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this); // Adds this entity to the scene
        this.scene.physics.world.enableBody(this, 0);

        // setData() keeps game-related data neatly separated from the objects' programming
        this.setData("type", type);
        this.setData("isDead", false);
        this.play(key); // TODO: Put this function call in child entities? ie. Player
    }
}

export default Entity;
