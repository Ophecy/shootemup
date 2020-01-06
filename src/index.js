var root = this;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    background: 'black',
    physics:  {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
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
    this.load.image('playerShip', 'assets/player_ship.png');
}

function create ()
{
    //this.add.image(0, 0, 'playerShip');

    player = this.physics.add.sprite(100, 450, 'playerShip');

    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}
