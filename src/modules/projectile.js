import Entity from "./entity.js";

/**
 * Represents a projectile entity.
 */
class Projectile extends Entity {
    constructor(scene, x, y, key, owner) {
        super(scene, x, y, key, "Projectile");


        // Add projectile to the physics group of player projectiles
        // TODO: Add an argument to determine if it has to be added to player projectiles or enemy projectiles
        //this.scene.playerProjectiles.add(this);
        this.owner = owner;
        console.log(this.owner);
        if (this.owner == "Player")
        {
            this.scene.playerProjectiles.add(this);
        }
        if (this.owner == "Enemy")
        {
            this.scene.enemyProjectiles.add(this);
        }

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 400);
    }

    die(){
        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        this.scene.physics.world.disableBody(this);
        this.destroy(true);
        delete this;
    }

    update() {
        this.body.velocity.y = -this.getData("speed");

        if (this.x <= 0 || this.y <= 0 || this.x >= this.scene.game.config.width || this.y >= this.scene.game.config.height){
            this.scene.physics.world.disableBody(this);
            this.destroy(true);
            delete this;
        }
    }
}

export default Projectile;
