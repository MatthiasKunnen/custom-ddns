import {decode as base64Decode} from 'js-base64';

import {CustomError} from './custom-error';

export function getUsernameAndPasswordFromBasicAuth(
    header: string,
): {username: string; password: string} {
    if (!header.startsWith('Basic')) {
        throw new CustomError({
            message: 'Authorization header is not a valid Basic auth header',
            status: 401,
            responseHeaders: {
                'WWW-Authenticate': 'Basic',
            },
        });
    }

    const auth = base64Decode(header.split(' ')[1]);
    const separatorIndex = auth.indexOf(':');

    if (separatorIndex < 0) {
        throw new CustomError({
            message: 'Authorization header is not a valid Basic auth header',
            status: 401,
            responseHeaders: {
                'WWW-Authenticate': 'Basic',
            },
        });
    }

    return {
        username: auth.substring(0, separatorIndex),
        password: auth.substring(separatorIndex + 1),
    };
}
