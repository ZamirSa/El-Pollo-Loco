class World {
    character = new Character();
    level = level1;
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkThrowObjects();
        }, 1000 / 30)
        setInterval(() => {
            this.checkDamage();
            this.checkCollisions();
        }, 1000 / 60)
    }

    checkThrowObjects() {
        if (this.character.otherDirection == false && this.keyboard.D && this.character.bottles > 0 && this.cooldown > 2 && !this.character.isHurt()) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, false);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.statusBarBottle.setPercentage(this.character.bottles);
            this.cooldown = 0;
            this.bottleIndex++
        } else if (this.character.otherDirection == true && this.keyboard.D && this.character.bottles > 0 && this.cooldown > 2 && !this.character.isHurt()) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, true);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.statusBarBottle.setPercentage(this.character.bottles);
            this.cooldown = 0;
            this.bottleIndex++
        }

        this.cooldown += 0.0333333333333333;
    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            this.throwableObjects.forEach((throwableObject) => {
                if (throwableObject.isColliding(enemy) && enemy.energy > 0 && throwableObject.energy > 0) {
                    enemy.hit(100);
                    throwableObject.enemyHit = true;
                    throwableObject.energy = 0;
                    setTimeout(() => {
                        this.throwableObjects.splice(this.bottleIndex, 1)
                        this.bottleIndex--;
                    }, 300);
                }
            });
        });


        this.throwableObjects.forEach((throwableObject) => {
            if (throwableObject.y > 370 && throwableObject.energy > 0) {
                throwableObject.enemyHit = true;
                throwableObject.energy = 0;
                setTimeout(() => {
                    this.throwableObjects.splice(this.bottleIndex, 1)
                    this.bottleIndex--;
                }, 300);
            }
        });


        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && enemy.energy > 0 && this.character.speedY < 0 && this.character.y + this.character.offset.top < enemy.y) {
                enemy.hit(100);
            }
        })

        if (this.character.x >= this.level.enemies.at(-1).x - 600) {
            let endboss = this.level.enemies.at(-1);
            endboss.alerted = true;
        }

        if (this.level.enemies.at(-1).alerted == true) {
            this.statusBarEndboss.alert = true;
        }

        if (this.level.enemies.at(-1).otherDirection == false && this.level.enemies.at(-1).x - this.character.x < 60 || this.level.enemies.at(-1).otherDirection == true && this.character.x - this.level.enemies.at(-1).x < 60) {
            let endboss = this.level.enemies.at(-1);
            endboss.attack = true;
        } else if (this.level.enemies.at(-1).otherDirection == false && this.level.enemies.at(-1).x - this.character.x > 60 || this.level.enemies.at(-1).otherDirection == true && this.character.x - this.level.enemies.at(-1).x > 60) {
            let endboss = this.level.enemies.at(-1);
            endboss.attack = false;
        }

        if (this.character.x > this.level.enemies.at(-1).x) {
            let endboss = this.level.enemies.at(-1);
            endboss.otherDirection = true;
        } else {
            let endboss = this.level.enemies.at(-1);
            endboss.otherDirection = false;
        }

        if (this.level.enemies.at(-1).isHurt()) {
            this.statusBarEndboss.setPercentage(this.level.enemies.at(-1).energy / 10);
        }




        this.level.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin) && this.character.coins < 101) {
                this.character.collectCoin();
                this.statusBarCoin.setPercentage(this.character.coins);
                coin.energy = 0;
                this.level.coins.splice(i, 1);
            }
        });

        this.level.bottles.forEach((bottle, i) => {
            if (this.character.isColliding(bottle) && this.character.bottles < 101) {
                this.character.collectBottle();
                this.statusBarBottle.setPercentage(this.character.bottles);
                bottle.energy = 0;
                this.level.bottles.splice(i, 1)
            }
        });
    }

    checkDamage() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.isAboveGround() && !this.character.isHurt()) {
                this.character.hit(5);
                this.statusBar.setPercentage(this.character.energy);

                if (this.character.isColliding(this.level.enemies.at(-1))) {
                    this.character.hit(15);
                    this.statusBar.setPercentage(this.character.energy);
                }
            }
        });

        if (this.character.isDead()) {

        }

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        // ---------Space for fixed objects --------
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.addToMap(this.statusBarEndboss);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);



        // Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
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

