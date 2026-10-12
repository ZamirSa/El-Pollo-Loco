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
    throwableObjects = [];

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
            this.checkCollisions();
            this.checkThrowObjects();
        }, 1000 / 10)
    }

    checkThrowObjects() {
        if (this.character.otherDirection == false && this.keyboard.D && this.character.bottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, false);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.statusBarBottle.setPercentage(this.character.bottles);
        } else if (this.character.otherDirection == true && this.keyboard.D && this.character.bottles > 0) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, true);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.statusBarBottle.setPercentage(this.character.bottles);
        }

    }


    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.isAboveGround()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });

        this.level.enemies.forEach((enemy) => {
            this.throwableObjects.forEach((throwableObject) => {
                if (throwableObject.isColliding(enemy) && enemy.energy > 0 && throwableObject.energy > 0) {
                    enemy.energy -= 100;
                    throwableObject.enemyHit = true;
                    throwableObject.energy = 0;
                    console.log(enemy.energy)
                }
            });
        });

        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.isAboveGround()) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });

        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.isAboveGround() && enemy.energy > 0) {
                enemy.energy -= 100;
                console.log(enemy.energy)
            }
        })


        this.level.coins.forEach((coin, i) => {
            if (this.character.isColliding(coin) && this.character.coins < 101) {
                this.character.collectCoin();
                this.statusBarCoin.setPercentage(this.character.coins);
                this.level.coins.splice(i, 1);
            }
        });

        this.level.bottles.forEach((bottle, i) => {
            if (this.character.isColliding(bottle) && this.character.bottles < 101) {
                this.character.collectBottle();
                this.statusBarBottle.setPercentage(this.character.bottles);
                this.level.bottles.splice(i, 1)
                console.log(this.character.bottles);
            }
        });
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

