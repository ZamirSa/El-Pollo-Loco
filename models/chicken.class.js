class Chicken extends MovableObject {
    y = 355;
    height = 70;
    width = 70;
    offset = {
        top: 4,
        bottom: 4,
        left: 2,
        right: 2
    };
    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEAD = ['./img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

    AUDIO_DEAD = [
        './audio/chicken-dead.mp3']

    /** Creates a chicken and starts its animation loops. */
    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages([...this.IMAGES_WALKING, ...this.IMAGES_DEAD]);
        this.deadSound = createGameAudio(this.AUDIO_DEAD);
        this.deadSound.volume = 0.5;
        this.x = 300 + Math.random() * 2100; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
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