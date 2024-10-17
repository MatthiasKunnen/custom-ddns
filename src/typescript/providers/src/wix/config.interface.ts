import type {Variable} from 'ddns-base';

import type {ProviderBaseConfig} from '../provider.interface';

export interface WixProviderConfig extends ProviderBaseConfig {
    /**
     * The account ID of the account that created the API key, this can be found at
     * <https://manage.wix.com/account/api-keys> when at least one API key is generated.
     * @example {"from": "Env", "name": "WIX_ACCOUNT_ID"}
     */
    accountId: Variable;

    /**
     * The API key used when updating DNS records on Wix.
     * Generate one at <https://manage.wix.com/account/api-keys> with the
     * `All account permissions > Manage Domains` scope.
     * Only the owner of the Wix _Site_ that is served on the domain can create an API Key with
     * sufficient permissions. **Co-owners' API Keys will result in permission errors.**
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
