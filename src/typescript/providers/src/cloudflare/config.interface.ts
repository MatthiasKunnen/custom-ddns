import type {Variable} from 'ddns-base';

export interface CloudflareProviderConfig {
    name: 'Cloudflare';
    config: CloudflareConfig;
}

export interface CloudflareConfig {

    /**
     * The API token used when updating DNS records on Cloudflare. Needs DNS:Edit permissions.
     */
    apiToken: Variable;

    /**
     * Whether to enable proxy. If not specified, update will not overwrite existing setting and
     * create will use the Cloudflare default.
     */
    proxied?: Variable<boolean> | null;

    /**
     * The Time To Live in seconds to be set on DNS records. If not specified, update will not set
     * TTL and create will use automatic TTL.
     */
    ttl?: Variable<number> | null;

    /**
     * The Cloudflare Zone ID. See
     * <https://developers.cloudflare.com/fundamentals/get-started/basic-tasks/find-account-and-zone-ids/0>
     */
    zoneId: Variable;
}
