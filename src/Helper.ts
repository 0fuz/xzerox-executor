import * as fs from "fs";
import got from "got";

const {URL} = require('url')

export function isValidUrl(url: string): boolean {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false
    }

    try {
        (new URL(url))
        return true
    } catch (e) {
        return false;
    }
}

export function isValidFilepath(data: string): boolean {
    if (!fs.existsSync(data)) {
        return false;
    }
    return fs.lstatSync(data).isFile()
}

export function loadFile(path: string, maxFileSize: number = 200 * 1024 * 1024): string[] {
    let stat = fs.statSync(path)

    if (stat.size > maxFileSize) {
        throw Error(`File ${path} have size ${stat.size / 1024 * 1024} Bytes but ${maxFileSize} Bytes is the limit.`)
    }

    return fs.readFileSync(path, 'utf8').replace(/\r/gi, '').split('\n')
}

export async function loadUrl(link: string): Promise<string[]> {
    let res = await got(link).text();
    return res.replace(/\r/gi, '').split('\n')
}

export function timeout(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}