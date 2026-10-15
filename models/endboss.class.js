class Endboss extends MovableObject {
    energy = 1000;
    height = 400;
    width = 250;
    y = 55;
    alerted = false;
    attack = false;
    offset = {
        top: 62,
        bottom: 10,
        left: 15,
        right: 8
    };

    IMAGES_ALERT = [
        '../img/4_enemie_boss_chicken/2_alert/G5.png',
        '../img/4_enemie_boss_chicken/2_alert/G6.png',
        '../img/4_enemie_boss_chicken/2_alert/G7.png',
        '../img/4_enemie_boss_chicken/2_alert/G8.png',
        '../img/4_enemie_boss_chicken/2_alert/G9.png',
        '../img/4_enemie_boss_chicken/2_alert/G10.png',
        '../img/4_enemie_boss_chicken/2_alert/G11.png',
        '../img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        '../img/4_enemie_boss_chicken/1_walk/G1.png',
        '../img/4_enemie_boss_chicken/1_walk/G2.png',
        '../img/4_enemie_boss_chicken/1_walk/G3.png',
        '../img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        '../img/4_enemie_boss_chicken/3_attack/G13.png',
        '../img/4_enemie_boss_chicken/3_attack/G14.png',
        '../img/4_enemie_boss_chicken/3_attack/G15.png',
        '../img/4_enemie_boss_chicken/3_attack/G16.png',
        '../img/4_enemie_boss_chicken/3_attack/G17.png',
        '../img/4_enemie_boss_chicken/3_attack/G18.png',
        '../img/4_enemie_boss_chicken/3_attack/G19.png',
        '../img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        '../img/4_enemie_boss_chicken/4_hurt/G21.png',
        '../img/4_enemie_boss_chicken/4_hurt/G22.png',
        '../img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        '../img/4_enemie_boss_chicken/5_dead/G24.png',
        '../img/4_enemie_boss_chicken/5_dead/G25.png',
        '../img/4_enemie_boss_chicken/5_dead/G26.png'
    ]

    AUDIO_HURT = [
        'audio/endboss-hurt.mp3'
    ];

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.hurtSound = new Audio(this.AUDIO_HURT);
        this.hurtSound.volume = 0.5;
        this.x = 2500;
        this.speed = 2;
        this.animate();

    }

    animate() {
        setInterval(() => {
            if (this.isHurt() && !this.isDead()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (!this.isDead() && this.alerted == true && this.attack == false) {
                this.playAnimation(this.IMAGES_WALKING);
            } else if (!this.isDead() && this.attack == true) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            }
            else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 150);

        setInterval(() => {
            if (!this.isDead() && this.alerted == true && this.attack == false && this.otherDirection == false) {
                this.moveLeft();
            } else if (!this.isDead() && this.alerted == true && this.attack == false && this.otherDirection == true) {
                this.moveRight();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isHurt() && !this.soundPlayed) {
                this.hurtSound.play()
            }
        }, 150);
    }
}