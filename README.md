[![License: AGPL-3.0-or-later](https://img.shields.io/github/license/MatthiasKunnen/custom-ddns?style=for-the-badge)](./LICENSE.txt)

# Custom DDNS

Keep your A (IPv4) and AAAA (IPv6) records in sync with the public IP of your router. Useful in the following cases:
- Your router has DDNS functionality but does not support your DNS provider.
- You do not want your router to have unlimited write access to your DNS records. I.e. you only need DDNS for certain subdomains, and you would be negatively impacted if any other records were created or modified.
- Your router supports DDNS and you want to update multiple DNS records across different domains and DNS providers.
- Your router does not have DDNS support, but you can implement a simple version yourself and want to do the heavier lifting on another system.

## Implementation
The following flow occurs on every IP update:  
`router -(notifies)> executor -(updates)> DNS provider`

The _router_, e.g. Unifi Dream Machine, must be configured to send a request to the _Executor_ with the new IP.

The _executor_ processes the new IP and updates the DNS records. 

The _DNS provider_, e.g. Cloudflare, provides an API that allows for updating the DNS records.

The reason behind this setup is to:
- Not store any API token on the router, this prevents the router from creating arbitrary DNS records (security consideration)
- Be able to support any DNS provider with an API using a single configuration file

### Routers
In theory, any router that supports a DDNS client can work. Some clients are explicitly tested and supported.

Follow these links to read how to configure the routers:
- [Unifi Dream Machine (UDM)](./routers/unifi-udm)

### Executors
Executors implement a public web server that takes requests from the routers. An executor is small and language/platform specific. Examples of platforms are Docker and Cloudflare Workers. The executor performs authentication and updates the DNS records using the configured [providers](#providers). 

Currently supported (platform/language):
- [Cloudflare Worker/TypeScript](./src/typescript/executors/cloudflare-worker)

### Providers
Providers are executed by the _Executors_ and contain the DNS provider specific code for updating the DNS records.

Currently supported (DNS provider/language):
- [Cloudflare/TypeScript](./src/typescript/providers/src/cloudflare) 

## Configuration and usage
Follow these steps:
1. Based on your DNS provider, read the [provider specific documentation](#providers).
1. Copy the [`config.example.yaml`](./config.example.yaml) to `config.yaml` and change it to meet your needs.  
   [Visualize `config.yaml` spec](https://json-schema.app/view/%23%2Fdefinitions%2FConfig?url=https%3A%2F%2Fraw.githubusercontent.com%2FMatthiasKunnen%2Fcustom-ddns%2Fmaster%2Fconfig.schema.json) or view the [JSON schema](./config.schema.json).
1. Verify your config by running `yarn run validate-config`
1. Choose an [executor](#executors) and follow the deployment instructions.
1. Configure your router to send the update request to the executor.

### Configuration spec
The source of truth for the `config.yaml` schema is the TypeScript [Config interface](./src/typescript/base/src/config.interface.ts). From this interface, the JSON schema [`config.schema.json`](./config.schema.json) is generated using `yarn run update-config-schema`.

Visualize the schema of the config file on [json-schema.org](https://json-schema.app/view/%23%2Fdefinitions%2FConfig?url=https%3A%2F%2Fraw.githubusercontent.com%2FMatthiasKunnen%2Fcustom-ddns%2Fmaster%2Fconfig.schema.json).
