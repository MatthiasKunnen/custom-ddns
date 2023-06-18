import {CustomError} from 'ddns-base';
import * as punycode from 'punycode.js';

import type {Provider, UpdateIpInput} from '../provider.interface';

export class CloudflareProvider implements Provider {

    static readonly providerName = 'Cloudflare';

    async updateIp(input: UpdateIpInput): Promise<void> {
        const cloudflareApiToken = input.config.apiToken;
        if (cloudflareApiToken == null || typeof cloudflareApiToken !== 'string') {
            throw new Error('Cloudflare provider: apiToken not provided');
        }

        const proxied = input.config.proxied == null
            ? undefined
            : input.config.proxied === true || input.config.proxied === 'true';

        let ttl: number | undefined = Number(input.config.ttl);
        ttl = isNaN(ttl) ? undefined : ttl;

        const zoneId = input.config.zoneId;
        if (zoneId == null || typeof zoneId !== 'string') {
            throw new Error('Cloudflare provider: zoneId not provided');
        }

        const recordType = input.ipVersion === 'IPv4' ? 'A' : 'AAAA';
        const zoneName = await this.getZoneName(zoneId, cloudflareApiToken);

        await Promise.all(input.hosts.map(async host => {
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
                for (const record of listDnsRecordData.result) {
                    const patchDnsRecordResponse = await this.cloudflareRequest(
                        `client/v4/zones/${zoneId}/dns_records/${record.id}`,
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
                                recordId: record.id,
                                host: punyName,
                                ip: input.ip,
                                responseData: patchDnsRecordData,
                            },
                        });
                    }
                }
            }
        }));

        return Promise.resolve(undefined);
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
