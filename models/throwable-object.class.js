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

    AUDIO_THROW = [
        '../audio/throw-sound.mp3'
    ];

    AUDIO_SPLASH = [
        '../audio/bottle-splash.mp3'
    ]
    enemyHit = false;
    fall = true;
    splashSoundPlayed = false;


    constructor(x, y, otherDirection) {
        super().loadImage('../img/6_salsa_bottle/salsa_bottle.png');
        this.loadBottleImages();
        this.initializeSounds();
        this.initializePosition(x, y, otherDirection);
        this.throw();
        this.animate();
    }

    loadBottleImages() {
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    initializeSounds() {
        this.throwSound = new Audio(this.AUDIO_THROW);
        this.throwSound.volume = 0.2;
        this.splashSound = new Audio(this.AUDIO_SPLASH);
        this.splashSound.volume = 0.5;
    }

    initializePosition(x, y, otherDirection) {
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.height = 60;
        this.width = 60;
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => this.updateThrowPosition(), 25);
    }

    updateThrowPosition() {
        if (this.world && this.world.gameOver) return;
        if (this.otherDirection == false && this.fall == true) this.x += 10;
        else if (this.otherDirection == true && this.fall == true) this.x -= 10;
        else this.x;
    }

    animate() {
        setInterval(() => this.updateAnimation(), 50);
        setInterval(() => this.updateSounds(), 10);
    }

    updateAnimation() {
        if (this.world && this.world.gameOver) return;
        if (this.enemyHit == true) this.animateSplash();
        else this.playAnimation(this.IMAGES_BOTTLE);
    }

    animateSplash() {
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        this.speedY = 0;
        this.fall = false;
    }

    updateSounds() {
        if (this.world && this.world.gameOver) return;
        if (!this.soundPlayed && this.enemyHit == false) this.playThrowSound();
        if (!this.splashSoundPlayed && this.enemyHit == true) this.playSplashSound();
    }

    playThrowSound() {
        this.throwSound.play();
        this.soundPlayed = true;
    }

    playSplashSound() {
        this.splashSound.play();
        this.splashSoundPlayed = true;
    }
}