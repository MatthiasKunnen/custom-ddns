import type {IpVersion, Variable} from 'ddns-base';

import type {CloudflareProviderConfig} from './cloudflare/config.interface';

export interface UpdateIpInput {
    config: ProviderConfigs;
    getVariable: (variable: Variable) => string | null | undefined;
    ip: string;
    ipVersion: IpVersion;
    requestHosts: Array<string>;
}

export interface Provider {
    updateIp: (input: UpdateIpInput) => Promise<void>;
}

export interface ProvidersConfig {
    cloudflare?: CloudflareProviderConfig;
}

export type ProviderConfigs = CloudflareProviderConfig;

export interface ProviderBaseConfig {

    /**
     * When true, any hostname specified in the request will be updated. Is combined with the
     * `hosts` property.
     * @default false
     */
    useHostsFromRequest?: boolean | null;
}
