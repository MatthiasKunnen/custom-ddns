interface CustomErrorInput {
    info?: Record<string, unknown>;
    message: string;
    originalError?: unknown;
    responseHeaders?: Record<string, string>;
    status?: number;
}

export class CustomError extends Error {

    info?: Record<string, unknown>;
    originalError?: unknown;
    responseHeaders?: Record<string, string>;
    status?: number;

    constructor(input: CustomErrorInput) {
        super(input.message);

        if (input.info !== undefined) {
            this.info = input.info;
        }

        if (input.originalError !== undefined) {
            this.originalError = input.originalError;
        }

        if (input.responseHeaders !== undefined) {
            this.responseHeaders = input.responseHeaders;
        }

        if (input.status !== undefined) {
            this.status = input.status;
        }
    }
}
