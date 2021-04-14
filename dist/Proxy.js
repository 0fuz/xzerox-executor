"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.AgentManager = exports.Proxy = exports.DefaultProxyHPagentSettings = exports.ProxyType = void 0;
// @tg-ignore
const hpagent_1 = require("hpagent");
const Helper_1 = require("./Helper");
const {URL} = require('url');
var ProxyType;
(function (ProxyType) {
    ProxyType["http"] = "http";
    ProxyType["https"] = "https";
    ProxyType["smartproxy"] = "smartproxy";
    ProxyType["oxylabs"] = "oxylabs";
    ProxyType["luminati"] = "luminati";
    ProxyType["any"] = "any";
    ProxyType["sticky"] = "sticky";
})(ProxyType = exports.ProxyType || (exports.ProxyType = {}));
exports.DefaultProxyHPagentSettings = {
    keepAlive: true,
    keepAliveMsecs: 10000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy: '' // http://a:p@domain:port
};

class Proxy {
    constructor(hpagent_config = exports.DefaultProxyHPagentSettings) {
        this.hpagent_config = hpagent_config;
    }

    /**
     *
     * @param proxies
     * @param type      http|https
     */
    makeAgents(proxies, type) {
        let hpagent_config = Object.assign({}, this.hpagent_config);
        let agents = [];
        for (let i = 0; i < proxies.length; i++) {
            let proxy = proxies[i];
            if (!proxy.startsWith('http')) {
                if (type === 'http' || type === 'https') {
                    proxy = type + '://' + proxy;
                } else {
                    proxy = 'http://' + proxy;
                }
            }
            try {
                let agent = null;
                if (type === 'http') {
                    hpagent_config.proxy = proxy;
                    agent = new hpagent_1.HttpProxyAgent(hpagent_config);
                }
                if (type === 'https') {
                    hpagent_config.proxy = proxy;
                    agent = new hpagent_1.HttpsProxyAgent(hpagent_config);
                }
                if (type === 'smartproxy' || type === 'oxylabs' || type === 'luminati') {
                    hpagent_config.proxy = proxy;
                    agent = new hpagent_1.HttpsProxyAgent(hpagent_config);
                    let url = new URL(proxy);
                    if (url.username !== '' && url.password !== '') {
                        let randomId = (10000000 * Math.random()) | 0;
                        let temp_proxy = '';
                        if (type === 'smartproxy' && proxy.indexOf('user-') === -1 && proxy.indexOf('-session-') === -1) {
                            temp_proxy = `http://user-${url.username}-session-${randomId}:${url.password}@${url.host}`;
                        }
                        if (type === 'oxylabs' && proxy.indexOf('customer-') === -1 && proxy.indexOf('-sessid-') === -1) {
                            temp_proxy = `http://customer-${url.username}-sessid-${randomId}:${url.password}@${url.host}`;
                        }
                        // lum-customer-hl_123123-zone-static:zonepassword@zproxy.lum-superproxy.io:123123
                        if (type === 'luminati' && proxy.indexOf('-session-') === -1) {
                            temp_proxy = `http://${url.username}-session-${randomId}:${url.password}@${url.host}`;
                        }
                        if (temp_proxy !== '') {
                            hpagent_config.proxy = temp_proxy;
                            agent = new hpagent_1.HttpsProxyAgent(hpagent_config);
                        }
                    }
                }
                if (agent) {
                    agents.push(agent);
                }
            } catch (e) {
                // invalid lines ll be omitted
            }
        }
        return agents;
    }

    makeAgentsObject(agents) {
        return agents.map((agent) => {
            return {agent, isBusy: false};
        });
    }

    async load(path, type) {
        if (Helper_1.isValidUrl(path)) {
            let proxies = await Helper_1.loadUrl(path);
            let agents = this.makeAgents(proxies, type);
            return this.makeAgentsObject(agents);
        } else if (Helper_1.isValidFilepath(path)) {
            let proxies = await Helper_1.loadFile(path);
            let agents = this.makeAgents(proxies, type);
            return this.makeAgentsObject(agents);
        } else {
            throw Error('Invalid proxy_path');
        }
    }
}

exports.Proxy = Proxy;

class AgentManager {
    constructor(agents) {
        this.agents = agents;
        this.agentIndex = 0;
    }

    async getFree() {
        if (this.agentIndex === this.agents.length)
            this.agentIndex = 0;
        while (!this.agents[this.agentIndex] || this.agents[this.agentIndex].isBusy) {
            this.agentIndex++;
            await Helper_1.timeout(100);
        }
        this.agents[this.agentIndex].isBusy = true;
        return [this.agentIndex, this.agents[this.agentIndex].agent];
    }

    setFree(index) {
        if (index >= this.agents.length)
            return;
        this.agents[index].isBusy = false;
    }
}

exports.AgentManager = AgentManager;
//# sourceMappingURL=Proxy.js.map