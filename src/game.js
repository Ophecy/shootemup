/*
 DON'T FORGET to add .js extension when using WebStorm's auto-import, or Firefox will throw an exception
 GOOD: "./modules/enemy.js"
 BAD: "./modules/enemy" <= Should work, but causes a bug in Firefox
*/

import SceneMainMenu from "./modules/sceneMainMenu.js";
import SceneMain from "./modules/sceneMain.js";
import SceneGameOver from "./modules/sceneGameOver.js";

/**
 * @var root
 * @description Keeps a reference to the global scope (this).
 */
var root = this; // Just in case

/**
 * @var config
 * @description Phaser config object.
 * @type {{roundPixels: boolean, backgroundColor: string, pixelArt: boolean, physics: {default: string, arcade: {debug: boolean, gravity: {x: number, y: number}}}, width: number, scale: {mode: integer, autoCenter: integer}, type: (integer|integer), height: number, scene: {mode: integer, parent: string, create: create, update: update, preload: preload}}}
 */
var config = {
    type: Phaser.AUTO,
    width: 256 * 2,
    height: 512 * 2,
    backgroundColor: 'black',
    physics: {
        default: 'arcade', // Simple physics
        arcade: {
            gravity: {x: 0, y: 0},
            debug: false
        }
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: false, // Keeps it crispy
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

/**
 * @var game
 * @description Phaser game object, initialized with config.
 * @see config
 */
var game = new Phaser.Game(config); // Initializing game with config object
game.global = {
    score: 0,
    addedPoints: 0,
    addedPointsMultiplier: 0,
    finalScore: 0,
    noHitCount: 0
};
//console.log("In game.js");
