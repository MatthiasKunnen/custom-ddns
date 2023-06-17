# Cloudflare provider

## Requirements
- Zone ID of the zone you want to change the DNS records of
- API token, generate one at https://dash.cloudflare.com/profile/api-tokens with `DNS:Edit` scope

## Provider config
The following provider specific config is available.

`name` **required**  
Must be `Cloudflare`.

`config.apiToken` Var(string) **required**  
An API token that has `DNS:edit` permissions for the zone.

`config.zoneId` Var(string) **required**  
The ID of your Cloudflare zone. See <https://www.cloudflare.com/en-gb/learning/dns/glossary/dns-zone/>.

`config.proxied` Var(boolean)   
Whether to enable Cloudflare proxy for the DNS records. If not specified, update will not overwrite the existing proxy setting and create will use the Cloudflare default.

`config.ttl` Var(number)  
The TTL of the DNS records. If not specified, update will not overwrite the existing TTL and create will use the Cloudflare _Auto_ setting.

### Example
Minimal config:
```yaml
configs:
  - provider:
      name: Cloudflare
      config:
        apiToken:
          from: Env
          name: CLOUDFLARE_API_TOKEN
        zoneId: your-zone-id
    authPassword:
      from: Env
      name: AUTH_PASSWORD
    hosts:
      - your.domain.com
      - domain.com
```
