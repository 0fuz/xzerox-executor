"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Metric = void 0;
const got_1 = require("got");

class Metric {
    constructor(defaultKeys = []) {
        this.metric = {};
        for (let i = 0; i < defaultKeys.length; i++) {
            const key = defaultKeys[i];
            if (this.metric[key] === undefined) {
                this.metric[key] = 0;
            }
        }
        this.interval = null;
    }

    has(key) {
        return this.metric[key] !== undefined;
    }

    inc(key, value = 1) {
        if (this.metric[key] === undefined) {
            this.metric[key] = 0;
        }
        this.metric[key] += value;
    }

    set(key, value = 1) {
        if (this.metric[key] === undefined) {
            this.metric[key] = 0;
        }
        this.metric[key] = value;
    }

    _interval(left, callbackUrl = '') {
        let metric = Object.assign({left: left}, this.metric);
        console.log(JSON.stringify(metric));
        if (callbackUrl !== '' && callbackUrl) {
            got_1.default.post(callbackUrl, {
                json: metric,
                responseType: 'json'
            });
        }
    }

    startInterval(calculateLeftCb, interval = 5000, callbackUrl = '') {
        this._interval(calculateLeftCb(), callbackUrl);
        this.interval = setInterval(() => {
            this._interval(calculateLeftCb(), callbackUrl);
        }, interval);
    }

    stopInterval() {
        clearInterval(this.interval);
    }
}

exports.Metric = Metric;
//# sourceMappingURL=Metric.js.map