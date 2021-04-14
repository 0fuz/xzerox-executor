export declare type InputHandlerFn = (inputLine: string) => any;
export declare enum InputHandlerConstant {
    'data_data' = "data:data"
}
export declare function parseDataData(line: string): string[];
export declare class Input {
    inputLineHandler: InputHandlerFn | InputHandlerConstant;
    constructor(inputLineHandler?: InputHandlerFn | InputHandlerConstant);
    makeJobs(inputLines: string[]): string[][];
    load(path: string, maxFileSizeMB?: number): Promise<string[][]>;
}
