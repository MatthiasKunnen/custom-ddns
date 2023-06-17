interface CustomErrorInput {
    info?: Record<string, unknown>;
    message: string;
    responseHeaders?: Record<string, string>;
    status?: number;
}

export class CustomError extends Error {

    info?: Record<string, unknown>;
    responseHeaders?: Record<string, string>;
    status?: number;

    constructor(input: CustomErrorInput) {
        super(input.message);

        if (input.info !== undefined) {
            this.info = input.info;
        }

        if (input.responseHeaders !== undefined) {
            this.responseHeaders = input.responseHeaders;
        }

        if (input.status !== undefined) {
            this.status = input.status;
        }
    }
}
