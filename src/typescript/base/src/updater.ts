import {getProviderByName} from 'ddns-providers/src/providers';

import {getVariable} from './config';
import type {Config} from './config.interface';
import {CustomError} from './custom-error';
import type {IpVersion} from './ip.interface';

interface UpdateIpInput {
    config: Config;
    env: Record<string, unknown>;
    requestHosts: Array<string>;
    ip: string;
    ipVersion: IpVersion;
    providedPassword: string;
    tags: Array<string>;
}

/**
 * Performs auth and executes an IP update for all matching configs.
 */
export async function updateIp(
    {
        config,
        env,
        requestHosts,
        ip,
        ipVersion,
        providedPassword,
        tags,
    }: UpdateIpInput,
) {
    const configs = config.configs.filter(c => {
        return tags.length === 0
            ? c.tag == null
            : c.tag != null && tags.includes(c.tag);
    });

    await Promise.all(configs.map(async c => {
        if (getVariable(c.authPassword, env) !== providedPassword) {
            throw new CustomError({
                message: 'Provided credentials do not match',
                status: 401,
                responseHeaders: {
                    'WWW-Authenticate': 'Basic',
                },
            });
        }

        const provider = getProviderByName(c.provider.name);

        if (provider === undefined) {
            throw new CustomError({
                message: `Unknown provider ${c.provider.name}`,
            });
        }

        const providerConfig = Object.entries(c.provider.config)
            .reduce<Record<string, unknown>>((acc, [key, value]) => {
                acc[key] = getVariable(value, env);

                return acc;
            }, {});

        await provider.updateIp({
            config: providerConfig,
            hosts: Array.from(new Set([
                ...c.useHostsFromRequest === true ? requestHosts : [],
                ...c.hosts ?? [],
            ])),
            ip,
            ipVersion,
        });
    }));
}
