import {HPagent} from './Proxy';
import {InputHandlerConstant, InputHandlerFn} from './Input';
import {FileCache, FileCacheOptions} from "./FileCache";
import {Metric} from "./Metric";

export declare type RequiredArgs = {
    input: string;
    proxy: string;
    proxy_type: string;
    threads: number;
    deleteCacheFromInput?: boolean;
    callbackUrl?: string;
    maxInputSize?: number;
};

export declare enum JobResult {
    Finished = 1,
    Recheck = 0,
    Error = -1
}

export declare type InitConstructorSettings = {
    defaultMetricKeys?: string[];
    fileCacheOptions: FileCacheOptions;
    supportedProxyTypes?: string[];
    inputLineHandler?: InputHandlerFn | InputHandlerConstant;
    proxyHPagent?: HPagent;
};

export declare class Init {
    opts: InitConstructorSettings;
    argsCacheFilename: string;
    argsCacheFolder: string;

    constructor(opts: InitConstructorSettings);

    loadPreviousArgs(): object | null;

    saveArgsToFile(args: object): void;

    readArgs(): RequiredArgs;

    start(args: RequiredArgs, beforeJobHandler: (args: RequiredArgs, fileCache: FileCache, metric: Metric) => Promise<void>, jobHandler: (data: string[], agent: any) => Promise<JobResult>): Promise<void>;
}
