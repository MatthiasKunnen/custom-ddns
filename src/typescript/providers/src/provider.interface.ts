import type {IpVersion} from 'ddns-base';

export interface UpdateIpInput {
    config: Record<string, unknown>;
    hosts: Array<string>;
    ip: string;
    ipVersion: IpVersion;
}

export interface Provider {
    updateIp: (input: UpdateIpInput) => Promise<void>;
}
