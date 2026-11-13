class Chicken extends MovableObject {
    y = 355;
    height = 70;
    width = 70;
    IMAGES_WALKING = [
        '../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        '../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        '../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    AUDIO_DEAD = [
        '../audio/chicken-dead.mp3']

    constructor() {
        super().loadImage('../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.deadSound = new Audio(this.AUDIO_DEAD);
        this.deadSound.volume = 0.5;
        this.x = 300 + Math.random() * 2100; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 150);
        setInterval(() => this.playDeadSound(), 150);
    }

    updateMovement() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead() && this.otherDirection == false) this.moveLeft();
        else if (!this.isDead() && this.otherDirection == true) this.moveRight();
    }

    updateAnimation() {
        if (this.world && this.world.gameOver) return;
        if (!this.isDead()) this.playAnimation(this.IMAGES_WALKING);
        else this.loadImage('../img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    }

    playDeadSound() {
        if (this.world && this.world.gameOver) return;
        if (this.isDead() && !this.soundPlayed) {
            this.deadSound.play();
            this.soundPlayed = true;
        }
    }
}