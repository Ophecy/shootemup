import Entity from "./entity.js";
import Projectile from "./projectile.js";

/**
 * Represents the player entity.
 */
class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player");

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
    }

    // TODO: Rework controls to 1) prevent faster diagonal movement; 2) add acceleration and deceleration
    moveUp() {
        this.body.velocity.y = -this.getData("speed");
    }
    moveDown() {
        this.body.velocity.y = this.getData("speed");
    }
    moveLeft() {
        this.body.velocity.x = -this.getData("speed");
    }
    moveRight() {
        this.body.velocity.x = this.getData("speed");
    }

    shoot() {
        if (this.getData("canShoot")){
            var projectile = new Projectile(this.scene, this.x, this.y, "sprProjectile", "Player");
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000/this.getData("fireRate");
        }
    }

    checkLife()
    {
        if (this.getData("health") <= 0)
        {
            this.die();
        }
    }

    die(){
        this.setData("isDead", false);
        this.play("sprExplosion");
        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        //this.disableBody(true, true);
    }

    update() {
        this.checkLife();

        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

        if (this.scene.time.now > this.nextShot)
        {
            this.setData("canShoot", true);
        }

        if (!this.getData("isDead"))
        {
            // pass
        }
        else {
            if (this.scene.time.now > this.despawnDelay) {
                this.scene.physics.world.disableBody(this);
                this.destroy(true);
                delete this;
            }
        }


        // Keeps player inside the bounds of the screen
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    }
}

export default Player;
