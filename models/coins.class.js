class Coins extends MovableObject {
    height = 120;
    width = 120;
    offset = {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
    };
    IMAGES_COINS = [
        '../img/8_coin/coin_1.png',
        '../img/8_coin/coin_2.png'
    ]
    AUDIO_COLLECT = [
        '../audio/coin.mp3'
    ]

    /** Creates a collectible coin and starts its animation loops. */
    constructor() {
        super().loadImage('../img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COINS);
        this.collectSound = new Audio(this.AUDIO_COLLECT);
        this.collectSound.volume = 0.5;

        this.x = 200 + Math.random() * 2000;
        this.y = 55 + Math.random() * 300;

        this.animate();
    }


    /** Starts the coin animation and collection sound intervals. */
    animate() {
        setInterval(() => {
            if (this.world && this.world.gameOver) return;
            this.playAnimation(this.IMAGES_COINS);
        }, 250);

        setInterval(() => {
            if (this.world && this.world.gameOver) return;
            if (this.isDead() && !this.soundPlayed) {
                this.collectSound.play()
                this.soundPlayed = true;
            }
        }, 10);
    }
}