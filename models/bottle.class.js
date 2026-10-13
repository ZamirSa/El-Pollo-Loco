class Bottle extends MovableObject {
    height = 60;
    width = 60;
    y = 370;
    offset = {
        top: 10,
        bottom: 5,
        left: 25,
        right: 11
    };

    constructor() {
        super().loadImage('../img/6_salsa_bottle/1_salsa_bottle_on_ground.png');

        this.x = 200 + Math.random() * 2100;

    }
}