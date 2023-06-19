import {getProviders} from 'ddns-providers';

import {getVariable} from './config';
import type {Config, Variable} from './config.interface';
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

    const getVariableIntermediate = (variable: Variable) => {
        return getVariable(variable, env);
    };

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

        const providers = getProviders(c.providers);

        for (const {providerConfig, provider} of providers) {
            await provider.updateIp({
                config: providerConfig as any, // Validated so we can cast without issue
                getVariable: getVariableIntermediate,
                ip,
                ipVersion,
                requestHosts: requestHosts,
            });
        }
    }));
}
