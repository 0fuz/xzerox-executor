"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const chai = require("chai");
require("mocha");
const Metric_1 = require("./Metric");
const Helper_1 = require("./Helper");
const expect = chai.expect;
describe('Metric', () => {
    describe('has', function () {
        it('should has', function () {
            const inp = ['aa'];
            const expecting = true;
            let metric = new Metric_1.Metric(inp);
            let result = metric.has(inp[0]);
            expect(result).deep.eq(expecting);
        });
        it('should havent', function () {
            const inp = ['aa'];
            const h = 'bb';
            const expecting = false;
            let metric = new Metric_1.Metric(inp);
            let result = metric.has(h);
            expect(result).deep.eq(expecting);
        });
    });
    describe('set', function () {
        it('should work', function () {
            const set = 123;
            const expecting = 123;
            let metric = new Metric_1.Metric([]);
            metric.set('asd', set);
            // @ts-ignore
            expect(metric.metric.asd).eq(expecting);
        });
        it('should work 2', function () {
            const set = 123;
            const expecting = 123;
            let metric = new Metric_1.Metric(['bda']);
            metric.set('bda', set);
            // @ts-ignore
            expect(metric.metric.bda).eq(expecting);
        });
    });
    describe('startInterval', function () {
        it('should work', async function () {
            let metric = new Metric_1.Metric(['bda']);
            metric.startInterval(() => {
                return 123;
            }, 100);
            await Helper_1.timeout(200);
            metric.stopInterval();
        });
    });
});
//# sourceMappingURL=Metric.test.js.map