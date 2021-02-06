// import app from './app';
import * as chai from 'chai';
// import * as fs from 'fs';
import {appendFileSync, existsSync, readFileSync, rmSync, unlinkSync, writeFileSync} from 'fs'
import 'mocha';
import {CacheLineTypes, FileCache, FileCacheOptions} from "./FileCache";
import chaiHttp = require('chai-http');

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
            const expecting = 'opts required parameters not specified'
            try {
                // @ts-ignore
                new FileCache(null)
            } catch (e) {
                expect(e.message).eq(expecting)
            }
        });
    });

    describe('shortNamesToPaths', function () {
        it('should work', function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                    'processed2': CacheLineTypes.info_data_data,
                    // @ts-ignore
                    '': null,
                }
            }

            let fc = new FileCache(opts)
            let result = fc.shortNamesToPaths(opts)

            appendFileSync(result['processed'], 'test')
            expect(readFileSync(result['processed'], 'utf8')).eq('test')
            unlinkSync(result['processed'])
            rmSync(opts.folder, {recursive: true, force: true})
        });
        it('should create folder work', function () {

            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                    'processed2': CacheLineTypes.info_data_data,
                }
            }

            rmSync(opts.folder, {recursive: true, force: true})

            let fc = new FileCache(opts)
            fc.shortNamesToPaths(opts)

            expect(existsSync(opts.folder)).eq(true)
            rmSync(opts.folder, {recursive: true, force: true})
        });
    });

    describe('save', function () {
        it('should save', function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                }
            }
            const whatToWrite1 = 'test data'
            const whatToWrite2 = 'test data2'
            const key = 'processed'
            const expecting = 'test data\ntest data2\n'

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            fc.save(key, whatToWrite1)
            fc.save(key, whatToWrite2)

            let data = readFileSync(fc.cachePaths[key], 'utf8')
            unlinkSync(fc.cachePaths[key])

            expect(data).eq(expecting)

        });

        it('should throw', function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                }
            }

            const expecting = 'unknown name';
            try {
                let fc = new FileCache(opts)
                fc.cachePaths = {}
                fc.save('', '')
            } catch (e) {
                expect(e.message).eq(expecting)
            }
        });
    });

    describe('saveError', function () {
        it('should save', function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                }
            }
            const whatToWrite1 = new Error('test data')
            const expecting = 'test data'

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            fc.saveError(whatToWrite1)

            let data = readFileSync(fc.cachePaths['error'], 'utf8')
            unlinkSync(fc.cachePaths['error'])

            expect(data.startsWith(expecting)).true
        });
    });

    describe('removeDataByCacheFile', function () {
        it('should work CacheLineTypes.data #1', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                }
            }
            const key = 'processed'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4']
            ]
            const cacheData = `aaaa1:bbb1\naaaa2\n`
            const expecting: any = {
                "lines": [
                    ["aaaa3", "bbbb3"],
                    ["aaaa4", "bbbb4",],
                ],
                "removed": 2,
                "size": {
                    "after": 2,
                    "before": 4,
                }
            }

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            writeFileSync(fc.cachePaths[key], cacheData)

            let result = await fc.removeDataByCacheFile(lines, key)

            expect(result).deep.eq(expecting)
        });

        it('should work CacheLineTypes.data_data #2', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data_data,
                }
            }
            const key = 'processed'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ]
            const cacheData = `aaaa1:bbbb1\naaaa2:bbbb2222\naaaa2\n`
            const expecting: any = {
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
            }

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            writeFileSync(fc.cachePaths[key], cacheData)

            let result = await fc.removeDataByCacheFile(lines, key)

            expect(result).deep.eq(expecting)
        });

        it('should work CacheLineTypes.info_data', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.info_data,
                }
            }
            const key = 'processed'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ]
            const cacheData = [
                'info | info | aaaa1 | bbb1111b1',
                'info | aaaa2 | bbb2222b2',
            ].join('\n')
            const expecting: any = {
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
            }

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            writeFileSync(fc.cachePaths[key], cacheData)

            let result = await fc.removeDataByCacheFile(lines, key)

            expect(result).deep.eq(expecting)
        });

        it('should work CacheLineTypes.info_data_data', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.info_data_data,
                }
            }
            const key = 'processed'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ]
            const cacheData = [
                'info | info | aaaa1 | bbb1111b1',
                'info | aaaa2 | bbb2222b2',
                'info | aaaa3 | bbbb3',
                'info | info | aaaa4 | bbbb4',
            ].join('\n')
            const expecting: any = {
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
            }

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            writeFileSync(fc.cachePaths[key], cacheData)

            let result = await fc.removeDataByCacheFile(lines, key)

            expect(result).deep.eq(expecting)
        });

        it('should throw', function () {
            const key = 'processed'
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    [key]: CacheLineTypes.info_data_data,
                }
            }
            const expecting = 'key not exists'

            let fc = new FileCache(opts)
            fc.cachePaths = {}

            try {
                fc.removeDataByCacheFile([], key)
            } catch (e) {
                expect(e.message).eq(expecting)
            }
        });


        it('should return empty', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data,
                }
            }
            const key = 'processed'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4']
            ]
            const expecting: any = {
                "lines": lines,
                "removed": -1,
                "size": {
                    "after": -1,
                    "before": 4,
                }
            }

            let fc = new FileCache(opts)
            rmSync(fc.cachePaths[key])

            let result = await fc.removeDataByCacheFile(lines, key)

            expect(result).deep.eq(expecting)
        });
    });

    describe('removeAll', function () {

        it('should work CacheLineTypes.info_data_data', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data_data,
                    'processed2': CacheLineTypes.data,
                }
            }
            const key1 = 'processed'
            const key2 = 'processed2'
            const lines = [
                ['aaaa1', 'bbbb1'],
                ['aaaa2', 'bbbb2'],
                ['aaaa3', 'bbbb3'],
                ['aaaa4', 'bbbb4'],
                ['aaaa5']
            ]
            const cacheData1 = [
                'aaaa1:bbbb1',
                'aaaa2:bbbasddb2',
            ].join('\n')

            const cacheData2 = [
                'aaaa3:aaaa',
                'aaaa5',
            ].join('\n')

            const expecting: any[] = [
                ["aaaa2", "bbbb2",],
                ["aaaa4", "bbbb4",]
            ]

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)
            writeFileSync(fc.cachePaths[key1], cacheData1)
            writeFileSync(fc.cachePaths[key2], cacheData2)

            let result = await fc.removeAll(lines)

            expect(result).deep.eq(expecting)
        });

        it('should throw', async function () {
            const opts: FileCacheOptions = {
                project: 'pj',
                folder: 'temp',
                cache: {
                    'processed': CacheLineTypes.data_data,
                    'processed2': CacheLineTypes.data,
                }
            }

            const expecting = 'Not enough required arguments'

            rmSync(opts.folder, {recursive: true, force: true})
            let fc = new FileCache(opts)

            fc.cachePaths = {}

            try {
                await fc.removeAll([])
            } catch (e) {
                expect(e.message).eq(expecting)
            }
        });
    });
});