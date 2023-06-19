import type {ErrorObject} from 'ajv';
import {getProviders} from 'ddns-providers';
import * as yaml from 'js-yaml';
import isFQDN from 'validator/es/lib/isFQDN';

import {DdnsConfig} from '../../../../config.schema.validate';
import type {Config, Variable} from './config.interface';
import {CustomError} from './custom-error';

export function parseConfig(configString: string): Config {
    const config = yaml.load(configString);

    const validate: typeof DdnsConfig & {errors?: Array<ErrorObject>} = DdnsConfig;
    const valid = validate(config);

    if (!valid) {
        let errorMessage = '';
        if (validate.errors !== undefined && validate.errors.length > 0) {
            errorMessage = `${validate.errors[0].message} at ${validate.errors[0].instancePath}`;
        }

        throw new CustomError({
            message: `Failed to validate DDNS config. ${errorMessage}`,
            info: {
                validationErrors: validate.errors,
                config: config,
            },
        });
    }

    const validatedConfig = config as Config;

    let configIndex = 0;
    for (const item of validatedConfig.configs) {
        for (const {providerConfig, providerName} of getProviders(item.providers)) {
            for (const hostConfig of providerConfig.hosts ?? []) {
                const host = typeof hostConfig === 'string' ? hostConfig : hostConfig.name;
                if (!isFQDN(host)) {
                    throw new CustomError({
                        message: `Host ${host} in config[${configIndex}].${providerName} `
                            + `is not a valid FQDN`,
                        info: {
                            config: item,
                            host,
                        },
                    });
                }
            }
        }
        configIndex++;
    }

    return validatedConfig;
}

export function getVariable(
    variable: Variable | null | undefined,
    env: Record<string, unknown>,
): string | null | undefined {
    if (variable == null || typeof variable !== 'object') {
        return variable;
    }

    if (variable.from as string === 'Env') {
        if (variable.name in env) {
            const value = env[variable.name];
            return typeof value === 'string' ? value : undefined;
        }
    }
}
