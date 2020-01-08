import Entity from "./entity.js";
import RNG from "./rng.js";

class Enemy extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Enemy");

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 200);

        /*this.clock = new Phaser.Time.Clock(this.scene);
        this.moveTimer = this.clock.addEvent({loop: true});*/
    }

    moveRandom() {
        var decision = RNG.getRandomInt(0, 4);
        switch (decision) {
            case 0:
                break;
            case 1:
                this.moveUp();
            case 2:
                this.moveDown();
            case 3:
                this.moveLeft();
            case 4:
                this.moveRight();
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

    update() {

        /*if (this.moveTimer.getElapsed() > 1000) {
            //this.moveTimer.reset({loop: true});
            this.moveRandom();
        }*/

        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement
        this.moveRandom();
        // Keeps player inside the bounds of the screen
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    }
}

export default Enemy;
