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

    randomizeEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
                enemy.x = 200 + Math.random() * 2100;
            }
        });
    }

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

    checkThrowObjects() {
        if (this.canThrowBottle(false)) this.throwBottle(false);
        else if (this.canThrowBottle(true)) this.throwBottle(true);
        this.cooldown += 0.0333333333333333;
    }

    canThrowBottle(direction) {
        return this.character.otherDirection == direction && this.keyboard.D
            && this.character.bottles > 0 && this.cooldown > 2 && !this.character.isHurt();
    }

    throwBottle(direction) {
        let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, direction);
        bottle.world = this;
        this.throwableObjects.push(bottle);
        this.character.bottles -= 10;
        this.statusBarBottle.setPercentage(this.character.bottles);
        this.cooldown = 0;
        this.bottleIndex++;
    }

    checkCollisions() {
        this.checkBottleEnemyCollisions();
        this.checkBottleGroundCollisions();
        this.checkEnemyStomps();
        this.updateEndboss();
        this.collectCoins();
        this.collectBottles();
    }

    checkBottleEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.throwableObjects.forEach((bottle) => this.checkBottleCollision(enemy, bottle));
        });
    }

    checkBottleCollision(enemy, bottle) {
        if (!bottle.isColliding(enemy) || !(enemy.energy > 0) || !(bottle.energy > 0)) return;
        enemy.hit(100);
        bottle.enemyHit = true;
        bottle.energy = 0;
        this.scheduleBottleRemoval();
    }

    checkBottleGroundCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.y > 370 && bottle.energy > 0) this.breakBottle(bottle);
        });
    }

    breakBottle(bottle) {
        bottle.enemyHit = true;
        bottle.energy = 0;
        this.scheduleBottleRemoval();
    }

    scheduleBottleRemoval() {
        setTimeout(() => {
            this.throwableObjects.splice(this.bottleIndex, 1);
            this.bottleIndex--;
        }, 300);
    }

    checkEnemyStomps() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && enemy.energy > 0
                && this.character.speedY < 0 && this.character.y + this.character.offset.top < enemy.y) enemy.hit(100);
        });
    }

    updateEndboss() {
        let endboss = this.level.enemies.at(-1);
        this.alertEndboss(endboss);
        this.updateEndbossAttack(endboss);
        this.updateEndbossDirection(endboss);
        if (endboss.isHurt()) this.statusBarEndboss.setPercentage(endboss.energy / 10);
    }

    alertEndboss(endboss) {
        if (this.character.x >= endboss.x - 600) endboss.alerted = true;
        if (endboss.alerted == true) this.statusBarEndboss.alert = true;
    }

    updateEndbossAttack(endboss) {
        if (endboss.otherDirection == false && endboss.x - this.character.x < 60
            || endboss.otherDirection == true && this.character.x - endboss.x < 60) endboss.attack = true;
        else if (endboss.otherDirection == false && endboss.x - this.character.x > 60
            || endboss.otherDirection == true && this.character.x - endboss.x > 60) endboss.attack = false;
    }

    updateEndbossDirection(endboss) {
        if (this.character.x > endboss.x) endboss.otherDirection = true;
        else endboss.otherDirection = false;
    }

    collectCoins() {
        this.level.coins.forEach((coin, i) => this.collectCoin(coin, i));
    }

    collectCoin(coin, i) {
        if (!this.character.isColliding(coin) || this.character.coins >= 101) return;
        this.character.collectCoin();
        this.statusBarCoin.setPercentage(this.character.coins);
        coin.energy = 0;
        this.level.coins.splice(i, 1);
    }

    collectBottles() {
        this.level.bottles.forEach((bottle, i) => this.collectBottle(bottle, i));
    }

    collectBottle(bottle, i) {
        if (!this.character.isColliding(bottle) || this.character.bottles >= 101) return;
        this.character.collectBottle();
        this.statusBarBottle.setPercentage(this.character.bottles);
        bottle.energy = 0;
        this.level.bottles.splice(i, 1);
    }

    checkDamage() {
        if (this.gameOver) return;
        this.level.enemies.forEach((enemy) => this.damageCharacter(enemy));
        this.checkGameOver();
    }

    damageCharacter(enemy) {
        if (!this.character.isColliding(enemy) || !(enemy.energy > 0)
            || this.character.isAboveGround() || this.character.isHurt()) return;
        this.character.hit(5);
        this.statusBar.setPercentage(this.character.energy);
        this.applyEndbossCollisionDamage();
    }

    applyEndbossCollisionDamage() {
        if (!this.character.isColliding(this.level.enemies.at(-1))) return;
        this.character.hit(15);
        this.statusBar.setPercentage(this.character.energy);
    }

    checkGameOver() {
        if (this.character.isDead()) this.showGameOver();
        else if (this.level.enemies.at(-1).isDead()) this.scheduleGameWon();
    }

    showGameOver() {
        this.gameOver = true;
        document.getElementById('game-over').hidden = false;
    }

    scheduleGameWon() {
        setTimeout(() => {
            this.gameOver = true;
            document.getElementById('game-won').hidden = false;
        }, 300);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawActors();
        this.ctx.translate(-this.camera_x, 0);
        if (!this.gameOver) requestAnimationFrame(() => this.draw());
    }

    drawBackground() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawStatusBars() {
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
    }

    drawActors() {
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

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

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
