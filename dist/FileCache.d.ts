export declare enum CacheLineTypes {
    data = "data",
    data_data = "data:data",
    info_data = "info | data",
    info_data_data = "info | data | data",
    skip = -1
}
export interface CacheSettings {
    [key: string]: CacheLineTypes;
}
export declare type FileCacheOptions = {
    project: string;
    folder: string;
    cache: CacheSettings;
};
export declare type RemoveResult = {
    lines: string[][];
    size: {
        before: number;
        after: number;
    };
    removed: number;
};
export declare type FilePath = string;
export interface CachePaths {
    [key: string]: FilePath;
}
export declare class FileCache {
    opts: FileCacheOptions;
    cachePaths: CachePaths;
    constructor(opts: FileCacheOptions);
    shortNamesToPaths(opts: FileCacheOptions): CachePaths;
    save(shortName: string, data: string): void;
    saveError(error: Error): void;
    removeDataByCacheFile(lines: string[][], key: string): Promise<RemoveResult>;
    removeAll(lines: string[][]): Promise<string[][]>;
}
