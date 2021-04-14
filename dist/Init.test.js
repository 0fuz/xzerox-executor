"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
// import app from './app';
const chai = require("chai");
require("mocha");
const fs = require("fs");
const fs_1 = require("fs");
const Init_1 = require("./Init");
const FileCache_1 = require("./FileCache");
const async_1 = require("async");
const Helper_1 = require("./Helper");
const expect = chai.expect;
describe('Init', function () {
    const fileCacheOptionsMock = {
        project: 'aa',
        folder: 'aa',
        cache: {},
    };
    describe('constructor', function () {
        it('should set default settings', function () {
            const settings = {
                'fileCacheOptions': fileCacheOptionsMock
            };
            const expecting = {
                "fileCacheOptions": {
                    "cache": {},
                    "folder": "aa",
                    "project": "aa",
                },
                "inputLineHandler": "data:data",
                "proxyHPagent": {
                    "keepAlive": true,
                    "keepAliveMsecs": 10000,
                    "maxFreeSockets": 256,
                    "maxSockets": 256,
                    "proxy": "",
                },
                "supportedProxyTypes": ['any'],
                defaultMetricKeys: []
            };
            let i = new Init_1.Init(settings);
            expect(i.opts).deep.eq(expecting);
        });
        it('should throw', function () {
            const settings = null;
            const expecting = 'Not enough required arguments';
            try {
                // @ts-ignore
                let i = new Init_1.Init(settings);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
        it('should throw 2', function () {
            const settings = {};
            const expecting = 'opts.fileCacheOptions not provided!';
            try {
                // @ts-ignore
                let i = new Init_1.Init(settings);
            } catch (e) {
                expect(e.message).eq(expecting);
            }
        });
    });
    describe('loadPreviousArgs', function () {
        it('should load', function () {
            let i = new Init_1.Init({'fileCacheOptions': fileCacheOptionsMock});
            const args_path = i.argsCacheFilename;
            const args = {"input_path": "aaaa.txt"};
            const expecting = args;
            if (!fs.existsSync('args')) {
                fs.mkdirSync('args');
            }
            fs.writeFileSync(args_path, JSON.stringify(args));
            let result = i.loadPreviousArgs();
            fs.unlinkSync(args_path);
            expect(result).deep.eq(expecting);
            fs_1.rmSync('args', {recursive: true, force: true});
        });
        it('config not exists', function () {
            let i = new Init_1.Init({'fileCacheOptions': fileCacheOptionsMock});
            const args_path = 'temp.txt';
            const expecting = null;
            let result = i.loadPreviousArgs();
            expect(result).deep.eq(expecting);
            fs_1.rmSync('args', {recursive: true, force: true});
        });
    });
    describe('saveArgsToFile', function () {
        it('should save', function () {
            let i = new Init_1.Init({'fileCacheOptions': fileCacheOptionsMock});
            const args_path = i.argsCacheFilename;
            const args = {"input_path": "aaaa.txt"};
            const expecting = args;
            let result = i.saveArgsToFile(args);
            let data = JSON.parse(fs.readFileSync(i.argsCacheFilename, 'utf8'));
            fs.unlinkSync(i.argsCacheFilename);
            expect(data).deep.eq(expecting);
            fs_1.rmSync('args', {recursive: true, force: true});
        });
    });
    describe('readArgs', function () {
        it('should read args and save them to the file', function () {
            process.argv.push('--input=input.txt');
            process.argv.push('--proxy=proxy.txt');
            process.argv.push('--proxy_type=http');
            process.argv.push('--threads=200');
            process.argv.push('--deleteCacheFromInput=false');
            process.argv.push('--maxInputSize=150');
            const expecting = {
                "maxInputSize": 150,
                "deleteCacheFromInput": false,
                "input": "input.txt",
                "proxy": "proxy.txt",
                "proxy_type": "http",
                "threads": 200,
            };
            let i = new Init_1.Init({'fileCacheOptions': fileCacheOptionsMock});
            if (fs.existsSync(i.argsCacheFilename)) {
                fs.unlinkSync(i.argsCacheFilename);
            }
            let args = i.readArgs();
            let exists = fs.existsSync(i.argsCacheFilename);
            if (fs.existsSync(i.argsCacheFilename)) {
                fs.unlinkSync(i.argsCacheFilename);
            }
            expect(args).deep.eq(expecting);
            expect(exists).eq(true);
            fs_1.rmSync('args', {recursive: true, force: true});
        });
        // it('deleteCacheFromInput default', function () {
        //     process.argv.push('--input=input.txt')
        //     process.argv.push('--proxy=proxy.txt')
        //     process.argv.push('--proxy_type=http')
        //     process.argv.push('--threads=200')
        //     console.log(process.argv);
        //
        //     const expecting = {
        //         "maxInputSize": 200,
        //         "deleteCacheFromInput": true,
        //         "input": "input.txt",
        //         "proxy": "proxy.txt",
        //         "proxy_type": "http",
        //         "threads": 200,
        //     }
        //
        //     let i = new Init({'fileCacheOptions': fileCacheOptionsMock})
        //     if (fs.existsSync(i.argsCacheFilename)) {
        //         fs.unlinkSync(i.argsCacheFilename)
        //     }
        //
        //     let args = i.readArgs()
        //     let exists = fs.existsSync(i.argsCacheFilename)
        //
        //     if (fs.existsSync(i.argsCacheFilename)) {
        //         fs.unlinkSync(i.argsCacheFilename)
        //     }
        //
        //
        //     rmSync('args', {recursive: true, force: true})
        //     process.argv.pop();
        //     process.argv.pop();
        //     process.argv.pop();
        //     process.argv.pop();
        //     console.log(process.argv);
        //
        //     expect(args).deep.eq(expecting)
        //     expect(exists).eq(true)
        // });
        it('should throw', function () {
            // process.argv.push('--threads=200')
            const expecting = 'Not enough required arguments.\nRequired input,proxy,proxy_type,threads';
            let i = new Init_1.Init({'fileCacheOptions': fileCacheOptionsMock});
            try {
                let args = i.readArgs();
            } catch (e) {
                expect(e.message).eq(expecting);
            }
            fs_1.rmSync('args', {recursive: true, force: true});
        });
    });
    describe('exploring...', function () {
        const steps = 10000;
        it('1 throw layer', function () {
            const message = `\t1 throw layer`;
            let handled = 0;
            console.time(message);
            for (let i = 0; i < steps; i++) {
                try {
                    (() => {
                        throw Error('aaaa');
                    })();
                } catch (e) {
                    handled++;
                }
            }
            console.timeEnd(message);
        });
        it('3 throw layers', function () {
            const message = `\t3 throw layer`;
            let handled = 0;
            console.time(message);
            for (let i = 0; i < steps; i++) {
                try {
                    (() => {
                        (() => {
                            (() => {
                                throw Error('aaaa');
                            })();
                        })();
                    })();
                } catch (e) {
                    handled++;
                }
            }
            console.timeEnd(message);
        });
        it('10 throw layer', function () {
            const message = `\t10 throw layer`;
            let handled = 0;
            console.time(message);
            for (let i = 0; i < steps; i++) {
                try {
                    (() => {
                        (() => {
                            (() => {
                                (() => {
                                    (() => {
                                        (() => {
                                            (() => {
                                                (() => {
                                                    (() => {
                                                        (() => {
                                                            throw Error('aaaa');
                                                        })();
                                                    })();
                                                })();
                                            })();
                                        })();
                                    })();
                                })();
                            })();
                        })();
                    })();
                } catch (e) {
                    handled++;
                }
            }
            console.timeEnd(message);
        });
    });
    describe('exploring2...', function () {
        let steps = 100000;
        it('use delete', function () {
            const message = 'use delete';
            let kv = {};
            for (let i = 0; i < steps; i++) {
                kv[i] = i;
            }
            console.time(message);
            for (let i = 0; i < steps; i++) {
                delete kv[i];
            }
            console.timeEnd(message);
        });
        it('use null and then delete', function () {
            const message = 'use null and then delete';
            let kv = {};
            for (let i = 0; i < steps; i++) {
                kv[i] = i;
            }
            console.time(message);
            for (let i = 0; i < steps; i++) {
                kv[i] = null;
            }
            for (let i = 0; i < steps; i++) {
                if (kv[i] === null) {
                    delete kv[i];
                }
            }
            console.timeEnd(message);
        });
        it('use array', function () {
            const message = 'use array';
            let kv = [];
            for (let i = 0; i < steps; i++) {
                kv.push([i, i]);
            }
            console.time(message);
            for (let i = 0; i < steps; i++) {
                delete kv[i];
            }
            console.timeEnd(message);
        });
        it('use array2', function () {
            const message = 'use array2';
            let kv = [];
            for (let i = 0; i < steps; i++) {
                kv.push([i, i]);
            }
            console.time(message);
            for (let i = 0; i < steps; i++) {
                kv[i] = null;
            }
            kv = kv.filter((v) => {
                return v !== null;
            });
            console.timeEnd(message);
        });
    });
    describe('start', function () {
        it('should work', async function () {
            const args = {
                "input": "input.txt",
                "proxy": "proxy.txt",
                "proxy_type": "http",
                "threads": 1,
            };
            const settings = {
                'fileCacheOptions': {
                    project: 'pp',
                    folder: 'pp',
                    cache: {'processed': FileCache_1.CacheLineTypes.data_data}
                },
            };
            const inputData = 'aa:bb\ncc:dd\n';
            const proxyData = '1.2.3.4:12345\nuser:pass@1.2.3.4:1234\n';
            fs.writeFileSync(args.input, inputData);
            fs.writeFileSync(args.proxy, proxyData);
            let i = new Init_1.Init(settings);
            await i.start(args, async () => {
            }, async (data, agent) => {
                return Init_1.JobResult.Finished;
            });
            fs.unlinkSync(args.input);
            fs.unlinkSync(args.proxy);
            fs.rmdirSync('pp', {recursive: true});
        });
        it('should calculate the right amount of jobs', function (done) {
            let q = async_1.queue(async (task) => {
                if (task <= 2) {
                    await Helper_1.timeout(500);
                } else {
                    await Helper_1.timeout(200);
                }
            }, 2);
            q.push([1, 2, 3, 4, 5, 6]);
            console.log(q.length(), q.running());
            let i = setInterval(() => {
                console.log(q.length(), q.running());
            }, 200);
            q.drain(function () {
                console.log('all items have been processed');
                clearInterval(i);
                done();
            });
        });
    });
});
//# sourceMappingURL=Init.test.js.map