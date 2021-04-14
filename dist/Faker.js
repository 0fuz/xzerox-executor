"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Faker = exports.AndroidVersionAndSdk = exports.BrowserResolution = exports.PhoneResolution = exports.IosDevices = void 0;
const uuid_1 = require("uuid");
const crypto = require("crypto");
const lodash_1 = require("lodash");
exports.IosDevices = [
    {name: "iPhone5,1", model: "N41AP"},
    {name: "iPhone5,2", model: "N42AP"},
    {name: "iPhone5,3", model: "N48AP"},
    {name: "iPhone5,4", model: "N49AP"},
    {name: "iPhone6,1", model: "N51AP"},
    {name: "iPhone6,2", model: "N53AP"},
    {name: "iPhone7,2", model: "N61AP"},
    {name: "iPhone7,1", model: "N56AP"},
    {name: "iPhone8,1", model: "N71AP"},
    {name: "iPhone8,2", model: "N66AP"},
    {name: "iPhone8,4", model: "N69AP"},
    {name: "iPhone9,1", model: "D10AP"},
    {name: "iPhone9,3", model: "D101AP"},
    {name: "iPhone9,2", model: "D11AP"},
    {name: "iPhone9,4", model: "D111AP"},
    {name: "iPhone10,1", model: "D20AP"},
    {name: "iPhone10,4", model: "D201AP"},
    {name: "iPhone10,2", model: "D21AP"},
    {name: "iPhone10,5", model: "D211AP"},
    {name: "iPhone10,3", model: "D22AP"},
    {name: "iPhone10,6", model: "D221AP"},
    {name: "iPhone11,8", model: "N841AP"},
    {name: "iPhone11,2", model: "D321AP"},
    {name: "iPhone11,6", model: "D331pAP"},
];
exports.PhoneResolution = [
    [960, 540], [1280, 720], [1920, 1080],
    [1200, 768], [1440, 2560], [1080, 1920], [1440, 2960],
    [1080, 2160], [1440, 2560], [1440, 2560], [1080, 1920],
    [1440, 2960], [1440, 2560], [1440, 2560], [1080, 1920],
    [1440, 2960], [1440, 2960], [1440, 2960], [1440, 2960],
    [1440, 2560], [1440, 2560], [1536, 2048], [1200, 1920],
    [800, 1280], [2560, 1700],
];
exports.BrowserResolution = [
    [800, 600], [1024, 768], [1280, 720], [1280, 800],
    [1280, 1024], [1360, 768], [1366, 768], [1440, 900],
    [1536, 864], [1600, 900], [1680, 1050], [1920, 1080],
    [1920, 1200], [2048, 1152], [2560, 1080], [2560, 1440],
    [3440, 1440], [3840, 2160],
];
exports.AndroidVersionAndSdk = {
    '5.0': '21',
    '5.0.1': '21',
    '5.0.2': '21',
    '5.1': '22',
    '5.1.1': '22',
    '6.0': '23',
    '6.0.1': '23',
    '7.0': '24',
    '7.1': '25',
    '7.1.1': '25',
    '7.1.2': '25',
    '8.0': '26',
    '8.1.0': '27',
    '9.0': '28',
    '10.0': '29',
    '11': '30',
};
class Faker {
    constructor() {
    }
    _random(arr) {
        return arr[lodash_1.random(0, arr.length - 1)];
    }
    /**
     * @return {{brand, name, device, model}[]}
     */
    androidDevices() {
        if (!this.androidDevicesList) {
            this.androidDevicesList = require('android-device-list');
        }
        return this.androidDevicesList.deviceList();
    }
    createAndroidDevice() {
        let d = this._random(this.androidDevices());
        let [version, sdk] = this.generateAndroidVersion();
        return {
            version: version,
            sdk: sdk,
            brand: d.brand,
            name: d.name,
            device: d.device,
            model: d.model,
            deviceIdHex16: crypto.randomBytes(8).toString("hex"),
            deviceIdHex32: crypto.randomBytes(16).toString("hex"),
            deviceIdHex40: crypto.randomBytes(20).toString("hex"),
            deviceIdUuid: uuid_1.v1(),
            ts: Math.floor(Date.now() / 1000),
            size: this._random(exports.PhoneResolution)
        };
    }
    androidVersion(minVersion = 4, maxVersion = 12) {
        return `${lodash_1.random(minVersion, maxVersion)}.${lodash_1.random(0, 9)}.${lodash_1.random(0, 9)}`;
    }
    generateAndroidVersion() {
        let list = exports.AndroidVersionAndSdk;
        let keys = Object.keys(list);
        let v = String(this._random(keys));
        // @ts-ignore
        return [v, list[v]];
    }
    iosVersion(minVersion = 11, maxVersion = 12) {
        return [lodash_1.random(minVersion, maxVersion), lodash_1.random(0, 1), lodash_1.random(1, 4)].join('.');
    }
    createIosDevice() {
        let d = this._random(exports.IosDevices);
        return {
            iosV: this.iosVersion(),
            name: d.name,
            model: d.model,
            deviceIdHex16: crypto.randomBytes(8).toString("hex"),
            deviceIdHex32: crypto.randomBytes(16).toString("hex"),
            deviceIdHex40: crypto.randomBytes(20).toString("hex"),
            deviceIdUuid: uuid_1.v1(),
            ts: Math.floor(Date.now() / 1000),
            size: this._random(exports.PhoneResolution)
        };
    }
    generateBrowserResolution() {
        let a = this._random(exports.BrowserResolution);
        let r = lodash_1.random(0.9, 1.05);
        a[0] = parseInt(String(a[0] * r));
        a[1] = parseInt(String(a[1] * r));
        return a;
    }
    /**
     * Checks does given object contains all needed keys
     *
     * hasKey({a:{b:true}}, 'a.b')    // true
     * hasKey({a:{b:true}}, 'a.b.c')  // false
     * hasKey('string', 'a.b.c')      // false
     */
    hasKey(object, ks) {
        if (!object
            || !ks
            || typeof object === 'string') {
            return false;
        }
        let keys = ks.split('.');
        let obj = object;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (obj[key] === undefined)
                return false;
            if (obj[key] === null)
                return false;
            obj = obj[key];
        }
        return true;
    }
}
exports.Faker = Faker;
//# sourceMappingURL=Faker.js.map