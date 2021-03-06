"use strict"
class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
      
      // holds the time that the game actually started
      this.startTime = undefined;

      // no extra time left
      this.extraTime = 0;

      // extra speed
      this.extraSpeed = 0;

      // score display
      this.scoreConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'right',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 100
      }
    }
    
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield2.png');

        // load spritesheet
        this.load.spritesheet('explosion2', './assets/explosion2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 25});
        this.load.spritesheet('spaceshipAni', './assets/Spaceship1SpriteSheet1.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 4});
        this.load.spritesheet('spaceshipStealth', './assets/StealthShip-sheet.png', {frameWidth: 40, frameHeight: 55, startFrame: 0, endFrame: 43});
        this.load.spritesheet('RocketAni', './assets/Rocket2-sheet.png', {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 8});



    }

    create() {    
        // calculates the next ship position using the global space ship speed    
        const nextShipPositionConstant = (x) => {
            return x - game.settings.spaceshipSpeed - this.extraSpeed;
        };

        // calculates the next ship position using the global space ship speed
        const nextShipPositionSin = (x) => {
            return x - (1 + (game.settings.spaceshipSpeed + this.extraSpeed)  * (1 + Math.sin(x * Math.PI / 106)));
        };

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceshipStealth', 0, 40, nextShipPositionSin).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceshipAni', 0, 20, nextShipPositionConstant).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceshipAni', 0, 10, nextShipPositionConstant).setOrigin(0,0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 420, 'RocketAni').setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // explosion animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 25, first: 0}),
            frameRate: 30
        });

        // spaceship animation config
        this.anims.create({
            key: 'spaceshipAni',
            frames: this.anims.generateFrameNumbers('spaceshipAni', { start: 0, end: 3, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        // stealthship animation config
        this.anims.create({
            key: 'spaceshipStealth',
            frames: this.anims.generateFrameNumbers('spaceshipStealth', { start: 0, end: 43, first: 0}),
            frameRate: 20,
            repeat: -1
        });

        // Rocket animation config
        this.anims.create({
            key: 'RocketAni',
            frames: this.anims.generateFrameNumbers('RocketAni', { start: 0, end: 8, first: 0}),
            frameRate: 20,
            repeat: -1
        });

        //Animate Spaceships
        this.ship01.anims.play('spaceshipStealth');
        this.ship02.anims.play('spaceshipAni');
        this.ship03.anims.play('spaceshipAni');

        // score
        this.p1Score = 0;
        this.scoreLeft = this.add.text(69, 54, this.p1Score, this.scoreConfig);

        // game over flag
        this.gameOver = false;

        // time remaining
        this.timerRight = this.add.text(471, 54, game.settings.gameTimer, this.scoreConfig);
    }

    update() {
        // record the time when the game actually started playing
        if (this.startTime === undefined) {
            this.startTime = this.time.now;
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            // reset startTime and extra time for the next game
            this.startTime = undefined;
            this.extraTime = 0;
            this.extraSpeed = 0;

            this.scene.restart(this.p1Score);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // reset startTime and extra time for the next game
            this.startTime = undefined;
            this.extraTime = 0;
            this.extraSpeed = 0;
        
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.extraTime += 2000; 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.extraTime += 4000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.extraTime += 6000;
        }

        // speed up ships after 30 seconds
        if (this.time.now - this.startTime > 30000) {
            this.extraSpeed = 1;
        }

        let timeLeft;

        if (!this.gameOver) {
            const timeLeftMillis = game.settings.gameTimer + this.startTime + this.extraTime - this.time.now;
            timeLeft = Math.round(timeLeftMillis / 1000);
        }
    
        // check if game is over
        if (timeLeft <= 0) {
            //copy scoreConfig but remove the fixed width for the text
            const labelConfig = {...this.scoreConfig, fixedWidth:0};
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', labelConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', labelConfig).setOrigin(0.5);
            this.gameOver = true;
        }

        if (this.gameOver) {
            timeLeft = "";        
        }

        this.timerRight.text = timeLeft;
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });  
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        this.sound.play('sfx_explosion');       // play sound         
    }

}