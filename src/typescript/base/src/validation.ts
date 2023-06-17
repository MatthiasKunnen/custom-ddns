import isFQDN from 'validator/es/lib/isFQDN';
import isIp from 'validator/es/lib/isIP';

import {CustomError} from './custom-error';
import type {IpVersion} from './ip.interface';

export interface ValidateRequestParamsInput {
    ip: string;
    tags?: string | null;
    hosts?: string | null;
}

export interface ValidatedRequestParams {
    ip: string;
    ipVersion: IpVersion;
    tags: Array<string>;
    hosts: Array<string>;
}

export function validateRequestParams(input: ValidateRequestParamsInput): ValidatedRequestParams {
    const isIpv4 = isIp(input.ip, 4);
    const isIpv6 = isIp(input.ip, 6);

    if (!isIpv4 && !isIpv6) {
        throw new CustomError({
            status: 422,
            message: `ip ${input.ip} is not a valid IPv4 or IPv6 address`,
            info: {
                ip: input.ip,
            },
        });
    }

    const hosts = input.hosts?.split(',') ?? [];

    for (const host of hosts) {
        if (!isFQDN(host)) {
            throw new CustomError({
                message: `Host ${host} is not a valid FQDN`,
                status: 422,
                info: {
                    host,
                },
            });
        }
    }

    return {
        ip: input.ip,
        ipVersion: isIpv4 ? 'IPv4' : 'IPv6',
        hosts: hosts,
        tags: input.tags?.split(',') ?? [],
    };
}
