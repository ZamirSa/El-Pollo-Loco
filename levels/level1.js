/** Creates and returns the first game level. */
function createLevel1() {
    return new Level(createEnemies(), [new Cloud()], createBackgroundObjects(), createCoins(), createBottles());
}

/** Creates the enemy collection for the first level. */
function createEnemies() {
    return [...Array.from({ length: 10 }, () => new Chicken()),
        ...Array.from({ length: 10 }, () => new ChickenSmall()), new Endboss()];
}

/** Creates the tiled background objects for the level. */
function createBackgroundObjects() {
    const objects = [];
    for (let tile = -1; tile < 4; tile++) addBackgroundTile(objects, tile);
    return objects;
}

/**
 * Adds one tile's layered background objects.
 * @param {BackgroundObject[]} objects The destination background array.
 * @param {number} tile The tile index.
 */
function addBackgroundTile(objects, tile) {
    const variant = tile % 2 === 0 ? 1 : 2;
    const x = tile * 720;
    objects.push(new BackgroundObject('../img/5_background/layers/air.png', x));
    objects.push(new BackgroundObject(`../img/5_background/layers/3_third_layer/${variant}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/2_second_layer/${variant}.png`, x));
    objects.push(new BackgroundObject(`../img/5_background/layers/1_first_layer/${variant}.png`, x));
}

/** Creates the collectible coins for the level. */
function createCoins() {
    return Array.from({ length: 5 }, () => new Coins());
}

/** Creates the collectible bottles for the level. */
function createBottles() {
    return Array.from({ length: 12 }, () => new Bottle());
}