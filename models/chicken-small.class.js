class ChickenSmall extends MovableObject {
    y = 380;
    height = 45;
    width = 45;
    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };
    IMAGES_WALKING = [
        '../img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        '../img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        '../img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]

    AUDIO_DEAD = [
        '../audio/chicken-small-dead.wav'
    ]

    /** Creates a small chicken and starts its animation loops. */
    constructor() {
        super().loadImage('../img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.deadSound = new Audio(this.AUDIO_DEAD);
        this.deadSound.volume = 0.5;

        this.x = 300 + Math.random() * 2100; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /** Starts the small chicken movement, animation, and sound intervals. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 150);
        setInterval(() => this.playDeadSound(), 150);
    }

    /** Moves the small chicken according to its direction. */
    updateMovement() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead() && this.otherDirection == false) this.moveLeft();
        else if (!this.isDead() && this.otherDirection == true) this.moveRight();
    }

    /** Updates the small chicken's walking or death image. */
    updateAnimation() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        else this.loadImage('../img/3_enemies_chicken/chicken_small/2_dead/dead.png');
    }

    /** Plays the small chicken's death sound once. */
    playDeadSound() {
        if (this.world && this.world.gameOver) return;
        if (this.isDead() && !this.soundPlayed) {
            this.deadSound.play();
            this.soundPlayed = true;
        }
    }
}