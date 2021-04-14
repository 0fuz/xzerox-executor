export declare class Metric {
    private metric;
    private interval;

    constructor(defaultKeys?: string[]);

    has(key: string): boolean;

    inc(key: string, value?: number): void;

    set(key: string, value?: number): void;

    _interval(left: number, callbackUrl?: string): void;

    startInterval(calculateLeftCb: () => number, interval?: number, callbackUrl?: string): void;

    stopInterval(): void;
}
