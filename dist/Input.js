"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Input = exports.parseDataData = exports.InputHandlerConstant = void 0;
const Helper_1 = require("./Helper");
var InputHandlerConstant;
(function (InputHandlerConstant) {
    InputHandlerConstant["data_data"] = "data:data";
})(InputHandlerConstant = exports.InputHandlerConstant || (exports.InputHandlerConstant = {}));
function parseDataData(line) {
    let d1 = line.indexOf(';');
    let d2 = line.indexOf(':');
    let delimiter = '';
    if (d1 === -1 && d2 === -1) {
        throw Error('Delimiter not found');
    }
    if (d1 >= 0 && d2 >= 0)
        delimiter = (d1 < d2) ? ';' : ':';
    if (d1 === -1 && d2 !== -1)
        delimiter = ':';
    if (d2 === -1 && d1 !== -1)
        delimiter = ';';
    let left = line.substring(0, line.indexOf(delimiter));
    let right = line.substring(line.indexOf(delimiter) + 1);
    return [left, right];
}
exports.parseDataData = parseDataData;
class Input {
    constructor(inputLineHandler = InputHandlerConstant.data_data) {
        this.inputLineHandler = inputLineHandler;
        if (!inputLineHandler) {
            throw Error('invalid inputLineHandler');
        }
    }
    // parses inputFileLines with specified options.
    makeJobs(inputLines) {
        let results = [];
        let delimiterNotFound = 0;
        for (let i = 0; i < inputLines.length; i++) {
            const inputLine = inputLines[i];
            if (inputLine === '')
                continue;
            if (typeof this.inputLineHandler === 'function') {
                let res = this.inputLineHandler(inputLine);
                if (res && res !== '') {
                    results.push(res);
                }
                continue;
            }
            if (this.inputLineHandler === 'data:data') {
                try {
                    results.push(parseDataData(inputLine));
                } catch (e) {
                    if (e.message.includes('Delimiter not found')) {
                        delimiterNotFound++;
                    } else {
                        throw e;
                    }
                }
                continue;
            }
            throw new Error('Unknown inputLineHandler');
        }
        if (delimiterNotFound > 0) {
            console.log('delimiterNotFound: ', delimiterNotFound);
        }
        return results;
    }
    async load(path, maxFileSizeMB = 200) {
        if (Helper_1.isValidUrl(path)) {
            let inputLines = await Helper_1.loadUrl(path);
            return this.makeJobs(inputLines);
        } else if (Helper_1.isValidFilepath(path)) {
            let inputLines = await Helper_1.loadFile(path, maxFileSizeMB * 1024 * 1024);
            return this.makeJobs(inputLines);
        } else {
            throw Error('Invalid input_path');
        }
    }
}
exports.Input = Input;
//# sourceMappingURL=Input.js.map