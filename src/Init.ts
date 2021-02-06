import * as fs from "fs";
import {queue} from 'async'
import {AgentManager, DefaultProxyHPagentSettings, HPagent, Proxy, ProxyType} from './Proxy'
import {Input, InputHandlerConstant, InputHandlerFn} from './Input'
import {FileCache, FileCacheOptions} from "./FileCache";
import {Metric} from "./Metric";

export type RequiredArgs = {
    input: string,
    proxy: string,
    proxy_type: string,
    threads: number,
    deleteCacheFromInput?: boolean,
    callbackUrl?: string,
    maxInputSize?: number,
}

export enum JobResult {
    Finished = 1,
    Recheck = 0,
    Error = -1,
}

export type InitConstructorSettings = {
    defaultMetricKeys?: string[],

    fileCacheOptions: FileCacheOptions,
    supportedProxyTypes?: string[],
    inputLineHandler?: InputHandlerFn | InputHandlerConstant,
    proxyHPagent?: HPagent,
}

export class Init {
    public argsCacheFilename = 'args/args_cache.json'
    public argsCacheFolder = 'args'

    constructor(public opts: InitConstructorSettings) {
        if (!opts) {
            throw Error('Not enough required arguments')
        }

        if (!opts.fileCacheOptions) {
            throw Error('opts.fileCacheOptions not provided!')
        }

        if (!opts.defaultMetricKeys) this.opts.defaultMetricKeys = []

        if (!opts.supportedProxyTypes) this.opts.supportedProxyTypes = [ProxyType.any]
        if (!opts.inputLineHandler) this.opts.inputLineHandler = InputHandlerConstant.data_data
        if (!opts.proxyHPagent) this.opts.proxyHPagent = DefaultProxyHPagentSettings

        if (opts.fileCacheOptions && opts.fileCacheOptions.project) {
            this.argsCacheFilename = `${this.argsCacheFolder}/${opts.fileCacheOptions.project}.json`
        }
    }

    loadPreviousArgs(): object | null {
        if (!fs.existsSync(this.argsCacheFolder)) {
            fs.mkdirSync(this.argsCacheFolder)
        }

        if (!fs.existsSync(this.argsCacheFilename)) {
            return null;
        }

        let data = fs.readFileSync(this.argsCacheFilename, 'utf8')

        return JSON.parse(data)
    }

    saveArgsToFile(args: object) {
        fs.writeFileSync(this.argsCacheFilename, JSON.stringify(args))
    }

    readArgs(): RequiredArgs {
        let cache = {}
        if (this.opts.fileCacheOptions.cache) {
            cache = this.opts.fileCacheOptions.cache
        }

        // require there have own reasons for test covering. dont get it close))
        const yargs = require('yargs')

        const argv = yargs

            .command('result_name_type', 'Tells which filenames will be used to store processed data.', {}, (args: any) => {
                console.log(JSON.stringify(cache))
                process.exit(0);
            })

            .command('supported_proxies', 'Tells which proxy are recommended to use.', {}, (args: any) => {
                console.log(JSON.stringify(this.opts.supportedProxyTypes))
                process.exit(0);
            })

            .option('input', {
                alias: 'i',
                description:
                    'Ways to determine:\n' +
                    '1. Obsolete filepath\n' +
                    '2. HTTP GET url. \n' +
                    '   Example http://1.0.0.1:12/jobs_batch  should return same as from 1.\n' +
                    '\n' +
                    'Line contains single ":" delimiter. aa:pp\n',
                type: 'string',
            })

            .option('proxy', {
                alias: 'p',
                description: 'Ways to determine:\n' +
                    '1. Obsolete filepath\n' +
                    '2. HTTP GET url. With response like from file\n' +
                    '   Example http://1.0.0.1:12/jobs_batch  should return same as from 1.' +
                    '\n' +
                    'Possible line formats:\n' +
                    '   // ip or domain doesnt matter\n' +
                    '   ip:port\n' +
                    '   user:pass@ip:port\n',
                type: 'string',
            })

            .option('proxy_type', {
                alias: 'pt',
                description: 'Which proxy type to use.', // todo make list of supported proxy types
                type: 'string',
            })

            .option('threads', {
                alias: 't',
                description: 'how much separate executors to run into single nodejs process',
                type: 'number',
                default: 1,
            })

            .option('callbackUrl', {
                description: 'Ways to determine:\n' +
                    '1. Nothing. Then results of work might be stored on the files only.\n' +
                    '2. HTTP url which supports POST+JSON_body\n' +
                    // todo '3. Websocket url which accepts JSON_body\n' + // todo
                    'JSON_body have this shape:\n' +
                    '{"metric_or_cache_name_there": [result1str, result2str, ...]}\n' +
                    'or {"metric_name": numberToIncrease}\n',
                type: 'string',
            })

            .option('deleteCacheFromInput', {
                alias: 'dcfi',
                description: 'Will remove already processed lines from CacheSettings after loading input',
                type: 'boolean',
                default: true,
            })
            .option('maxInputSize', {
                alias: 'mis',
                description: 'Once input file larger than maxInputSize in MB it will throw error.\n' +
                    'Default 200mb',
                type: 'number',
                default: 200,
            })

            .help()
            .alias('help', 'h')
            .argv;

        let previousConfig = this.loadPreviousArgs();

        let currentArgs: any = {}
        if (argv.input && argv.proxy && argv.proxy_type && argv.threads) {
            currentArgs.input = argv.input
            currentArgs.proxy = argv.proxy
            currentArgs.proxy_type = argv.proxy_type
            currentArgs.threads = argv.threads

            if (argv.callbackUrl) {
                currentArgs.callbackUrl = argv.callbackUrl
            }
            if (argv.deleteCacheFromInput !== undefined) {
                currentArgs.deleteCacheFromInput = argv.deleteCacheFromInput
            }
            if (argv.maxInputSize !== undefined) {
                currentArgs.maxInputSize = argv.maxInputSize
            }
        } else if (previousConfig) {
            console.info('Loaded previous args from', this.argsCacheFilename)
            currentArgs = previousConfig
        } else {
            throw new Error('Not enough required arguments.\nRequired input,proxy,proxy_type,threads')
        }

        this.saveArgsToFile(currentArgs)

        return currentArgs
    }

    async start(args: RequiredArgs,
                // use args to saw settings, if u want
                // use fileCache to store job results into file by shortName
                // use metric to make calculation of job results
                beforeJobHandler: (args: RequiredArgs,
                                   fileCache: FileCache,
                                   metric: Metric
                ) => Promise<void>,
                jobHandler: (data: string[], agent: any) => Promise<JobResult>) {

        let fileCache = new FileCache(this.opts.fileCacheOptions)
        let metric = new Metric(this.opts.defaultMetricKeys)

        let inputClass = new Input(this.opts.inputLineHandler)
        let proxyClass = new Proxy(this.opts.proxyHPagent)

        let input = await inputClass.load(args.input, args.maxInputSize)

        if (args.deleteCacheFromInput) {
            input = await fileCache.removeAll(input)
        }

        if (input.length === 0) {
            return;
        }

        let agents = await proxyClass.load(args.proxy, args.proxy_type)
        if (input.length === 0) {
            return;
        }

        let agentManager = new AgentManager(agents)

        let threads = args.threads;

        await beforeJobHandler(args, fileCache, metric)

        let q = queue(async (task: string[]) => {
            try {

                let [p, agent] = await agentManager.getFree()

                let result = await jobHandler(task, agent)

                if (result !== JobResult.Finished) {
                    await q.push(task);
                }

                if (result === undefined) {
                    await q.push(task);
                }

                agentManager.setFree(p)

            } catch (e) {
                console.error(e)
            }
        }, threads)

        await q.push(input)

        input = [];

        metric.startInterval(() => {
            // @ts-ignore
            return q.length() + q.running() - 1;
        }, 5000)

        await q.drain()

        metric.stopInterval()

    }
}
