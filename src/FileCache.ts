import * as fs from "fs";
// import LineByLineReader from "line-by-line";
// @ts-ignore
import * as LineByLineReader from "line-by-line";
import {once} from "events"
import {parseDataData} from "./Input";

export enum CacheLineTypes {
    data = 'data', // without delimiters
    data_data = 'data:data', // any two pieces of data. for example username:password. delimiter only :
    info_data = 'info | data', // details and sensitive credentials. delimiter should be |
    info_data_data = 'info | data | data', // details and credentials. delimiter should be |
    skip = -1,
}

export interface CacheSettings {
    [key: string]: CacheLineTypes
}

export type FileCacheOptions = {
    project: string,
    folder: string,
    cache: CacheSettings,
}

export type RemoveResult = {
    lines: string[][],
    size: {
        before: number,
        after: number,
    }
    removed: number,
}

export type FilePath = string

export interface CachePaths {
    [key: string]: FilePath
}

export class FileCache {
    public cachePaths: CachePaths = {}

    constructor(public opts: FileCacheOptions) {
        if (!opts
            || !opts.project
            || !opts.folder
            || !opts.cache) {
            throw Error('opts required parameters not specified')
        }

        opts.cache['error'] = CacheLineTypes.skip;
        this.cachePaths = this.shortNamesToPaths(opts)
    }

    shortNamesToPaths(opts: FileCacheOptions) {
        let namePath: CachePaths = {}

        const dirPath = process.cwd() + `/${opts.folder}`

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        let keys = Object.keys(opts.cache)
        for (let k of keys) {
            if (!opts.cache[k]) {
                continue
            }
            namePath[k] = dirPath + `/${opts.project}_${k}.txt`

            if (!fs.existsSync(namePath[k])) {
                fs.writeFileSync(namePath[k], '')
            }
        }

        return namePath
    }

    save(shortName: string, data: string) {
        if (!this.cachePaths[shortName]) {
            throw Error('unknown name')
        }

        fs.appendFileSync(this.cachePaths[shortName], data + '\n')
    }

    saveError(error: Error) {
        this.save('error', error.message + '\n' + error.stack + '\n\n')
    }

    async removeDataByCacheFile(lines: string[][], key: string): Promise<RemoveResult> {
        if (!this.cachePaths[key] || !this.opts.cache[key]) {
            throw Error(`key not exists: ${key}`)
        }
        let filePath = this.cachePaths[key]
        let fileCacheType = this.opts.cache[key]

        let result: RemoveResult = {
            lines: [],
            size: {
                before: lines.length,
                after: -1,
            },
            removed: -1,
        }

        if (!fs.existsSync(filePath)) {
            console.log(filePath + " not exists")
            result.lines = lines;
            return result;
        }

        let reader = new LineByLineReader(filePath, {
            encoding: 'utf8',
            skipEmptyLines: true,
        });

        let DataSet = new Set(lines.map((line) => {
            switch (fileCacheType) {
                case CacheLineTypes.data:
                    return line[0]

                case CacheLineTypes.data_data:
                    if (line.length === 1) {
                        return line[0]
                    } else {
                        return line[0] + ':' + line[1]
                    }
                case CacheLineTypes.info_data:
                    return line[0]

                case CacheLineTypes.info_data_data:
                    if (line.length === 1) {
                        return line[0]
                    } else {
                        return line[0] + ':' + line[1]
                    }
            }
        }));

        let removeData = new Set([]);
        reader.on('line', async (line: string) => {
            if (fileCacheType === CacheLineTypes.data) {
                if (line.indexOf(':') !== -1) {
                    let s = parseDataData(line)
                    line = s[0]
                }

                if (DataSet.has(line)) {
                    // @ts-ignore
                    removeData.add(line);
                    return
                }
            }
            if (fileCacheType === CacheLineTypes.data_data) {
                if (DataSet.has(line)) {
                    // @ts-ignore
                    removeData.add(line);
                    return
                }
            }
            if (fileCacheType === CacheLineTypes.info_data) {
                let s = line.toString().replace(/ /gi, '').split('|')
                let p = s[s.length - 2]

                if (DataSet.has(p)) {
                    // @ts-ignore
                    removeData.add(p);
                    return
                }
            }
            if (fileCacheType === CacheLineTypes.info_data_data) {
                let s = line.toString().replace(/ /gi, '').split('|')
                let p = s[s.length - 2] + ':' + s[s.length - 1]
                if (DataSet.has(p)) {
                    // @ts-ignore
                    removeData.add(p);
                    return
                }
            }

        });

        await once(reader, 'end');

        result.lines = lines.filter((line) => {
            switch (fileCacheType) {
                case CacheLineTypes.data:
                    // @ts-ignore
                    return !removeData.has(line[0])

                case CacheLineTypes.data_data:
                    // @ts-ignore
                    return !removeData.has(line[0] + ':' + line[1])

                case CacheLineTypes.info_data:
                    // @ts-ignore
                    return !removeData.has(line[0])

                case CacheLineTypes.info_data_data:
                    // @ts-ignore
                    return !removeData.has(line[0] + ':' + line[1])
            }
        });
        result.size.after = result.lines.length;
        result.removed = result.size.before - result.size.after;

        return result
    }

    async removeAll(lines: string[][]): Promise<string[][]> {
        if (!Object.keys(this.cachePaths).length || !Object.keys(this.opts.cache).length) {
            throw Error('Not enough required arguments')
        }


        for (let k of Object.keys(this.opts.cache)) {
            if (k === 'error') {
                continue;
            }
            let r = await this.removeDataByCacheFile(lines, k)
            lines = r.lines;
            console.log(`Key: ${k}, Was: ${r.size.before}, Removed: ${r.removed}`)
        }

        return lines;
    }


}