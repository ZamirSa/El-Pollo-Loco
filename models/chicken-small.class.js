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

    constructor() {
        super().loadImage('../img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.deadSound = new Audio(this.AUDIO_DEAD);
        this.deadSound.volume = 0.5;

        this.x = 300 + Math.random() * 2100; // Zahl zwischen 200 und 700
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead() && this.otherDirection == false) {
                this.moveLeft();
            } else if (!this.isDead() && this.otherDirection == true) {
                this.moveRight();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead()) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.loadImage('../img/3_enemies_chicken/chicken_small/2_dead/dead.png');
            }
        }, 150);


        setInterval(() => {
            if (this.isDead() && !this.soundPlayed) {
                this.deadSound.play()
                this.soundPlayed = true;
            }
        }, 150);
    }



}