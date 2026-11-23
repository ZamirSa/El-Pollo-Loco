let CHICKEN_VARIANTS = {
    normal: {
        y: 355,
        height: 70,
        width: 70,
        offset: { top: 4, bottom: 4, left: 2, right: 2 },
        walkingImages: [
            './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ],
        deadImage: './img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
        deadSound: './audio/chicken-dead.mp3'
    },
    small: {
        y: 380,
        height: 45,
        width: 45,
        offset: { top: 5, bottom: 5, left: 5, right: 5 },
        walkingImages: [
            './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ],
        deadImage: './img/3_enemies_chicken/chicken_small/2_dead/dead.png',
        deadSound: './audio/chicken-small-dead.wav'
    }
};

class Chicken extends MovableObject {
    /** Creates a chicken variant and starts its animation loops. */
    constructor(variantName = 'normal') {
        super();
        let variant = CHICKEN_VARIANTS[variantName];
        if (!variant) throw new RangeError(`Unknown chicken variant: ${variantName}`);
        this.configureVariant(variant);
        this.loadVariantImages(variant);
        this.initializeDeadSound(variant);
        this.initializeMovement();
        this.animate();
    }

    configureVariant(variant) {
        this.y = variant.y;
        this.height = variant.height;
        this.width = variant.width;
        this.offset = { ...variant.offset };
        this.IMAGES_WALKING = variant.walkingImages;
        this.IMAGES_DEAD = [variant.deadImage];
    }

    loadVariantImages(variant) {
        this.loadImage(variant.walkingImages[0]);
        this.loadImages([...this.IMAGES_WALKING, ...this.IMAGES_DEAD]);
    }

    initializeDeadSound(variant) {
        this.deadSound = createGameAudio(variant.deadSound);
        this.deadSound.volume = 0.5;
    }

    initializeMovement() {
        this.x = 300 + Math.random() * 2100;
        this.speed = 0.15 + Math.random() * 0.25;
    }

    /** Starts the chicken movement, animation, and sound intervals. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 150);
        setInterval(() => this.playDeadSound(), 150);
    }

    /** Moves the chicken according to its direction. */
    updateMovement() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead() && this.otherDirection == false) this.moveLeft();
        else if (!this.isDead() && this.otherDirection == true) this.moveRight();
    }

    /** Updates the chicken's walking or death image. */
    updateAnimation() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        else this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /** Shows the death image as soon as the chicken is defeated. */
    hit(damage) {
        super.hit(damage);
        if (this.isDead()) this.img = this.imageCache[this.IMAGES_DEAD[0]];
    }

    /** Plays the chicken's death sound once. */
    playDeadSound() {
        if (this.world && this.world.gameOver) return;
        if (this.isDead() && !this.soundPlayed) {
            this.deadSound.play();
            this.soundPlayed = true;
        }
    }
}
