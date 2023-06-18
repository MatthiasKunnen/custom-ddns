import type {ProvidersConfig} from 'ddns-providers';

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
     * The password that is used to authenticate the update request.
     */
    authPassword: Variable;

    /**
     * The providers. Multiple providers can be configured simultaneously.
     */
    providers: ProvidersConfig;
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
