"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.isItUsualError = exports.isBadProxyError = exports.hasKey = exports.parse = void 0;
function parse(source, start, end) {
    if (!source.length ||
        source.indexOf(start) === -1 ||
        source.indexOf(end) === -1)
        return "";
    let startPos = source.indexOf(start) + start.length;
    let secondSource = source.substr(startPos, source.length);
    let endPos = secondSource.indexOf(end);
    return secondSource.substring(0, endPos);
}
exports.parse = parse;
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
function hasKey(object, keys) {
    if (!object
        || !keys
        || typeof object === 'string') {
        return false;
    }
    let keysArr = keys.split('.');
    let obj = object;
    for (let i = 0; i < keysArr.length; i++) {
        const key = keysArr[i];
        if (obj[key] === undefined)
            return false;
        obj = obj[key];
    }
    return true;
}
exports.hasKey = hasKey;
function isBadProxyError(e) {
    if (!e || !e.message)
        return false;
    return e.message.indexOf('sock') !== -1
        || e.message.indexOf('ETIMEDOUT') !== -1
        || e.message.indexOf('ECONNRESET') !== -1
        || e.message.indexOf('ESOCKETTIMEDOUT') !== -1
        || e.message.indexOf('EPROTO') !== -1
        || e.message.indexOf('EADDRINUSE') !== -1
        || e.message.indexOf('Sock') !== -1
        || e.message.indexOf('connect ECONN') !== -1
        || e.message.indexOf('Proxy connection timed out') !== -1
        || e.message.indexOf('self signed certificate in certificate chain') !== -1
        || e.message.indexOf('unable to verify the first certificate') !== -1
        || e.message.indexOf('unable to get local issuer certificate') !== -1
        || e.message.indexOf('certificate') !== -1
        || e.message.indexOf('Parse Error') !== -1
        || e.message.indexOf('wrong version ') !== -1
        || e.message.indexOf('timeout') !== -1;
}
exports.isBadProxyError = isBadProxyError;
function isItUsualError(e, metric) {
    if (!e || !e.message) {
        return false;
    }
    if (isBadProxyError(e)) {
        metric.inc('timeout');
        return true;
    }
    if (metric.has(e.message)) {
        metric.inc(e.message);
        return true;
    }
    return false;
}
exports.isItUsualError = isItUsualError;
//# sourceMappingURL=HttpHelper.js.map