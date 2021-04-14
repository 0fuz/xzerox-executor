export declare const IosDevices: {
    name: string;
    model: string;
}[];
export declare const PhoneResolution: number[][];
export declare const BrowserResolution: number[][];
export declare const AndroidVersionAndSdk: {
    '5.0': string;
    '5.0.1': string;
    '5.0.2': string;
    '5.1': string;
    '5.1.1': string;
    '6.0': string;
    '6.0.1': string;
    '7.0': string;
    '7.1': string;
    '7.1.1': string;
    '7.1.2': string;
    '8.0': string;
    '8.1.0': string;
    '9.0': string;
    '10.0': string;
    '11': string;
};
export declare class Faker {
    androidDevicesList: any;
    constructor();
    _random(arr: any[]): any;
    /**
     * @return {{brand, name, device, model}[]}
     */
    androidDevices(): any;
    createAndroidDevice(): {
        version: string;
        sdk: string;
        brand: any;
        name: any;
        device: any;
        model: any;
        deviceIdHex16: string;
        deviceIdHex32: string;
        deviceIdHex40: string;
        deviceIdUuid: string;
        ts: number;
        size: any;
    };
    androidVersion(minVersion?: number, maxVersion?: number): string;
    generateAndroidVersion(): string[];
    iosVersion(minVersion?: number, maxVersion?: number): string;
    createIosDevice(): {
        iosV: string;
        name: any;
        model: any;
        deviceIdHex16: string;
        deviceIdHex32: string;
        deviceIdHex40: string;
        deviceIdUuid: string;
        ts: number;
        size: any;
    };
    generateBrowserResolution(): any;
    /**
     * Checks does given object contains all needed keys
     *
     * hasKey({a:{b:true}}, 'a.b')    // true
     * hasKey({a:{b:true}}, 'a.b.c')  // false
     * hasKey('string', 'a.b.c')      // false
     */
    hasKey(object: any, ks: string): boolean;
}
