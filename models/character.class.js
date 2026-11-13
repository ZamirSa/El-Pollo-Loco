class Character extends MovableObject {
    height = 280;
    width = 140;
    y = 80;
    speed = 10;

    offset = {
        top: 120,
        bottom: 30,
        left: 40,
        right: 30
    };
    IMAGES_WALKING = [
        '../img/2_character_pepe/2_walk/W-21.png',
        '../img/2_character_pepe/2_walk/W-22.png',
        '../img/2_character_pepe/2_walk/W-23.png',
        '../img/2_character_pepe/2_walk/W-24.png',
        '../img/2_character_pepe/2_walk/W-25.png',
        '../img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        '../img/2_character_pepe/3_jump/J-31.png',
        '../img/2_character_pepe/3_jump/J-32.png',
        '../img/2_character_pepe/3_jump/J-33.png',
        '../img/2_character_pepe/3_jump/J-34.png'
    ];

    IMAGES_FALLING = [
        '../img/2_character_pepe/3_jump/J-35.png',
        '../img/2_character_pepe/3_jump/J-36.png',
        '../img/2_character_pepe/3_jump/J-37.png',
        '../img/2_character_pepe/3_jump/J-38.png',
        '../img/2_character_pepe/3_jump/J-39.png'
    ]

    IMAGES_DEAD = [
        '../img/2_character_pepe/5_dead/D-51.png',
        '../img/2_character_pepe/5_dead/D-52.png',
        '../img/2_character_pepe/5_dead/D-53.png',
        '../img/2_character_pepe/5_dead/D-54.png',
        '../img/2_character_pepe/5_dead/D-55.png',
        '../img/2_character_pepe/5_dead/D-56.png',
        '../img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        '../img/2_character_pepe/4_hurt/H-41.png',
        '../img/2_character_pepe/4_hurt/H-42.png',
        '../img/2_character_pepe/4_hurt/H-43.png',
    ];

    IMAGES_IDLE = [
        '../img/2_character_pepe/1_idle/idle/I-1.png',
        '../img/2_character_pepe/1_idle/idle/I-2.png',
        '../img/2_character_pepe/1_idle/idle/I-3.png',
        '../img/2_character_pepe/1_idle/idle/I-4.png',
        '../img/2_character_pepe/1_idle/idle/I-5.png',
        '../img/2_character_pepe/1_idle/idle/I-6.png',
        '../img/2_character_pepe/1_idle/idle/I-7.png',
        '../img/2_character_pepe/1_idle/idle/I-8.png',
        '../img/2_character_pepe/1_idle/idle/I-9.png',
        '../img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        '../img/2_character_pepe/1_idle/long_idle/I-11.png',
        '../img/2_character_pepe/1_idle/long_idle/I-12.png',
        '../img/2_character_pepe/1_idle/long_idle/I-13.png',
        '../img/2_character_pepe/1_idle/long_idle/I-14.png',
        '../img/2_character_pepe/1_idle/long_idle/I-15.png',
        '../img/2_character_pepe/1_idle/long_idle/I-16.png',
        '../img/2_character_pepe/1_idle/long_idle/I-17.png',
        '../img/2_character_pepe/1_idle/long_idle/I-18.png',
        '../img/2_character_pepe/1_idle/long_idle/I-19.png',
        '../img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    AUDIO_HURT = [
        '../audio/character-hurt.wav'
    ]

    AUDIO_JUMP = [
        '../audio/character-jump.mp3'
    ]

    world;
    idleTime = 0;

    /** Initializes the character's assets, sounds, gravity, and animation loops. */
    constructor() {
        super().loadImage('../img/2_character_pepe/2_walk/W-21.png');
        this.loadCharacterImages();
        this.initializeSounds();
        this.applyGravity();
        this.animate();
    }

    /** Loads all character animation frames into the image cache. */
    loadCharacterImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }

    /** Creates and configures the character's sound effects. */
    initializeSounds() {
        this.hurtSound = new Audio(this.AUDIO_HURT);
        this.hurtSound.volume = 0.5;
        this.jumpSound = new Audio(this.AUDIO_JUMP);
        this.jumpSound.volume = 0.5;
    }

    /** Starts the character movement and animation intervals. */
    animate() {
        this.startMovementInterval();
        this.startIdleInterval();
        this.startJumpAnimationInterval();
        this.startStateAnimationInterval();
        this.startHurtSoundInterval();
    }

    /** Starts the character movement update interval. */
    startMovementInterval() { setInterval(() => this.updateMovement(), 1000 / 60); }
    /** Starts the idle animation update interval. */
    startIdleInterval() { setInterval(() => this.updateIdleAnimation(), 1000 / 5); }
    /** Starts the jump animation update interval. */
    startJumpAnimationInterval() { setInterval(() => this.updateJumpAnimation(), 1000 / 10); }
    /** Starts the character state animation update interval. */
    startStateAnimationInterval() { setInterval(() => this.updateStateAnimation(), 50); }
    /** Starts the hurt sound update interval. */
    startHurtSoundInterval() { setInterval(() => this.playHurtSound(), 150); }

    /** Applies movement, jumping, and camera updates from keyboard input. */
    updateMovement() {
        if (this.world && this.world.gameOver) return;
        this.moveRightIfRequested();
        this.moveLeftIfRequested();
        this.jumpIfRequested();
        this.world.camera_x = -this.x + 100;
    }

    /** Moves the character right when movement is allowed. */
    moveRightIfRequested() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.isDead()) {
            this.moveRight();
            this.otherDirection = false;
            this.idleTime = 0;
        }
    }

    /** Moves the character left when movement is allowed. */
    moveLeftIfRequested() {
        if (this.world.keyboard.LEFT && this.x > 0 && !this.isDead()) {
            this.moveLeft();
            this.otherDirection = true;
            this.idleTime = 0;
        }
    }

    /** Jumps when the jump key is pressed and jumping is allowed. */
    jumpIfRequested() {
        if (!this.world.keyboard.SPACE || this.isAboveGround() || this.isHurt() || this.isDead()) return;
        this.jump();
        this.idleTime = 0;
    }

    /** Selects the idle animation based on the character's idle duration. */
    updateIdleAnimation() {
        if (this.world && this.world.gameOver) return;
        if (!this.world.keyboard.RIGHT && this.idleTime < 14 || !this.world.keyboard.LEFT && this.idleTime < 14) {
            this.playAnimation(this.IMAGES_IDLE);
            this.idleTime += 0.2;
        } else this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    /** Selects the rising or falling animation while airborne. */
    updateJumpAnimation() {
        if (this.world && this.world.gameOver) return;
        if (this.isAboveGround() && this.speedY > 0) this.playAnimation(this.IMAGES_JUMPING);
        else if (this.isAboveGround() && this.speedY < 0) this.playAnimation(this.IMAGES_FALLING);
    }

    /** Updates the character animation for its current state. */
    updateStateAnimation() {
        if (this.world && this.world.gameOver) return;
        if (this.isDead()) this.playDeadAnimation();
        else if (this.isHurt()) this.playHurtAnimation();
        else this.playWalkingAnimation();
    }

    /** Plays the death animation and resets the idle timer. */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        this.idleTime = 0;
    }

    /** Plays the hurt animation and resets the idle timer. */
    playHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        this.idleTime = 0;
    }

    /** Plays the walking animation when movement keys are active on the ground. */
    playWalkingAnimation() {
        if (this.world.keyboard.RIGHT && !this.isAboveGround() || this.world.keyboard.LEFT && !this.isAboveGround()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /** Plays the hurt sound while the character is hurt. */
    playHurtSound() {
        if (this.world && this.world.gameOver) return;
        if (this.isHurt() && !this.soundPlayed) this.hurtSound.play();
    }
}