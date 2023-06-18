import type {
    RequestInfo as NodeFetchRequestInfo,
    RequestInit as NodeFetchRequestInit,
    Response as NodeFetchResponse,
} from 'node-fetch';

declare global {
    export type RequestInfo = NodeFetchRequestInfo;
    export type RequestInit = NodeFetchRequestInit;
    export type Response = NodeFetchResponse;

    function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
