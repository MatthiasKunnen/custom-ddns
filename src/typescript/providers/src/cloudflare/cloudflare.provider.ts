import {CustomError} from 'ddns-base';
import * as punycode from 'punycode.js';

import type {Provider, UpdateIpInput} from '../provider.interface';
import type {CloudflareProviderConfig} from './config.interface';

export class CloudflareProvider implements Provider {

    static readonly providerName = 'cloudflare';

    async updateIp(input: UpdateIpInput): Promise<void> {
        // Cast is allowed because it should have been validated
        const config = input.config as unknown as CloudflareProviderConfig;
        const cloudflareApiToken = input.getVariable(config.apiToken);
        if (cloudflareApiToken == null) {
            throw new Error('Cloudflare provider: apiToken not provided');
        }

        const zoneId = input.getVariable(config.zoneId);
        if (zoneId == null) {
            throw new Error('Cloudflare provider: zoneId not provided');
        }

        const recordType = input.ipVersion === 'IPv4' ? 'A' : 'AAAA';
        const zoneName = await this.getZoneName(zoneId, cloudflareApiToken);

        const hosts = Array.from(new Set([
            ...config.hosts ?? [],
            ...config.useHostsFromRequest === true ? input.requestHosts : [],
        ]));

        await Promise.all(hosts.map(async hostConfig => {
            let host: string;
            let ttl: number | undefined;
            let proxied: boolean | undefined;

            if (typeof hostConfig === 'string') {
                host = hostConfig;
            } else {
                host = hostConfig.name;
                ttl = hostConfig.ttl ?? undefined;
                proxied = hostConfig.proxied ?? undefined;
            }

            if (host !== zoneName && !host.endsWith(`.${zoneName}`)) {
                throw new CustomError({
                    message: `Cloudflare provider: host ${host} should end in ${zoneName}`,
                });
            }

            const punyName = host
                .split('.')
                .map(part => punycode.toASCII(part))
                .join('.');
            const domainName = host === zoneName ? '@' : punyName;

            const searchQueryParams = new URLSearchParams();
            searchQueryParams.set('name', punyName);
            searchQueryParams.set('type', recordType);
            const listDnsRecordResponse = await this.cloudflareRequest(
                `client/v4/zones/${zoneId}/dns_records?${searchQueryParams.toString()}`,
                cloudflareApiToken,
            );
            const listDnsRecordData: any = await listDnsRecordResponse.json();

            if (listDnsRecordData.success !== true) {
                throw new CustomError({
                    message: 'Cloudflare provider: Failed to list dns records',
                    info: {
                        zoneId,
                        host: punyName,
                        responseData: listDnsRecordData,
                    },
                });
            }

            if (listDnsRecordData.result.length === 0) {
                const createDnsRecordResponse = await this.cloudflareRequest(
                    `client/v4/zones/${zoneId}/dns_records`,
                    cloudflareApiToken,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            content: input.ip,
                            name: domainName,
                            proxied: proxied,
                            ttl: ttl ?? 1,
                            type: recordType,
                        }),
                    },
                );
                const createDnsRecordData: any = await createDnsRecordResponse.json();
                if (createDnsRecordData.success !== true) {
                    throw new CustomError({
                        message: 'Cloudflare provider: Failed to create DNS record',
                        info: {
                            host: domainName,
                            ip: input.ip,
                            proxied,
                            responseData: createDnsRecordData,
                            zoneId,
                        },
                    });
                }
            } else {
                for (let i = 1; i < listDnsRecordData.result.length; i++) {
                    // Delete DNS records that could cause a duplicate DNS record
                    await this.cloudflareRequest(
                        `client/v4/zones/${zoneId}/dns_records/${listDnsRecordData.result[i].id}`,
                        cloudflareApiToken,
                        {
                            method: 'DELETE',
                        },
                    );
                }

                const recordToUpdateId = listDnsRecordData.result[0].id;
                const patchDnsRecordResponse = await this.cloudflareRequest(
                    `client/v4/zones/${zoneId}/dns_records/${recordToUpdateId}`,
                    cloudflareApiToken,
                    {
                        method: 'PATCH',
                        body: JSON.stringify({
                            content: input.ip,
                            proxied,
                            ttl: ttl,
                        }),
                    },
                );
                const patchDnsRecordData: any = await patchDnsRecordResponse.json();
                if (patchDnsRecordData.success !== true) {
                    throw new CustomError({
                        message: 'Cloudflare provider: Failed to patch DNS record',
                        info: {
                            zoneId,
                            recordId: recordToUpdateId,
                            host: punyName,
                            ip: input.ip,
                            responseData: patchDnsRecordData,
                        },
                    });
                }
            }
        }));
    }

    private async getZoneName(zoneId: string, cloudflareApiToken: string): Promise<string> {
        const zoneDetailsResponse = await this.cloudflareRequest(
            `client/v4/zones/${zoneId}`,
            cloudflareApiToken,
        );
        const zoneDetailData: any = await zoneDetailsResponse.json();

        if (zoneDetailData.success !== true) {
            throw new CustomError({
                message: 'Cloudflare provider: Failed to fetch zone info',
                info: {
                    zoneId,
                    responseData: zoneDetailData,
                },
            });
        }

        return zoneDetailData.result.name;
    }

    private async cloudflareRequest(
        url: string,
        apiKey: string,
        options?: RequestInit,
    ): Promise<Response> {
        return fetch(`https://api.cloudflare.com/${url}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
    }
}
