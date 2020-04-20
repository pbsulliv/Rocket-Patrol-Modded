// Pierce Sullivan
//CMPM 120

//Mods:
//Implement the speed increase that happens after 30 seconds in the original game (10)
//Create a new scrolling tile sprite for the background (10)
//Display the time remaining (in seconds) on the screen (15)
//Create a new animated sprite for the Spaceship enemies (15)
//Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (25) 
//Implement a new timing/scoring mechanism that adds time to the clock for successful hits (25)
//FACADE Based on 25 point new enemy, new ship has new artwork, has lower width, and uses sin function to change movement speed (25)

let config = {
    type: Phaser.Auto,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000     
}

// reserve keyboard variables
let keyF, keyLEFT, keyRIGHT;