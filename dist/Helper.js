"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.timeout = exports.loadUrl = exports.loadFile = exports.isValidFilepath = exports.isValidUrl = void 0;
const fs = require("fs");
const got_1 = require("got");
const {URL} = require('url');

function isValidUrl(url) {
    try {
        (new URL(url));
        return true;
    } catch (e) {
        return false;
    }
}

exports.isValidUrl = isValidUrl;

function isValidFilepath(data) {
    if (!fs.existsSync(data)) {
        return false;
    }
    return fs.lstatSync(data).isFile();
}

exports.isValidFilepath = isValidFilepath;

function loadFile(path, maxFileSize = 200 * 1024 * 1024) {
    let stat = fs.statSync(path);
    if (stat.size > maxFileSize) {
        throw Error(`File ${path} have size ${stat.size / 1024 * 1024} Bytes but ${maxFileSize} Bytes is the limit.`);
    }
    return fs.readFileSync(path, 'utf8').replace(/\r/gi, '').split('\n');
}

exports.loadFile = loadFile;

async function loadUrl(link) {
    let res = await got_1.default(link).text();
    return res.replace(/\r/gi, '').split('\n');
}

exports.loadUrl = loadUrl;

function timeout(ms) {
    return new Promise(res => setTimeout(res, ms));
}

exports.timeout = timeout;
//# sourceMappingURL=Helper.js.map