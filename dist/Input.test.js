"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
require("mocha");
const Input_1 = require("./Input");
const fs = require("fs");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
// describe('Hello API Request', () => {
//     it('should return response on call', async () => {
//         let steps = 100000
//         let array = []
//         for (let i = 0; i < steps; i++) {
//             array.push(i + 'should return response on call')
//         }
//
//
//         let a = true
//         return a;
//     })
// })
describe('Input', function () {
    describe('constructor', function () {
        it('should throw', function () {
            const inputLineHandler = null;
            const expecting = 'invalid inputLineHandler';
            try {
                // @ts-ignore
                new Input_1.Input(inputLineHandler);
                throw Error('!!!');
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
    });
    describe('parseDataData', function () {
        it('should parse 1', function () {
            const line = 'aa:bb';
            const expecting = ['aa', 'bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should parse 2', function () {
            const line = 'aa;bb';
            const expecting = ['aa', 'bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should parse 3', function () {
            const line = 'aa:bbb;bb';
            const expecting = ['aa', 'bbb;bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should parse 4', function () {
            const line = 'aa;bbb:bb';
            const expecting = ['aa', 'bbb:bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should parse 5', function () {
            const line = 'aa:bbb:bb';
            const expecting = ['aa', 'bbb:bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should parse 6', function () {
            const line = 'aa;bbb;bb';
            const expecting = ['aa', 'bbb;bb'];
            new Input_1.Input();
            let result = Input_1.parseDataData(line);
            expect(result).deep.eq(expecting);
        });
        it('should throw', function () {
            const line = 'aa|bb';
            const expecting = 'Delimiter not found';
            new Input_1.Input();
            try {
                Input_1.parseDataData(line);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
    });
    describe('makeJobs', function () {
        it('should prepare data:data', function () {
            const inputLines = ['aa:bb', 'cc:dd:dd', ''];
            const inputLineHandler = Input_1.InputHandlerConstant.data_data;
            const expecting = [['aa', 'bb'], ['cc', 'dd:dd']];
            let i = new Input_1.Input(inputLineHandler);
            let result = i.makeJobs(inputLines);
            expect(result).deep.eq(expecting);
        });
        it('should use custom func', function () {
            const inputLines = ['aa:bb', 'cc:dd:dd', ''];
            new Input_1.Input();
            const inputLineHandler = (inputLine) => {
                return Input_1.parseDataData(inputLine);
            };
            const expecting = [['aa', 'bb'], ['cc', 'dd:dd']];
            let i = new Input_1.Input(inputLineHandler);
            let result = i.makeJobs(inputLines);
            expect(result).deep.eq(expecting);
        });
        it('should throw', function () {
            const inputLines = ['aa:bb', 'cc:dd:dd', ''];
            const expecting = 'Unknown inputLineHandler';
            try {
                let i = new Input_1.Input();
                // @ts-ignore
                i.inputLineHandler = 'unknown';
                i.makeJobs(inputLines);
            } catch (e) {
                expect(e.message).deep.eq(expecting);
            }
        });
    });
    describe('load', function () {
        // // // this work on separate execution but not works on global coverage((
        // it('should load data from url', async function () {
        //     const url = 'http://localhost:1234'
        //     const path = '/'
        //     const data = 'aa:bb\naaaa:pppp\n'
        //
        //     nock(url)
        //         .get(path)
        //         .reply(200, data)
        //
        //     let i = new Input()
        //     let response = await i.load(url+path)
        //
        //     expect(response.length).eq(2)
        //     expect(response[0]).deep.eq([ 'aa', 'bb' ])
        //     expect(response[1]).deep.eq([ 'aaaa', 'pppp' ])
        // });
        it('should load data from file', async function () {
            const path = 'temp.txt';
            const data = 'aa:bb\naaaa:pppp\n';
            fs.writeFileSync(path, data);
            let i = new Input_1.Input();
            let response = await i.load(path);
            fs.unlinkSync(path);
            expect(response.length).eq(2);
            expect(response[0]).deep.eq(['aa', 'bb']);
            expect(response[1]).deep.eq(['aaaa', 'pppp']);
        });
        it('should throw', async function () {
            const path = '';
            let p = new Input_1.Input();
            try {
                await p.load(path);
            } catch (e) {
                expect(e.message).eq('Invalid input_path');
            }
        });
    });
});
//# sourceMappingURL=Input.test.js.map