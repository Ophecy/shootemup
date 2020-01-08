import Entity from "./entity.js";

/**
 * Represents the player entity.
 */
class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, "Player");

        // Could be in a variable, but having stats variables all over the place might be less readable
        this.setData("speed", 200);
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
        this.body.setVelocity(0, 0); // May need to be removed after implementing better movement

        // Keeps player inside the bounds of the screen
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    }
}

export default Player;
