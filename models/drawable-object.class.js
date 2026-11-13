class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    // loadImage('img/test.png');
    loadImage(path) {
        this.img = new Image(); //this.img = document.getElementById('image') <img id="image" src>
        this.img.src = path;
    }

    drawFrame(ctx) {
        if (!this.hasCollisionFrame()) return;
        this.drawOuterFrame(ctx);
        this.drawInnerFrame(ctx);
    }

    hasCollisionFrame() {
        return this instanceof Character || this instanceof Chicken || this instanceof Coins
            || this instanceof Bottle || this instanceof ChickenSmall || this instanceof Endboss;
    }

    drawOuterFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
    }

    drawInnerFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = 'red';
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top,
            this.width - this.offset.right - this.offset.left, this.height - this.offset.top - this.offset.bottom);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
 * 
 * @param {Array} arr - ['img/image1.png', 'img/image2.png', ...]
 */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}