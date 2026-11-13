class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;
    /**
     * Creates a background layer at the specified horizontal position.
     * @param {string} imagePath The image path for this layer.
     * @param {number} x The horizontal position.
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height; 
    }
}