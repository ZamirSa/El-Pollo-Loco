class StatusBarEndboss extends DrawableObject {
    IMAGES = [
        '../img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        '../img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        '../img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        '../img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        '../img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        '../img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];
    alert = false;

    percentage = 100;

    constructor() {
        super(); 
        this.loadImages(this.IMAGES);
        this.x = 800;
        this.y = 8;
        this.width = 220;
        this.height = 60;
        this.setPercentage(100);

        setInterval(() => {
             if (this.alert == true) {
                this.x = 440;
            } else {
                this.x;
            }
        }, 1000 / 60)
        
    }

    // setPercentage(50);
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}