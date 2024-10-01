import {Provider, UpdateIpInput} from '../provider.interface';
import {WixProviderConfig} from './config.interface';

export class WixProvider implements Provider {

    constructor(
        private readonly config: WixProviderConfig,
    ) {
    }

    async updateIp(input: UpdateIpInput): Promise<void> {
    }

    assertValidConfig(){

    }
}
