"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
require("mocha");
const HttpHelper_1 = require("./HttpHelper");
const Metric_1 = require("./Metric");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
describe('HttpHelper', () => {
    describe('parse', function () {
        it('should parse', function () {
            const source = '111baz222';
            const left = '111';
            const right = '222';
            const expecting = 'baz';
            let result = HttpHelper_1.parse(source, left, right);
            expect(result).eq(expecting);
        });
        it('when left is wrong', function () {
            const source = '111baz222';
            const left = '333';
            const right = '222';
            const expecting = '';
            let result = HttpHelper_1.parse(source, left, right);
            expect(result).eq(expecting);
        });
        it('when right is wrong', function () {
            const source = '111baz222';
            const left = '111';
            const right = '444';
            const expecting = '';
            let result = HttpHelper_1.parse(source, left, right);
            expect(result).eq(expecting);
        });
        it('when right before left', function () {
            const source = '111baz222';
            const left = '222';
            const right = '111';
            const expecting = '';
            let result = HttpHelper_1.parse(source, left, right);
            expect(result).eq(expecting);
        });
        it('when left is part of right', function () {
            const source = '111baz222';
            const left = '111baz2';
            const right = '222';
            const expecting = '';
            let result = HttpHelper_1.parse(source, left, right);
            expect(result).eq(expecting);
        });
    });
    describe('hasKey', function () {
        it('should work', function () {
            const obj = {
                a: {
                    b: 123
                }
            };
            const key = 'a.b';
            const expecting = true;
            let result = HttpHelper_1.hasKey(obj, key);
            expect(result).eq(expecting);
        });
        it('when undefined', function () {
            const obj = {
                a: {
                    b: undefined
                }
            };
            const key = 'a.b';
            const expecting = false;
            let result = HttpHelper_1.hasKey(obj, key);
            expect(result).eq(expecting);
        });
        it('havent latest key', function () {
            const obj = {
                a: {
                    b: 'c'
                }
            };
            const key = 'a.b.c';
            const expecting = false;
            let result = HttpHelper_1.hasKey(obj, key);
            expect(result).eq(expecting);
        });
        it('havent first key', function () {
            const obj = {
                a: {
                    b: 'c'
                }
            };
            const key = 'c.a.b';
            const expecting = false;
            let result = HttpHelper_1.hasKey(obj, key);
            expect(result).eq(expecting);
        });
        it('havent object', function () {
            const obj = 'stonks';
            const key = 'c.a.b';
            const expecting = false;
            let result = HttpHelper_1.hasKey(obj, key);
            expect(result).eq(expecting);
        });
    });
    describe('isBadProxyError', function () {
        it('should detect', function () {
            const e = new Error('sock');
            const expecting = true;
            let result = HttpHelper_1.isBadProxyError(e);
            expect(result).eq(expecting);
        });
        it('should not detect', function () {
            const e = new Error('123');
            const expecting = false;
            let result = HttpHelper_1.isBadProxyError(e);
            expect(result).eq(expecting);
        });
        it('invalid error', function () {
            const e = null;
            const expecting = false;
            let result = HttpHelper_1.isBadProxyError(e);
            expect(result).eq(expecting);
        });
    });
    describe('isItUsualError', function () {
        it('should detect invalid error', function () {
            let metric = new Metric_1.Metric(['aa']);
            const e = null;
            const expecting = false;
            let result = HttpHelper_1.isItUsualError(e, metric);
            expect(result).eq(expecting);
        });
        it('should detect usual error', function () {
            let metric = new Metric_1.Metric(['aa']);
            const e = new Error('timeout');
            const expecting = true;
            let result = HttpHelper_1.isItUsualError(e, metric);
            expect(result).eq(expecting);
        });
        it('should detect unusual error', function () {
            let metric = new Metric_1.Metric(['aa']);
            const e = new Error('asdadda');
            const expecting = false;
            let result = HttpHelper_1.isItUsualError(e, metric);
            expect(result).eq(expecting);
        });
        it('should detect error as metric name', function () {
            let metric = new Metric_1.Metric(['aa']);
            const e = new Error('aa');
            const expecting = true;
            let result = HttpHelper_1.isItUsualError(e, metric);
            expect(result).eq(expecting);
        });
    });
});
//# sourceMappingURL=HttpHelper.test.js.map