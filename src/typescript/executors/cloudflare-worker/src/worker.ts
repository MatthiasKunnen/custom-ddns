import {
    CustomError,
    getUsernameAndPasswordFromBasicAuth,
    parseConfig,
    updateIp,
    validateRequestParams,
} from 'ddns-base';

import configData from '../../../../../config.yaml';

type Env = Record<string, unknown>;

const config = parseConfig(configData);

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname !== '/update-ip') {
            return new Response('Not found', {
                status: 404,
            });
        }

        const ip = url.searchParams.get('ip');

        if (ip === null) {
            return new Response('ip query parameter absent', {status: 422});
        }

        const authorization = request.headers.get('Authorization');
        if (authorization === null) {
            return new Response(
                'Request must bear Authorization header with Basic auth',
                {
                    status: 401,
                    headers: {
                        'WWW-Authenticate': 'Basic',
                    },
                },
            );
        }

        try {
            const validated = validateRequestParams({
                ip,
                hosts: url.searchParams.get('hosts'),
                tags: url.searchParams.get('tags'),
            });

            await updateIp({
                config,
                env,
                ip: validated.ip,
                ipVersion: validated.ipVersion,
                providedPassword: getUsernameAndPasswordFromBasicAuth(authorization).password,
                requestHosts: validated.hosts,
                tags: validated.tags,
            });
            return new Response('OK');
        } catch (error) {
            if (error instanceof CustomError) {
                console.error(error, JSON.stringify(error, undefined, 4));
                return new Response(error.message, {
                    headers: {
                        'Content-Type': 'text/plain',
                        ...error.responseHeaders,
                    },
                    status: error.status ?? 500,
                });
            }

            console.error(error);
            return new Response('Failure', {status: 500});
        }
    },
};
