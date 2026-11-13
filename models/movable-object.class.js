class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    coins = 0;
    bottles = 0;
    deadSound;
    soundPlayed = false;
    world;

    lastHit = 0;
    lastCoinCollect = 0;
    lastBottleCollect = 0;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    /** Applies gravity to this object over time. */
    applyGravity() {
        setInterval(() => {
            if (this.world && this.world.gameOver) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25)
    }

    /** Returns whether this object is above the ground. */
    isAboveGround() {
        if (this instanceof ThrowableObject) { // Throwable object should always fall
            return true;
        } else {
            return this.y < 155;
        }
    }


    // character.isColliding(chicken);
    /**
     * Checks whether this object collides with another movable object.
     * @param {MovableObject} mo The other object.
     * @returns {boolean} Whether the objects overlap.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left && // CHECK RIGHT -> LEFT
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // CHECK TOP -> BOTTOM
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // CHECK LEFT -> RIGHT
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom; // CHECK BOTTOM -> TOP
    }


    /**
     * Applies damage to this object.
     * @param {number} damage The amount of damage.
     */
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /** Adds one coin collection's value to the object. */
    collectCoin() {
        this.coins += 20;
        this.lastCoinCollect = new Date().getTime();
    }

    /** Adds one bottle collection's value to the object. */
    collectBottle() {
        this.bottles += 10;
        this.lastBottleCollect = new Date().getTime();
    }


    /** Returns whether this object is still within its hurt interval. */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000 //Difference in s
        return timepassed < 1;
    }

    /** Returns whether this object's energy is depleted. */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Advances and displays the next animation frame.
     * @param {string[]} images The animation image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; // let i = 6 % 6; => 1, Rest 0 
        // i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Moves the object right by its current speed. */
    moveRight() {
        this.x += this.speed;
    }

    /** Moves the object left by its current speed. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Sets the object's upward jump velocity. */
    jump() {
        this.speedY = 30;
    }
}