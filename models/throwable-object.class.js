class ThrowableObject extends MovableObject {
    IMAGES_BOTTLE = [
        '../img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        '../img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        '../img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        '../img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_BOTTLE_SPLASH = [
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        '../img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    enemyHit = false;


    constructor(x, y, otherDirection) {
        super().loadImage('../img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.height = 60;
        this.width = 60;
        this.throw();
        this.animate();
    }

    throw() {

        this.speedY = 30;
        this.applyGravity();

        setInterval(() => {
            if (this.otherDirection == false) {
                this.x += 10;
            } else {
                this.x -= 10;
            }
        }, 25);
    }

    animate() {
        setInterval(() => {
            if (this.enemyHit == true) {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_BOTTLE);
            }
        }, 50);
    }
}