class Bottle extends MovableObject {
    height = 60;
    width = 60;
    y = 370;

    constructor() {
        super().loadImage('../img/6_salsa_bottle/1_salsa_bottle_on_ground.png');

        this.x = 200 + Math.random() * 2100; 

    }
}