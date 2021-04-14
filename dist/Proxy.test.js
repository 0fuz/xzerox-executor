"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
require("mocha");
const Proxy_1 = require("./Proxy");
const hpagent_1 = require("hpagent");
const fs = require("fs");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
describe('Proxy', function () {
    describe('Compare methods of working with array', function () {
        const steps = 30000;
        it('usual usage. unshift/push:', function () {
            const v1 = '\tusual usage. unshift/push:';
            let array = [];
            for (let i = 0; i < steps; i++) {
                array.push(i + 'some long string here here here');
            }
            console.time(v1);
            for (let i = 0; i < array.length; i++) {
                const arrayElement = array.shift();
                setTimeout(() => {
                    array.push(arrayElement);
                    if (i === array.length - 1) {
                    }
                }, 0);
            }
            console.timeEnd(v1);
        });
        it('clever usage. mark as busy:', function () {
            const v2 = '\tclever usage. mark as busy:';
            let array = [];
            // as we saw, this method is faster a lot
            console.time(v2);
            for (let i = 0; i < steps; i++) {
                array.push({s: i + 'should return response on call', free: true});
            }
            for (let i = 0; i < array.length; i++) {
                array[i].free = false;
                let a = array[i].s;
                setTimeout(() => {
                    a = '';
                    // @ts-ignore
                    array[i].free = true;
                    if (i === array.length - 1) {
                    }
                }, 1);
            }
            console.timeEnd(v2);
        });
    });
    describe('constructor', function () {
        it('empty params', function () {
            let p = new Proxy_1.Proxy();
            expect(p.hpagent_config).not.null;
        });
        it('edited settings', function () {
            let settings = Proxy_1.DefaultProxyHPagentSettings;
            settings.keepAlive = false;
            let p = new Proxy_1.Proxy(settings);
            expect(p.hpagent_config).not.null;
            expect(p.hpagent_config.keepAlive).false;
        });
    });
    describe('makeAgents', function () {
        it('should create http', function () {
            const type = 'http';
            const proxies = [
                '1.2.3.4:1234',
                'http://1.2.3.4:1234',
                'user:password@domain.com:1234',
                'http://user:password@domain.com:1234',
                'http://user:password@1.2.3.4:1234',
            ];
            const expecting = 5;
            let p = new Proxy_1.Proxy();
            let agents = p.makeAgents(proxies, type);
            expect(agents.length).eq(expecting);
        });
        it('should create https', function () {
            const type = 'https';
            const proxies = [
                '1.2.3.4:1234',
                'http://1.2.3.4:1234',
                'user:password@domain.com:1234',
                'http://user:password@domain.com:1234',
                'http://user:password@1.2.3.4:1234',
            ];
            const expecting = 5;
            let p = new Proxy_1.Proxy();
            let agents = p.makeAgents(proxies, type);
            expect(agents.length).eq(expecting);
        });
        it('should create custom #1', function () {
            const type = 'smartproxy';
            const proxies = [
                '1.2.3.4:1234',
                'http://1.2.3.4:1234',
                'user:password@domain.com:1234',
                'http://user:password@domain.com:1234',
                'http://user:password@1.2.3.4:1234',
                'user-user1-session-111:password@1.2.3.4:1234',
            ];
            const expecting = 6;
            let p = new Proxy_1.Proxy();
            let agents = p.makeAgents(proxies, type);
            expect(agents.length).eq(expecting);
        });
        it('should create custom #2', function () {
            const type = 'oxylabs';
            const proxies = [
                '1.2.3.4:1234',
                'http://1.2.3.4:1234',
                'user:password@domain.com:1234',
                'http://user:password@domain.com:1234',
                'http://user:password@1.2.3.4:1234',
                'customer-user1-sessid-111:password@1.2.3.4:1234',
            ];
            const expecting = 6;
            let p = new Proxy_1.Proxy();
            let agents = p.makeAgents(proxies, type);
            expect(agents.length).eq(expecting);
        });
        it('should create custom #3', function () {
            const type = 'luminati';
            const proxies = [
                '1.2.3.4:1234',
                'http://1.2.3.4:1234',
                'user:password@domain.com:1234',
                'http://user:password@domain.com:1234',
                'http://user:password@1.2.3.4:1234',
                'user1-session-111:password@1.2.3.4:1234',
            ];
            const expecting = 6;
            let p = new Proxy_1.Proxy();
            let agents = p.makeAgents(proxies, type);
            expect(agents.length).eq(expecting);
        });
    });
    describe('makeAgentsObject', function () {
        it('should work', function () {
            const agents = [1, 2]; // its not original agent type
            const expecting = [
                {agent: 1, isBusy: false},
                {agent: 2, isBusy: false}
            ];
            let p = new Proxy_1.Proxy();
            let result = p.makeAgentsObject(agents);
            expect(result).deep.eq(expecting);
        });
    });
    describe('load', function () {
        // it('should load data from url', async function () {
        //     const url = 'http://localhost:1234'
        //     const path = '/'
        //     const data = '1.2.3.4:1234\naaaa:pppp@1.2.3.4:1234\n'
        //     const type= 'https'
        //
        //     const scope = nock(url)
        //         .get(path)
        //         .reply(200, data)
        //
        //     let p = new Proxy()
        //     let response = await p.load(url+path, type)
        //
        //     expect(response.length).eq(2)
        //     expect(response[0].agent instanceof HttpsProxyAgent).eq(true)
        //     expect(response[0].isBusy).eq(false)
        //     expect(response[1].agent instanceof HttpsProxyAgent).eq(true)
        //     expect(response[1].isBusy).eq(false)
        // });
        it('should load data from file', async function () {
            const path = 'temp.txt';
            const data = '1.2.3.4:1234\naaaa:pppp@1.2.3.4:1234\n';
            const type = 'https';
            fs.writeFileSync(path, data);
            let p = new Proxy_1.Proxy();
            let response = await p.load(path, type);
            fs.unlinkSync(path);
            expect(response[0].agent instanceof hpagent_1.HttpsProxyAgent).eq(true);
            expect(response[0].isBusy).eq(false);
            expect(response[1].agent instanceof hpagent_1.HttpsProxyAgent).eq(true);
            expect(response[1].isBusy).eq(false);
        });
        it('should throw', async function () {
            const path = '';
            const type = 'https';
            let p = new Proxy_1.Proxy();
            try {
                await p.load(path, type);
            } catch (e) {
                expect(e.message).eq('Invalid proxy_path');
            }
        });
    });
});
//# sourceMappingURL=Proxy.test.js.map