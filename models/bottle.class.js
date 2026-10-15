class Bottle extends MovableObject {
    height = 60;
    width = 60;
    y = 370;
    offset = {
        top: 10,
        bottom: 5,
        left: 25,
        right: 11
    };

    AUDIO_COLLECT = [
        '../audio/bottle.mp3'
    ];

    constructor() {
        super().loadImage('../img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.collectSound = new Audio(this.AUDIO_COLLECT);
        this.collectSound.volume = 0.5;

        this.x = 200 + Math.random() * 2100;

        this.animate();

    }

    animate() {
        setInterval(() => {
            if (this.isDead() && !this.soundPlayed) {
                this.collectSound.play()
                this.soundPlayed = true;
            }
        }, 10);
    }

}