import {CloudflareProvider} from './cloudflare/cloudflare.provider';
import type {Provider} from './provider.interface';

export function getProviderByName(providerName: string): Provider | undefined {
    switch (providerName) {
        case CloudflareProvider.providerName:
            return new CloudflareProvider();
    }
}
