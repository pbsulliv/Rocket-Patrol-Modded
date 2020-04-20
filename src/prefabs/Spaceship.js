// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, positionFunc) {
        super(scene, x, y, texture, frame);
  
        // add object to existing scene
        scene.add.existing(this);  //add to existing, displayList, updateList
        this.points = pointValue;
        this.positionFunc = positionFunc;
    }

    update() {
        // move spaceship left
        this.x = this.positionFunc(this.x);
     
        // wraparound screen bounds
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}