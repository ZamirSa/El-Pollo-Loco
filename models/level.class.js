class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 2200;

    /**
     * Creates a level from its game object collections.
     * @param {MovableObject[]} enemies The level enemies.
     * @param {Cloud[]} clouds The level clouds.
     * @param {BackgroundObject[]} backgroundObjects The background layers.
     * @param {Coins[]} coins The collectible coins.
     * @param {Bottle[]} bottles The collectible bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}