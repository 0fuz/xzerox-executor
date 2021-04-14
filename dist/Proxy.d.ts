import {HttpProxyAgent, HttpsProxyAgent} from 'hpagent';

declare type AgentObject = {
    agent: any;
    isBusy: boolean;
};
export declare enum ProxyType {
    'http' = "http",
    'https' = "https",
    'smartproxy' = "smartproxy",
    'oxylabs' = "oxylabs",
    'luminati' = "luminati",
    'any' = "any",
    'sticky' = "sticky"
}
export declare type HPagent = {
    keepAlive: boolean;
    keepAliveMsecs: number;
    maxSockets: number;
    maxFreeSockets: number;
    proxy: string;
};
export declare const DefaultProxyHPagentSettings: HPagent;
export declare class Proxy {
    hpagent_config: HPagent;
    constructor(hpagent_config?: HPagent);
    /**
     *
     * @param proxies
     * @param type      http|https
     */
    makeAgents(proxies: string[], type: string): (HttpProxyAgent | HttpsProxyAgent)[];
    makeAgentsObject(agents: any[]): AgentObject[];
    load(path: string, type: string): Promise<AgentObject[]>;
}
export declare class AgentManager {
    agents: AgentObject[];
    agentIndex: number;
    constructor(agents: AgentObject[]);
    getFree(): Promise<any[]>;
    setFree(index: number): void;
}
export {};
