import Entity from "./modules/entity.js";

var root = this;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        mode: Phaser.Scale.NONE,
        parent: 'shootemup',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
}

function create ()
{
}

function update ()
{
}
