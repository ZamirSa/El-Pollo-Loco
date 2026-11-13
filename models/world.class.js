class World {
    character = new Character();
    level;
    canvas
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    statusBarCoin = new StatusBarCoin();
    statusBarBottle = new StatusBarBottle();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = [];
    cooldown = 0;
    bottleIndex = -1;
    gameOver = false;

    /**
     * Initializes the world, level, game objects, and update loops.
     * @param {HTMLCanvasElement} canvas The game canvas.
     * @param {Keyboard} keyboard The keyboard state.
     * @param {boolean} restartRound Whether to randomize enemies for a restart.
     */
    constructor(canvas, keyboard, restartRound = false) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = createLevel1();
        if (restartRound) this.randomizeEnemies();
        this.statusBarEndboss.world = this;
        this.draw();
        this.setWorld();
        this.run();
        document.getElementById('game-over').hidden = true;
        document.getElementById('game-won').hidden = true;
    }

    /** Randomizes the horizontal positions of regular enemies. */
    randomizeEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                enemy.x = 200 + Math.random() * 2100;
            }
        });
    }

    /** Assigns this world to the character and level objects. */
    setWorld() {
        this.character.world = this;
        [
            ...this.level.enemies,
            ...this.level.clouds,
            ...this.level.backgroundObjects,
            ...this.level.coins,
            ...this.level.bottles
        ].forEach((object) => {
            object.world = this;
        });
    }

    /** Starts the world collision and bottle-throw update intervals. */
    run() {
        setInterval(() => {
            if (this.gameOver) return;
            this.checkThrowObjects();
        }, 1000 / 30)
        setInterval(() => {
            if (this.gameOver) return;
            this.checkDamage();
            this.checkCollisions();
        }, 1000 / 60)
    }

    /** Throws a bottle when the input and cooldown permit it. */
    checkThrowObjects() {
        if (this.canThrowBottle(false)) this.throwBottle(false);
        else if (this.canThrowBottle(true)) this.throwBottle(true);
        this.cooldown += 0.0333333333333333;
    }

    /**
     * Checks whether a bottle can be thrown in the given direction.
     * @param {boolean} direction Whether the character faces left.
     * @returns {boolean} Whether a bottle can be thrown.
     */
    canThrowBottle(direction) {
        return this.character.otherDirection == direction && this.keyboard.D
            && this.character.bottles > 0 && this.cooldown > 2 && !this.character.isHurt();
    }

    /**
     * Creates and launches a bottle in the given direction.
     * @param {boolean} direction Whether the character faces left.
     */
    throwBottle(direction) {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, direction);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.character.bottles -= 10;
        this.statusBarBottle.setPercentage(this.character.bottles);
        this.cooldown = 0;
        this.bottleIndex++;
    }

    /** Checks all projectile, enemy, end boss, and collectible collisions. */
    checkCollisions() {
        this.checkBottleEnemyCollisions();
        this.checkBottleGroundCollisions();
        this.checkEnemyStomps();
        this.updateEndboss();
        this.collectCoins();
        this.collectBottles();
    }

    /** Checks bottle collisions against each enemy. */
    checkBottleEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.throwableObjects.forEach((bottle) => this.checkBottleCollision(enemy, bottle));
        });
    }

    /**
     * Applies damage and splash state when a bottle hits an enemy.
     * @param {MovableObject} enemy The enemy to check.
     * @param {ThrowableObject} bottle The bottle to check.
     */
    checkBottleCollision(enemy, bottle) {
        if (!bottle.isColliding(enemy) || !(enemy.energy > 0) || !(bottle.energy > 0)) return;
        enemy.hit(100);
        bottle.enemyHit = true;
        bottle.energy = 0;
        this.scheduleBottleRemoval();
    }

    /** Checks whether thrown bottles have hit the ground. */
    checkBottleGroundCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.y > 370 && bottle.energy > 0) this.breakBottle(bottle);
        });
    }

    /**
     * Marks a bottle as broken and schedules its removal.
     * @param {ThrowableObject} bottle The bottle that hit the ground.
     */
    breakBottle(bottle) {
        bottle.enemyHit = true;
        bottle.energy = 0;
        this.scheduleBottleRemoval();
    }

    /** Schedules removal of the latest throwable bottle. */
    scheduleBottleRemoval() {
        setTimeout(() => {
            this.throwableObjects.splice(this.bottleIndex, 1);
            this.bottleIndex--;
        }, 300);
    }

    /** Applies damage to enemies that the character stomps. */
    checkEnemyStomps() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && enemy.energy > 0
                && this.character.speedY < 0 && this.character.y + this.character.offset.top < enemy.y) enemy.hit(100);
        });
    }

    /** Updates the end boss alert, attack, direction, and health bar. */
    updateEndboss() {
        let endboss = this.level.enemies.at(-1);
        this.alertEndboss(endboss);
        this.updateEndbossAttack(endboss);
        this.updateEndbossDirection(endboss);
        if (endboss.isHurt()) this.statusBarEndboss.setPercentage(endboss.energy / 10);
    }

    /**
     * Alerts the end boss when the character approaches.
     * @param {Endboss} endboss The end boss to update.
     */
    alertEndboss(endboss) {
        if (this.character.x >= endboss.x - 600) endboss.alerted = true;
        if (endboss.alerted == true) this.statusBarEndboss.alert = true;
    }

    /**
     * Updates the end boss attack state from its distance to the character.
     * @param {Endboss} endboss The end boss to update.
     */
    updateEndbossAttack(endboss) {
        if (endboss.otherDirection == false && endboss.x - this.character.x < 60
            || endboss.otherDirection == true && this.character.x - endboss.x < 60) endboss.attack = true;
        else if (endboss.otherDirection == false && endboss.x - this.character.x > 60
            || endboss.otherDirection == true && this.character.x - endboss.x > 60) endboss.attack = false;
    }

    /**
     * Points the end boss toward the character.
     * @param {Endboss} endboss The end boss to update.
     */
    updateEndbossDirection(endboss) {
        if (this.character.x > endboss.x) endboss.otherDirection = true;
        else endboss.otherDirection = false;
    }

    /** Checks and collects colliding coins. */
    collectCoins() {
        this.level.coins.forEach((coin, i) => this.collectCoin(coin, i));
    }

    /**
     * Collects a coin when the character has capacity.
     * @param {Coins} coin The coin to collect.
     * @param {number} i The coin's index in the level array.
     */
    collectCoin(coin, i) {
        if (!this.character.isColliding(coin) || this.character.coins >= 101) return;
        this.character.collectCoin();
        this.statusBarCoin.setPercentage(this.character.coins);
        coin.energy = 0;
        this.level.coins.splice(i, 1);
    }

    /** Checks and collects colliding bottles. */
    collectBottles() {
        this.level.bottles.forEach((bottle, i) => this.collectBottle(bottle, i));
    }

    /**
     * Collects a bottle when the character has capacity.
     * @param {Bottle} bottle The bottle to collect.
     * @param {number} i The bottle's index in the level array.
     */
    collectBottle(bottle, i) {
        if (!this.character.isColliding(bottle) || this.character.bottles >= 101) return;
        this.character.collectBottle();
        this.statusBarBottle.setPercentage(this.character.bottles);
        bottle.energy = 0;
        this.level.bottles.splice(i, 1);
    }

    /** Applies enemy collision damage and checks for game completion. */
    checkDamage() {
        if (this.gameOver) return;
        this.level.enemies.forEach((enemy) => this.damageCharacter(enemy));
        this.checkGameOver();
    }

    /**
     * Applies collision damage from an enemy to the character.
     * @param {MovableObject} enemy The enemy to check.
     */
    damageCharacter(enemy) {
        if (!this.character.isColliding(enemy) || !(enemy.energy > 0)
            || this.character.isAboveGround() || this.character.isHurt()) return;
        this.character.hit(5);
        this.statusBar.setPercentage(this.character.energy);
        this.applyEndbossCollisionDamage();
    }

    /** Applies extra damage when the character collides with the end boss. */
    applyEndbossCollisionDamage() {
        if (!this.character.isColliding(this.level.enemies.at(-1))) return;
        this.character.hit(15);
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Checks whether the character lost or defeated the end boss. */
    checkGameOver() {
        if (this.character.isDead()) this.showGameOver();
        else if (this.level.enemies.at(-1).isDead()) this.scheduleGameWon();
    }

    /** Marks the game as over and displays the loss screen. */
    showGameOver() {
        this.gameOver = true;
        document.getElementById('game-over').hidden = false;
    }

    /** Schedules the win screen after the end boss is defeated. */
    scheduleGameWon() {
        setTimeout(() => {
            this.gameOver = true;
            document.getElementById('game-won').hidden = false;
        }, 300);
    }

    /** Draws the current frame and schedules the next one. */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawActors();
        this.ctx.translate(-this.camera_x, 0);
        if (!this.gameOver) requestAnimationFrame(() => this.draw());
    }

    /** Draws the background layers relative to the camera. */
    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Draws all fixed-position status bars. */
    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
    }

    /** Draws enemies, the character, collectibles, and thrown bottles. */
    drawActors() {
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Draws each object in an object collection.
     * @param {DrawableObject[]} objects The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws an object, flipping it when it faces the opposite direction.
     * @param {DrawableObject} mo The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Saves the canvas state and flips an object horizontally.
     * @param {DrawableObject} mo The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the object's horizontal position and canvas state.
     * @param {DrawableObject} mo The object to restore.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
