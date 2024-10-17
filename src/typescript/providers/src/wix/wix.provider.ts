import {CustomError} from 'ddns-base';
import isFQDN from 'validator/es/lib/isFQDN';

import type {Provider, UpdateIpInput} from '../provider.interface';
import type {WixProviderConfig} from './config.interface';

export class WixProvider implements Provider {

    constructor(
        private readonly config: WixProviderConfig,
    ) {
    }

    async updateIp(input: UpdateIpInput): Promise<void> {
        const wixApiKey = input.getVariable(this.config.apiKey);
        if (wixApiKey == null) {
            throw new Error('Wix provider: apiKey not provided');
        }

        const wixAccountId = input.getVariable(this.config.accountId);
        if (wixAccountId == null) {
            throw new Error('Wix provider: accountId not provided');
        }

        const wixDnsZone = input.getVariable(this.config.dnsZone);
        if (wixDnsZone == null) {
            throw new Error('Wix provider: dnsZone not provided');
        }

        const recordType = input.ipVersion === 'IPv4' ? 'A' : 'AAAA';

        const hosts = Array.from(new Set([
            ...this.config.hosts ?? [],
            ...this.config.useHostsFromRequest === true ? input.requestHosts : [],
        ]));

        for (const wixHost of hosts) {
            const host = typeof wixHost === 'string' ? wixHost : wixHost.name;
            if (host !== wixDnsZone && !host.endsWith(`.${wixDnsZone}`)) {
                throw new CustomError({
                    message: `Wix provider: host ${host} should end in ${wixDnsZone}`,
                });
            }
        }

        // <https://dev.wix.com/docs/rest/account-level/domains/domain-dns/get-dns-zone>
        const getDnsZoneResponse = await this.wixRequest(
            `domains/v1/dns-zones/${wixDnsZone}`,
            wixApiKey,
            wixAccountId,
        );
        if (!getDnsZoneResponse.ok) {
            throw new CustomError({
                message: 'Wix provider: Failed to list dns records',
                info: {
                    zone: wixDnsZone,
                    responseData: await getDnsZoneResponse.json(),
                },
            });
        }

        const getDnsZoneResponseData: {dnsZone: WixDnsZone} = await getDnsZoneResponse.json();
        const dnsRecords = getDnsZoneResponseData.dnsZone.records
            .filter(record => record.type === recordType);

        const additions = new Array<WixDnsRecord>();
        const deletions = new Array<WixDnsRecord>();

        for (const wixHost of hosts) {
            const isWixAdvancedHost = typeof wixHost !== 'string';
            const host = isWixAdvancedHost ? wixHost.name : wixHost;
            const existingDnsRecord = dnsRecords.find(record => record.hostName === host);

            let newTtl: number | undefined;
            if (isWixAdvancedHost && wixHost.ttl != null) {
                newTtl = wixHost.ttl;
            } else if (existingDnsRecord !== undefined) {
                newTtl = existingDnsRecord.ttl;
            }

            additions.push({
                hostName: host,
                ttl: newTtl,
                type: recordType,
                values: [input.ip],
            });
            if (existingDnsRecord !== undefined) {
                deletions.push({
                    hostName: host,
                    ttl: existingDnsRecord.ttl,
                    type: recordType,
                    values: existingDnsRecord.values,
                });
            }
        }

        // <https://dev.wix.com/docs/rest/account-level/domains/domain-dns/update-dns-zone>
        const updateDnsResponse = await this.wixRequest(
            `domains/v1/dns-zones/${wixDnsZone}`,
            wixApiKey,
            wixAccountId,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deletions: deletions,
                    additions: additions,
                }),
            },
        );
        if (!updateDnsResponse.ok) {
            throw new CustomError({
                message: 'Wix provider: Failed to patch DNS records',
                info: {
                    zone: wixDnsZone,
                    ip: input.ip,
                    responseData: await updateDnsResponse.json(),
                },
            });
        }
    }

    assertValidConfig() {
        for (const hostConfig of this.config.hosts ?? []) {
            const host = typeof hostConfig === 'string' ? hostConfig : hostConfig.name;
            if (!isFQDN(host)) {
                throw new CustomError({
                    message: `Host ${host} is not a valid FQDN`,
                    info: {
                        config: this.config,
                        host,
                    },
                });
            }
        }
    }

    private async wixRequest(
        url: string,
        apiKey: string,
        accountId: string,
        options?: RequestInit,
    ): Promise<Response> {
        return fetch(`https://www.wixapis.com/${url}`, {
            ...options,
            headers: {
                Authorization: apiKey,
                'wix-account-id': accountId,
                ...options?.headers,
            },
        });
    }
}

interface WixDnsZone {
    domainName: string;
    records: Array<WixDnsRecord>;
    id: string;
    dnssecEnabled: boolean;
    dnssecInfo?: {
        keyTag: number;
        digest: string;
    };
}

interface WixDnsRecord {
    hostName: string;
    ttl?: number;
    type: string;
    values: Array<string>;
}
