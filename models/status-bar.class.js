let STATUS_BAR_CONFIGS = {
    health: {
        images: [
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ],
        x: 40,
        y: 40,
        percentage: 100,
        imageIndexThresholds: [
            { value: 100, index: 5, operator: 'equal' },
            { value: 80, index: 4, operator: 'above' },
            { value: 60, index: 3, operator: 'above' },
            { value: 40, index: 2, operator: 'above' },
            { value: 0, index: 1, operator: 'above' }
        ]
    },
    coin: {
        images: [
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
        ],
        x: 40,
        y: 80,
        percentage: 0,
        imageIndexThresholds: [
            { value: 100, index: 5, operator: 'atLeast' },
            { value: 80, index: 4, operator: 'atLeast' },
            { value: 60, index: 3, operator: 'atLeast' },
            { value: 40, index: 2, operator: 'atLeast' },
            { value: 20, index: 1, operator: 'atLeast' }
        ]
    },
    bottle: {
        images: [
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
        ],
        x: 40,
        y: 0,
        percentage: 0,
        imageIndexThresholds: [
            { value: 100, index: 5, operator: 'atLeast' },
            { value: 80, index: 4, operator: 'atLeast' },
            { value: 40, index: 3, operator: 'atLeast' },
            { value: 20, index: 2, operator: 'atLeast' },
            { value: 0, index: 1, operator: 'above' }
        ]
    },
    endboss: {
        images: [
            './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
        ],
        x: 800,
        y: 8,
        percentage: 100,
        imageIndexThresholds: [
            { value: 100, index: 5, operator: 'equal' },
            { value: 80, index: 4, operator: 'above' },
            { value: 60, index: 3, operator: 'above' },
            { value: 40, index: 2, operator: 'above' },
            { value: 0, index: 1, operator: 'above' }
        ]
    }
};

class StatusBar extends DrawableObject {
    /** Initializes a status bar from its image, position, and percentage configuration. */
    constructor(config) {
        super();
        this.IMAGES = config.images;
        this.imageIndexThresholds = config.imageIndexThresholds;
        this.x = config.x;
        this.y = config.y;
        this.width = 220;
        this.height = 60;
        this.loadImages(this.IMAGES);
        this.setPercentage(config.percentage);
    }

    /**
     * Updates the displayed percentage.
     * @param {number} percentage The current percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /** Resolves the image index using this bar's configured thresholds. */
    resolveImageIndex() {
        for (let threshold of this.imageIndexThresholds) {
            let matches = threshold.operator === 'equal'
                ? this.percentage === threshold.value
                : threshold.operator === 'above'
                    ? this.percentage > threshold.value
                    : this.percentage >= threshold.value;
            if (matches) return threshold.index;
        }
        return 0;
    }
}
