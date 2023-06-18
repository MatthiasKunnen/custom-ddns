import {CloudflareProvider} from './cloudflare/cloudflare.provider';
import type {Provider, ProviderConfigs, ProvidersConfig} from './provider.interface';

export interface GetProvidersItem {
    provider: Provider;
    providerName: keyof ProvidersConfig;
    providerConfig: ProviderConfigs;
}

export function getProviders(
    providers: ProvidersConfig,
): Array<GetProvidersItem> {
    return Object.entries(providers).reduce<Array<GetProvidersItem>>((acc, [name, config]) => {
        switch (name) {
            case CloudflareProvider.providerName:
                acc.push({
                    provider: new CloudflareProvider(),
                    providerConfig: config,
                    providerName: name,
                });
                break;
        }

        return acc;
    }, []);
}
