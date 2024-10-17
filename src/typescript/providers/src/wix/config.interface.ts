import type {Variable} from 'ddns-base';

import type {ProviderBaseConfig} from '../provider.interface';

export interface WixProviderConfig extends ProviderBaseConfig {
    /**
     * The account ID linked to the API key used when updating DNS records on Wix.
     * @example {"from": "Env", "name": "WIX_ACCOUNT_ID"}
     */
    accountId: Variable;

    /**
     * The API key used when updating DNS records on Wix.
     * Needs All account permissions > Manage Domains.
     * Needs to be created using the account of the owner of the site to which the domain is linked.
     * @example {"from": "Env", "name": "WIX_API_KEY"}
     */
    apiKey: Variable;

    /**
     * The DNS zone.
     * @example example.com
     */
    dnsZone: Variable;

    /**
     * The hosts to update the DNS record of.
     * @example ["example.com", {"name": "example.com", "ttl": 60}]
     */
    hosts?: Array<WixHost>;
}

export type WixHost = WixHostAdvanced | string;

export interface WixHostAdvanced {

    /**
     * The Fully Qualified Domain Name to update the DNS record of.
     */
    name: string;

    /**
     * The Time To Live in seconds to be set on the DNS record. If not specified, update will not
     * set TTL and create will use automatic TTL.
     */
    ttl?: number | null;
}
