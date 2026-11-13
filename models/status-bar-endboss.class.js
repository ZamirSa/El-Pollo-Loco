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

    /** Initializes the end boss status bar and its position update. */
    constructor() {
        super(); 
        this.loadImages(this.IMAGES);
        this.x = 800;
        this.y = 8;
        this.width = 220;
        this.height = 60;
        this.setPercentage(100);
        this.startPositionInterval();
    }

    /** Starts tracking the end boss status bar position. */
    startPositionInterval() {
        setInterval(() => {
            if (this.world && this.world.gameOver) return;
            if (this.alert == true) {
                this.x = 440;
            } else {
                this.x;
            }
        }, 1000 / 60);
    }

    // setPercentage(50);
    /**
     * Updates the displayed end boss health percentage.
     * @param {number} percentage The current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 ... 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /** Resolves the image index for the current end boss health. */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}