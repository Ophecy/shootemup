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

    die(){
        this.setData("isDead", true);
        this.play("sprExplosion");
       // this.scene.physics.world.disableBody(this);
        //this.body.velocity.y = this.getData("speed");
        //this.setPosition(this.x, this.y);

        this.despawnDelay = this.scene.time.now + 2000;
        //this.destroy();
        //delete this;
    }
}

export default Entity;
