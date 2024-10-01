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

/**
 * Matches the name of the provider to the configuration object it expects.
 * The name as it appears in this interface will be as it is expected in the providers section in
 * config.yaml.
 */
export interface ProvidersConfig {
    cloudflare?: CloudflareProviderConfig;
}

/**
 * Contains all possible provider specific configurations.
 * When creating a new provider, add the config to {@link ProvidersConfig}.
 */
export type ProviderConfigs = NonNullable<ProvidersConfig[keyof ProvidersConfig]>;

export interface ProviderBaseConfig {

    /**
     * When true, any hostname specified in the request will be updated. The hostnames specified in
     * the request are combined with the `hosts` property.
     * @default false
     */
    useHostsFromRequest?: boolean | null;
}
