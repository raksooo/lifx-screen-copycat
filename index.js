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
                console.log('light discovered')
                this.light = light;
                resolve();
            });
            this.lifx.init();

        });
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
            let rgb = colorThief.getColor(name);
            let col = color('rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
            resolve(col.hsl());
        });
    }

    colorBulb(color) {
    }


}

let copycat = new Copycat();
copycat.init()
    .then(copycat.takeScreenshot)
    .then(copycat.getColor)
    .then(console.log.bind(console));

