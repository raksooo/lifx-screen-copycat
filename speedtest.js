const async = require('async');
const screenshot1 = require('node-screenshot');
const screenshot2 = require('desktop-screenshot');

function s1(callback) {
    screenshot1('screenshot1.png').desktop(() => {
        callback && callback();
    });
}

function s2(callback) {
    screenshot2("screenshot2.png", () => {
        callback && callback();
    });
}

let start, stop;
let q = async.queue((task, callback) => { task(callback) }, 1);
q.drain = () => {
    stop = new Date().getTime();
    console.log(stop-start);
};

start = new Date().getTime();
for(let i=0; i<1; i++) {
    q.push(s2);
}

