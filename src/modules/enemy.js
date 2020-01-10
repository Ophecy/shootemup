import Entity from "./entity.js";
import RNG from "./rng.js";
import Projectile from "./projectile.js";

class Enemy extends Entity {
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

        // Add enemy to the physics group of enemies
        this.scene.enemies.add(this);
    }

    // TODO: Improve and fix movement
    moveRandom() {
        var decision = RNG.getRandomInt(0, 4);
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

    tryShooting(chance) {
        var decision = RNG.getRandomInt(0, chance);
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
        if (this.getData("canShoot")) {
            var projectile = new Projectile(this.scene, this.x, this.y, "sprProjectile", "Enemy");
            this.setData("canShoot", false);
            this.nextShot = this.scene.time.now + 1000 / this.getData("fireRate");
        }
    }

    checkLife()
    {
        if (this.getData("health") <= 0)
        {
            //this.scene.enemies.remove(this);
            this.die();
        }
    }

    update() {
        if (!this.getData("isDead"))
        {
            this.checkLife();

            this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

            if (this.scene.time.now > this.nextShot)
            {
                this.setData("canShoot", true);
            }

            this.moveRandom();
            this.tryShooting(5);
            // Keeps player inside the bounds of the screen
            this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
            this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
        }
        else
        {
            //this.scene.physics.world.disableBody(this);
            //this.moveDown();
            this.body.destroy();
            //this.body.checkCollision.none = true;
            this.y += 2;
            if (this.scene.time.now > this.despawnDelay)
            {
                this.destroy(true);
                delete this;
            }
        }
    }
}

export default Enemy;
