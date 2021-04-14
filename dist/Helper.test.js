"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
require("mocha");
const Helper_1 = require("./Helper");
const fs = require("fs");
const nock = require("nock");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
describe('Helper', () => {
    describe('isValidUrl', function () {
        it('should detect valid url #1', function () {
            let input = 'http://localhost:1234/test';
            let expecting = true;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect valid url #2', function () {
            let input = 'http://localhost/test';
            let expecting = true;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect valid url #3', function () {
            let input = 'https://localhost/test';
            let expecting = true;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect valid url #4', function () {
            let input = 'ws://localhost:1234/test';
            let expecting = true;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect invalid url #1', function () {
            let input = 'localhost';
            let expecting = false;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect invalid url #2', function () {
            let input = '/var/www/asd.txt';
            let expecting = false;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
        it('should detect invalid url #2', function () {
            let input = 'C:\\123\\123.txt';
            let expecting = false;
            let result = Helper_1.isValidUrl(input);
            expect(result).eq(expecting);
        });
    });
    describe('isValidFilepath', function () {
        it('should detect valid filepath #1', function () {
            const name = 'temp.txt';
            const path = './' + name;
            const expecting = true;
            fs.writeFileSync(name, 'asd');
            let result = Helper_1.isValidFilepath(path);
            expect(result).eq(expecting);
            fs.unlinkSync(name);
        });
        it('should detect valid filepath #2', function () {
            const name = '../temp';
            const path = './' + name;
            const expecting = true;
            fs.writeFileSync(name, 'asd');
            let result = Helper_1.isValidFilepath(path);
            expect(result).eq(expecting);
            fs.unlinkSync(name);
        });
        it('file not exists', function () {
            const path = './' + 'not_exists.txt';
            const expecting = false;
            let result = Helper_1.isValidFilepath(path);
            expect(result).eq(expecting);
        });
        it('invalid filepath', function () {
            const path = 'http://123.txt';
            const expecting = false;
            let result = Helper_1.isValidFilepath(path);
            expect(result).eq(expecting);
        });
    });
    describe('loadFile', function () {
        it('should load file', function () {
            const path = 'temp.txt';
            const data = 'aa:bb\ncc:dd\n';
            const expecting = ['aa:bb', 'cc:dd', ''];
            fs.writeFileSync(path, data);
            let result = Helper_1.loadFile(path);
            fs.unlinkSync(path);
            expect(result).deep.equal(expecting);
        });
        it('should make warn about filesize', function () {
            const path = 'temp.txt';
            const data = 'aa:bb\ncc:dd\n';
            const maxFileSize = 4;
            const expecting = 'File temp.txt have size 12 Bytes but 4 Bytes is the limit.';
            try {
                fs.writeFileSync(path, data);
                Helper_1.loadFile(path, maxFileSize);
                fs.unlinkSync(path);
            } catch (e) {
                expect(e.message).equal(expecting);
            }
        });
    });
    describe('loadUrl', function () {
        it('should load data', async function () {
            const url = 'http://localhost:1234';
            const path = '/';
            const data = 'aa:bb\ncc:dd\n';
            nock(url)
                .get(path)
                .reply(200, data);
            let response = await Helper_1.loadUrl(url + path);
            expect(response).deep.equal(['aa:bb', 'cc:dd', '']);
        });
        it('path not exists', async function () {
            const url = 'http://localhost:1234';
            const path = '/asd';
            const data = 'aa:bb\ncc:dd\n';
            nock(url)
                .get('/')
                .reply(200, data);
            try {
                await Helper_1.loadUrl(url + path);
            } catch (e) {
                expect(e.message).not.equals('');
            }
        });
    });
    describe('timeout', function () {
        it('should work', async function () {
            const delay = 100; // 1sec
            await Helper_1.timeout(delay);
            expect(true).eq(true);
        });
    });
    // it('should return response on call', async () => {
    //     // return chai.request(app).get('/hello')
    //     //     .then(res => {
    //     //         chai.expect(res.text).to.eql("how's it going?");
    //     //     })
    // })
});
//# sourceMappingURL=Helper.test.js.map