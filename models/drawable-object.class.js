class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    // loadImage('img/test.png');
    /**
     * Loads a single image into this drawable object.
     * @param {string} path The image path.
     */
    loadImage(path) {
        this.img = new Image(); //this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    /**
     * Draws the collision frames when this object supports them.
     * @param {CanvasRenderingContext2D} ctx The drawing context.
     */
    drawFrame(ctx) {
        if (!this.hasCollisionFrame()) return;
        this.drawOuterFrame(ctx);
        this.drawInnerFrame(ctx);
    }

    /** Returns whether this object has a collision frame. */
    hasCollisionFrame() {
        return this instanceof Character || this instanceof Chicken || this instanceof Coins
            || this instanceof Bottle || this instanceof ChickenSmall || this instanceof Endboss;
    }

    /**
     * Draws the object's outer frame.
     * @param {CanvasRenderingContext2D} ctx The drawing context.
     */
    drawOuterFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
    }

    /**
     * Draws the object's collision-offset frame.
     * @param {CanvasRenderingContext2D} ctx The drawing context.
     */
    drawInnerFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red';
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top,
            this.width - this.offset.right - this.offset.left, this.height - this.offset.top - this.offset.bottom);
    }

    /**
     * Draws the object's image.
     * @param {CanvasRenderingContext2D} ctx The drawing context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads image paths into the image cache.
     * @param {string[]} arr The image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}