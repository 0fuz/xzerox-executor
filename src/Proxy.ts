// @tg-ignore
import {HttpProxyAgent, HttpsProxyAgent} from 'hpagent';

import {isValidFilepath, isValidUrl, loadFile, loadUrl, timeout} from './Helper'

const {URL} = require('url')

type AgentObject = {
    agent: any,
    isBusy: boolean,
}

export enum ProxyType {
    'http' = 'http',
    'https' = 'https',
    'smartproxy' = 'smartproxy', // supports session based way
    'oxylabs' = 'oxylabs',       // supports session based way
    'luminati' = 'luminati',     // supports session based way

    'any' = 'any',               // any kind of proxy are fine for those executor
    'sticky' = 'sticky',         // suggestion to use sticky or session based
}

export type HPagent = {
    keepAlive: boolean,
    keepAliveMsecs: number,
    maxSockets: number,
    maxFreeSockets: number,
    proxy: string
}

export const DefaultProxyHPagentSettings: HPagent = {
    keepAlive: true,
    keepAliveMsecs: 10000,
    maxSockets: 256,
    maxFreeSockets: 256,
    proxy: '' // http://a:p@domain:port
}

export class Proxy {
    constructor(
        public hpagent_config: HPagent = DefaultProxyHPagentSettings
    ) {
    }

    /**
     *
     * @param proxies
     * @param type      http|https
     */
    makeAgents(proxies: string[], type: string) {
        let hpagent_config = Object.assign({}, this.hpagent_config)

        let agents = []
        for (let i = 0; i < proxies.length; i++) {
            let proxy = proxies[i];
            if (!proxy.startsWith('http')) {
                if (type === 'http' || type === 'https') {
                    proxy = 'http' + '://' + proxy;
                    // proxy = type + '://' + proxy;
                } else {
                    proxy = 'http://' + proxy;
                }
            }

            try {
                let agent = null;

                if (type === 'http') {
                    hpagent_config.proxy = proxy
                    agent = new HttpProxyAgent(hpagent_config)
                }

                if (type === 'https') {
                    hpagent_config.proxy = proxy
                    agent = new HttpsProxyAgent(hpagent_config)
                }

                if (type === 'smartproxy' || type === 'oxylabs' || type === 'luminati') {

                    hpagent_config.proxy = proxy
                    agent = new HttpsProxyAgent(hpagent_config)

                    let url = new URL(proxy)
                    if (url.username !== '' && url.password !== '') {
                        let randomId = (10000000 * Math.random()) | 0
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
                            hpagent_config.proxy = temp_proxy
                            agent = new HttpsProxyAgent(hpagent_config)
                        }
                    }
                }

                if (agent) {
                    agents.push(agent)
                }
            } catch (e) {
                // invalid lines ll be omitted
            }
        }

        return agents;

    }

    makeAgentsObject(agents: any[]): AgentObject[] {
        return agents.map((agent: any) => {
            return {agent, isBusy: false}
        })
    }

    async load(path: string, type: string): Promise<AgentObject[]> {
        if (isValidUrl(path)) {
            let proxies = await loadUrl(path)
            let agents = this.makeAgents(proxies, type)
            return this.makeAgentsObject(agents)
        } else if (isValidFilepath(path)) {
            let proxies = await loadFile(path)
            let agents = this.makeAgents(proxies, type)
            return this.makeAgentsObject(agents)
        } else {
            throw Error('Invalid proxy_path')
        }
    }
}

export class AgentManager {
    public agentIndex = 0

    constructor(public agents: AgentObject[]) {

    }

    async getFree() {

        while (!this.agents[this.agentIndex] || this.agents[this.agentIndex].isBusy) {
            this.agentIndex++
            if (this.agentIndex >= this.agents.length) {
                this.agentIndex = 0
            }
            await timeout(100)
        }

        this.agents[this.agentIndex].isBusy = true
        return [this.agentIndex, this.agents[this.agentIndex].agent]
    }

    setFree(index: number): void {
        if (index >= this.agents.length) return

        this.agents[index].isBusy = false
    }
}