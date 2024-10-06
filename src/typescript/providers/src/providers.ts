import {CloudflareProvider} from './cloudflare/cloudflare.provider';
import type {Provider, ProvidersConfig} from './provider.interface';
import {WixProvider} from './wix/wix.provider';

/**
 * Add new providers here.
 * The config should also be added in {@link ProvidersConfig} using the exact same key.
 * The key as it appears here will be how the provider is configured in the config.yaml.
 */
const allProviders = {
    cloudflare: CloudflareProvider,
    wix: WixProvider,
} as const satisfies AllProviders;

type AllProviders<T = Required<ProvidersConfig>> = {
    [K in keyof T]: new (config: T[K]) => Provider;
};

function isKnownProvider(name: string): name is keyof typeof allProviders {
    return name in allProviders
}

export function getProvider(
    name: string,
    config: ProvidersConfig,
): Provider {
    if (!isKnownProvider(name)) {
        throw new Error(`Unknown provider "${name}"`);
    }

    const provider = allProviders[name];
    // "as any" is allowed because it has been validated using the JSON schema
    return new provider(config as any);
}
