import type {Variable} from 'ddns-base';

import type {ProviderBaseConfig} from '../provider.interface';

/**
 * @example
 * {
 *     "apiToken": {
 *         "from": "Env",
 *         "name": "CLOUDFLARE_API_TOKEN",
 *     },
 *     "zoneId": "06653d4635e1aa208992",
 *     "hosts": [
 *         "foo.example.com",
 *         {
 *             "name": "bar.example.com",
 *             "proxied": true,
 *             "ttl": 60,
 *         }
 *     ]
 * }
 */
export interface CloudflareProviderConfig extends ProviderBaseConfig {

    /**
     * The API token used when updating DNS records on Cloudflare. Needs DNS:Edit permissions.
     * @example {"from": "Env", "name": "CLOUDFLARE_API_TOKEN"}
     */
    apiToken: Variable;

    /**
     * The hosts to update the DNS record of.
     * @example ["foo.example.com", {"name": "bar.example.com", "proxied": true, "ttl": 60}]
     */
    hosts?: Array<CloudflareHost>;

    /**
     * The Cloudflare Zone ID. See
     * <https://developers.cloudflare.com/fundamentals/get-started/basic-tasks/find-account-and-zone-ids/0>
     * @example "0eb4e056cd3ad6653d4635e1aa208992"
     */
    zoneId: Variable;
}

export type CloudflareHost = CloudflareHostAdvanced | string;

export interface CloudflareHostAdvanced {

    /**
     * The Fully Qualified Domain Name to update the DNS record of.
     */
    name: string;

    /**
     * Whether to enable proxy. If not specified, update will not overwrite existing setting and
     * create will use the Cloudflare default.
     */
    proxied?: boolean | null;

    /**
     * The Time To Live in seconds to be set on DNS records. If not specified, update will not set
     * TTL and create will use automatic TTL.
     */
    ttl?: number | null;
}
