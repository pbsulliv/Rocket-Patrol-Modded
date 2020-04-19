// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speed) {
        super(scene, x, y, texture, frame);
  
        // add object to existing scene
        scene.add.existing(this);  //add to existing, displayList, updateList
        this.points = pointValue;
        this.speed = speed;
    }

    update() {
        // move spaceship left
        //this.x -= this.speed;
        this.x -= 1 + this.speed * (1 + Math.sin(this.x * Math.PI / 106));
        // wraparound screen bounds
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}