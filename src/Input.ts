import {isValidFilepath, isValidUrl, loadFile, loadUrl} from "./Helper";

export type InputHandlerFn = (inputLine: string) => any

export enum InputHandlerConstant {
    'data_data' = 'data:data',
}

export function parseDataData(line: string): string[] {
    let d1 = line.indexOf(';');
    let d2 = line.indexOf(':');
    let delimiter = '';

    if (d1 === -1 && d2 === -1) {
        throw Error('Delimiter not found')
    }

    if (d1 >= 0 && d2 >= 0) delimiter = (d1 < d2) ? ';' : ':';
    if (d1 === -1 && d2 !== -1) delimiter = ':';
    if (d2 === -1 && d1 !== -1) delimiter = ';';

    let left = line.substring(0, line.indexOf(delimiter));
    let right = line.substring(line.indexOf(delimiter) + 1);
    return [left, right];
}

export class Input {
    constructor(public inputLineHandler: InputHandlerFn | InputHandlerConstant = InputHandlerConstant.data_data) {
        if (!inputLineHandler) {
            throw Error('invalid inputLineHandler')
        }
    }

    // parses inputFileLines with specified options.
    makeJobs(inputLines: string[]): string[][] {
        let results = [];

        for (let i = 0; i < inputLines.length; i++) {
            const inputLine = inputLines[i];

            if (inputLine === '') continue

            if (typeof this.inputLineHandler === 'function') {
                let res = this.inputLineHandler(inputLine)
                if (res && res !== '') {
                    results.push(res)
                }
                continue
            }

            if (this.inputLineHandler === 'data:data') {
                results.push(parseDataData(inputLine))
                continue
            }

            throw new Error('Unknown inputLineHandler')
        }

        return results
    }

    async load(path: string, maxFileSizeMB = 200) {
        if (isValidUrl(path)) {
            let inputLines = await loadUrl(path)
            return this.makeJobs(inputLines)
        } else if (isValidFilepath(path)) {
            let inputLines = await loadFile(path, maxFileSizeMB * 1024 * 1024)
            return this.makeJobs(inputLines)
        } else {
            throw Error('Invalid input_path')
        }
    }
}
