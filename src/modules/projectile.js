import Entity from "./entity.js";

/**
 * Represents a projectile entity.
 */
class Projectile extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Projectile");

        // Add projectile to the physics group of player projectiles
        // TODO: Add an argument to determine if it has to be added to player projectiles or enemy projectiles
        this.scene.playerProjectiles.add(this);

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 400);
    }

    update() {
        this.body.velocity.y = -this.getData("speed");

        if (this.x <= 0 || this.y <= 0 || this.x >= this.scene.game.config.width || this.y >= this.scene.game.config.height){
            this.destroy(true);
            delete this;
        }
    }
}

export default Projectile;
