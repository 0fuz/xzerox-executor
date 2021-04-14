export declare function isValidUrl(url: string): boolean;
export declare function isValidFilepath(data: string): boolean;
export declare function loadFile(path: string, maxFileSize?: number): string[];
export declare function loadUrl(link: string): Promise<string[]>;
export declare function timeout(ms: number): Promise<unknown>;
