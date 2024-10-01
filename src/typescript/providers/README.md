# TypeScript providers
A provider contains code specific to a DNS provider for updating DNS records.

## Creating a new provider
1. Create a new directory [src/provider-name](./src).
1. Create [src/provider-name/provider-name.provider.ts](./src) and create a `ProviderNameProvider`
   that implements `Provider`.
1. Create [src/provider-name/config.interface.ts](./src) and create a `ProviderNameConfig`
   that extends `ProviderBaseConfig`.
1. Add `providerName?: ProviderNameProviderConfig` to `ProvidersConfig` in
   [provider.interface.ts](./src/provider.interface.ts)
1. Write the provider specific code. 
1. Run `yarn run update-config-schema` in the root of the project.
