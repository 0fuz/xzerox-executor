import got from "got";

export class Metric {
    private metric: { [name: string]: number } = {}
    private interval: any | NodeJS.Timeout

    constructor(defaultKeys: string[] = []) {

        for (let i = 0; i < defaultKeys.length; i++) {
            const key = defaultKeys[i];
            if (this.metric[key] === undefined) {
                this.metric[key] = 0
            }
        }

        this.interval = null

    }

    has(key: string): boolean {
        return this.metric[key] !== undefined
    }

    inc(key: string, value = 1) {
        if (this.metric[key] === undefined) {
            this.metric[key] = 0
        }

        this.metric[key] += value;
    }

    set(key: string, value = 1) {
        if (this.metric[key] === undefined) {
            this.metric[key] = 0
        }

        this.metric[key] = value;
    }

    _interval(left: number, callbackUrl: string = '') {
        let metric = Object.assign({left: left}, this.metric)

        console.log(JSON.stringify(metric))

        if (callbackUrl !== '' && callbackUrl) {
            got.post(callbackUrl, {
                json: metric,
                responseType: 'json'
            });
        }
    }

    startInterval(calculateLeftCb: () => number, interval = 5000, callbackUrl = '') {
        this._interval(calculateLeftCb(), callbackUrl)
        this.interval = setInterval(() => {
            this._interval(calculateLeftCb(), callbackUrl)
        }, interval)
    }

    stopInterval() {
        clearInterval(this.interval)
    }

}