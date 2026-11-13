function createLevel1() {
    return new Level(createEnemies(), [new Cloud()], createBackgroundObjects(), createCoins(), createBottles());
}

function createEnemies() {
    return [...Array.from({ length: 10 }, () => new Chicken()),
        ...Array.from({ length: 10 }, () => new ChickenSmall()), new Endboss()];
}

function createBackgroundObjects() {
    const objects = [];
    for (let tile = -1; tile < 4; tile++) addBackgroundTile(objects, tile);
    return objects;
}

function addBackgroundTile(objects, tile) {
    const variant = tile % 2 === 0 ? 1 : 2;
    const x = tile * 720;
    objects.push(new BackgroundObject('../img/5_background/layers/air.png', x));
    objects.push(new BackgroundObject(`../img/5_background/layers/3_third_layer/${variant}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/2_second_layer/${variant}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/1_first_layer/${variant}.png`, x));
}

function createCoins() {
    return Array.from({ length: 5 }, () => new Coins());
}

function createBottles() {
    return Array.from({ length: 12 }, () => new Bottle());
}