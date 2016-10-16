const screenshot = require('node-screenshot');
const ColorThief = require('color-thief');
const color = require('onecolor');
const LifxClient = require('node-lifx').Client;

class Copycat {
    constructor() {
        this.colorThief = new ColorThief();
        this.lifx = new LifxClient();
    }

    init() {
        return new Promise((resolve, reject) => {
            this.lifx.on('light-new', light => {
                this.light = light;
                resolve();
            });
            this.lifx.init();

        });
    }

    run_once() {
        return new Promise((resolve, reject) => {
            if (!this.light) {
                reject();
            } else {
                this.takeScreenshot()
                    .then(this.getColor.bind(this))
                    .then(this.colorBulb.bind(this))
                    .then(resolve);
            }
        });
    }

    loop(delay) {
        setTimeout(() => {
            this.run_once()
                .then(this.loop.bind(this, delay))
                .catch(() => {
                    console.log('Have you called init?');
                });
        }, delay);
    }

    takeScreenshot() {
        return new Promise((resolve, reject) => {
            let name = 'screenshot.png';
            screenshot(name).desktop(() => {
                resolve(name);
            });
        });
    }

    getColor(name) {
        return new Promise((resolve, reject) => {
            let rgb = this.colorThief.getColor(name);
            let col = color('rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
            resolve(col.hsl());
        });
    }

    colorBulb(color) {
        this.light.color(color.hue() * 360, color.saturation() * 100, color.lightness() * 100);
    }
}

let copycat = new Copycat();
copycat.init()
    .then(copycat.loop.bind(copycat));

