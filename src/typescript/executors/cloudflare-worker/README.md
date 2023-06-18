# Cloudflare Worker Executor
An executor that runs on Cloudflare workers written in TypeScript.

## Deploy
1. Install [NodeJS](https://nodejs.org/en).
1. Enable corepack by running `corepack enable` or install yarn `1.22.15` in another way.
1. `yarn run login` and authorize wrangler to deploy the worker.
1. `yarn run deploy`, the output will show the URL of the published worker's route. This is the URL that you should use to configure the DDNS client on the router.
1. Set any environment variables that you used in your `config.yaml` using `yarn run wrangler secret put` followed by the environment variable name. E.g. `yarn run wrangler secret put AUTH_PASSWORD`.
