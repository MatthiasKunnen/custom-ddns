import type {CloudflareProviderConfig} from 'ddns-providers';

/**
 * Schema for the configuration that powers the custom DDNS executors.
 */
export interface Config {
    /**
     * The list of configs makes it possible to update multiple domains across multiple providers.
     * See <http://github.com/MatthiasKunnen/custom-ddns/config.yaml>.
     */
    configs: Array<ConfigsItem>;
}

interface ConfigsItem {
    /**
     * When specified, this limits this config item to only be executed when this tag is specified
     * in the update query params.
     */
    tag?: string | null;

    /**
     * The name of the provider to use.
     */
    provider: CloudflareProviderConfig;

    /**
     * The password that is used to authenticate the update request.
     */
    authPassword: Variable;

    /**
     * The fully qualified domain names that should have their DNS records updated.
     * @example ['sub.example.com', 'domain.eu']
     */
    hosts?: Array<string> | null;

    /**
     * When true, any hostname specified in the request will be updated. Is combined with the
     * `hosts` property.
     * @default false
     */
    useHostsFromRequest?: boolean | null;
}

/**
 * Variables can either have their value set directly or the location of its value can be described.
 * @example {"var": "value"}
 * @example {"var": {"from": "Env", "name": "ENV_VAR"}}
 */
export type Variable<T = string> = T | {
    /**
     * Where to get the variable from.
     */
    from: 'Env';

    /**
     * The name of the variable.
     */
    name: string;
};
