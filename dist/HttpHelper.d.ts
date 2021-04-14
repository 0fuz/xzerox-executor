/**
 * Retrieve sub string by passing 'start' and 'end' substring
 * example: parse('123baaz321', '123', '321') will return 'baaz'
 * example: parse('123baaz321', '123', '---') will return ''
 */
import {Metric} from "./Metric";

export declare function parse(source: string, start: string, end: string): string;

/**
 * Checks does given object contains all needed nested keys
 *
 * hasKey({a:{b:true}}, 'a.b')    // true
 * hasKey({a:{b:true}}, 'a.b.c')  // false
 * hasKey('string', 'a.b.c')      // false
 *
 * @param {object} object - any object like json
 * @param {string} keys   - 'a.b.c.d'
 * @return {boolean}
 */
export declare function hasKey(object: any, keys: string): boolean;

export declare function isBadProxyError(e: Error): boolean;

export declare function isItUsualError(e: Error, metric: Metric): boolean;
