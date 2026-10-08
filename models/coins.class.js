class Coins extends MovableObject {
    height = 120;
    width = 120;
    IMAGES_COINS = [
        '../img/8_coin/coin_1.png',
        '../img/8_coin/coin_2.png'
    ]

    constructor() {
        super().loadImage('../img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COINS);

        this.x = 200 + Math.random() * 2100; 
        this.y = 55 + Math.random() * 300;

        this.animate();
    }


        animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 250);
    }
}