"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
// import * as fs from 'fs';
const fs_1 = require("fs");
require("mocha");
const FileCache_1 = require("./FileCache");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;
// describe('Hello API Request', () => {
//     it('should return response on call', async () => {
//         let a = true
//         return a;
//         // return chai.request(app).get('/hello')
//         //     .then(res => {
//         //         chai.expect(res.text).to.eql("how's it going?");
//         //     })
//     })
// })
describe('FileCache', function () {
    describe('constructor', function () {
        it('should throw opts', function () {
            const expecting = 'opts required parameters not specified';
            try {
                // @ts-ignore
                new FileCache_1.FileCache(null);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
    });
    describe('shortNamesToPaths', function () {
        it('should work', function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                    'processed2': FileCache_1.CacheLineTypes.info_data_data,
                    // @ts-ignore
                    '': null,
                }
            };
            let fc = new FileCache_1.FileCache(opts);
            let result = fc.shortNamesToPaths(opts);
            fs_1.appendFileSync(result['processed'], 'test');
            expect(fs_1.readFileSync(result['processed'], 'utf8')).eq('test');
            fs_1.unlinkSync(result['processed']);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should create folder work', function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                    'processed2': FileCache_1.CacheLineTypes.info_data_data,
                }
            };
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fc.shortNamesToPaths(opts);
            expect(fs_1.existsSync(opts.folder)).eq(true);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
    });
    describe('save', function () {
        it('should save', function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                }
            };
            const whatToWrite1 = 'test data';
            const whatToWrite2 = 'test data2';
            const key = 'processed';
            const expecting = 'test data\ntest data2\n';
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fc.save(key, whatToWrite1);
            fc.save(key, whatToWrite2);
            let data = fs_1.readFileSync(fc.cachePaths[key], 'utf8');
            fs_1.unlinkSync(fc.cachePaths[key]);
            expect(data).eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should throw', function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                }
            };
            const expecting = 'unknown name';
            try {
                let fc = new FileCache_1.FileCache(opts);
                fc.cachePaths = {};
                fc.save('', '');
            } catch (e) {
                expect(e.message).eq(expecting);
            }
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
    });
    describe('saveError', function () {
        it('should save', function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                }
            };
            const whatToWrite1 = new Error('test data');
            const expecting = 'test data';
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fc.saveError(whatToWrite1);
            let data = fs_1.readFileSync(fc.cachePaths['error'], 'utf8');
            fs_1.unlinkSync(fc.cachePaths['error']);
            expect(data.startsWith(expecting)).true;
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
    });
    describe('removeDataByCacheFile', function () {
        it('should work CacheLineTypes.data #1', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                }
            };
            const key = 'processed';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4']
            ];
            const cacheData = `aaaa1:bbb1\naaaa2\n`;
            const expecting = {
                "lines": [
                    ["aaaa3", "bbbb3"],
                    ["aaaa4", "bbbb4",],
                ],
                "removed": 2,
                "size": {
                    "after": 2,
                    "before": 4,
                }
            };
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fs_1.writeFileSync(fc.cachePaths[key], cacheData);
            let result = await fc.removeDataByCacheFile(lines, key);
            expect(result).deep.eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should work CacheLineTypes.data_data #2', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data_data,
                }
            };
            const key = 'processed';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ];
            const cacheData = `aaaa1:bbbb1\naaaa2:bbbb2222\naaaa2\n`;
            const expecting = {
                "lines": [
                    ['aaaa2', 'bbbb2'],
                    ['aaaa3', 'bbbb3'],
                    ['aaaa4', 'bbbb4'],
                    ['aaaa5']
                ],
                "removed": 1,
                "size": {
                    "after": 4,
                    "before": 5,
                }
            };
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fs_1.writeFileSync(fc.cachePaths[key], cacheData);
            let result = await fc.removeDataByCacheFile(lines, key);
            expect(result).deep.eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should work CacheLineTypes.info_data', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.info_data,
                }
            };
            const key = 'processed';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ];
            const cacheData = [
                'info | info | aaaa1 | bbb1111b1',
                'info | aaaa2 | bbb2222b2',
            ].join('\n');
            const expecting = {
                "lines": [
                    ['aaaa3', 'bbbb3'],
                    ['aaaa4', 'bbbb4'],
                    ['aaaa5']
                ],
                "removed": 2,
                "size": {
                    "after": 3,
                    "before": 5,
                }
            };
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fs_1.writeFileSync(fc.cachePaths[key], cacheData);
            let result = await fc.removeDataByCacheFile(lines, key);
            expect(result).deep.eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should work CacheLineTypes.info_data_data', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.info_data_data,
                }
            };
            const key = 'processed';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ];
            const cacheData = [
                'info | info | aaaa1 | bbb1111b1',
                'info | aaaa2 | bbb2222b2',
                'info | aaaa3 | bbbb3',
                'info | info | aaaa4 | bbbb4',
            ].join('\n');
            const expecting = {
                "lines": [
                    ['aaaa1', 'bbbb1'],
                    ['aaaa2', 'bbbb2'],
                    ['aaaa5']
                ],
                "removed": 2,
                "size": {
                    "after": 3,
                    "before": 5,
                }
            };
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fs_1.writeFileSync(fc.cachePaths[key], cacheData);
            let result = await fc.removeDataByCacheFile(lines, key);
            expect(result).deep.eq(expecting);
        });
        it('should throw', function () {
            const key = 'processed';
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    [key]: FileCache_1.CacheLineTypes.info_data_data,
                }
            };
            const expecting = 'key not exists';
            let fc = new FileCache_1.FileCache(opts);
            fc.cachePaths = {};
            try {
                fc.removeDataByCacheFile([], key);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
        it('should return empty', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data,
                }
            };
            const key = 'processed';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4']
            ];
            const expecting = {
                "lines": lines,
                "removed": -1,
                "size": {
                    "after": -1,
                    "before": 4,
                }
            };
            let fc = new FileCache_1.FileCache(opts);
            fs_1.rmSync(fc.cachePaths[key]);
            let result = await fc.removeDataByCacheFile(lines, key);
            expect(result).deep.eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
    });
    describe('removeAll', function () {
        it('should work CacheLineTypes.info_data_data', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data_data,
                    'processed2': FileCache_1.CacheLineTypes.data,
                }
            };
            const key1 = 'processed';
            const key2 = 'processed2';
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ];
            const cacheData1 = [
                'aaaa1:bbbb1',
                'aaaa2:bbbasddb2',
            ].join('\n');
            const cacheData2 = [
                'aaaa3:aaaa',
                'aaaa5',
            ].join('\n');
            const expecting = [
                ["aaaa2", "bbbb2",],
                ["aaaa4", "bbbb4",]
            ];
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fs_1.writeFileSync(fc.cachePaths[key1], cacheData1);
            fs_1.writeFileSync(fc.cachePaths[key2], cacheData2);
            let result = await fc.removeAll(lines);
            expect(result).deep.eq(expecting);
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
        it('should throw', async function () {
            const opts = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': FileCache_1.CacheLineTypes.data_data,
                    'processed2': FileCache_1.CacheLineTypes.data,
                }
            };
            const expecting = 'Not enough required arguments';
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
            let fc = new FileCache_1.FileCache(opts);
            fc.cachePaths = {};
            try {
                await fc.removeAll([]);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
            fs_1.rmSync(opts.folder, {recursive: true, force: true});
        });
    });
});
//# sourceMappingURL=FileCache.test.js.map