import type {IpVersion, Variable} from 'ddns-base';

import type {CloudflareProviderConfig} from './cloudflare/config.interface';
import type {WixProviderConfig} from './wix/config.interface';

export interface UpdateIpInput {
    getVariable: (variable: Variable) => string | null | undefined;
    ip: string;
    ipVersion: IpVersion;
    requestHosts: Array<string>;
}

export interface Provider {
    updateIp: (input: UpdateIpInput) => Promise<void>;

    /**
     * Throws an error if the config is invalid.
     */
    assertValidConfig: () => void;
}

/*
Matches the name of the provider to the configuration object it expects.
The name as it appears in this interface will be as it is expected in the providers section in
config.yaml.
 */
/**
 * An object containing the provider (key), and its respective configuration (value).
 */
export interface ProvidersConfig {
    cloudflare?: CloudflareProviderConfig;
    wix?: WixProviderConfig;
}

export interface ProviderBaseConfig {

    /**
     * When `false` (default), only the hosts in the config will have their IP set.
     * This is more secure as the router will not be able to set arbitrary A and AAAA records.
     *
     * When `true`, any hostname specified in the request will be updated.
     * The hostnames specified in the request are combined with the `hosts` property.
     *
     * @default false
     */
    useHostsFromRequest?: boolean | null;
}
