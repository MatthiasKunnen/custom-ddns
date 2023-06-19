# Cloudflare provider

## Requirements
- Zone ID of the zone you want to change the DNS records of
- API token, generate one at https://dash.cloudflare.com/profile/api-tokens with `DNS:Edit` scope

## Provider config
The following provider specific config is available.

`apiToken` Var(string) **required**  
An API token that has `DNS:edit` permissions for the zone.

`zoneId` Var(string) **required**  
The ID of your Cloudflare zone. See <https://www.cloudflare.com/en-gb/learning/dns/glossary/dns-zone/>.

`hosts` Array  
Either a list of domain names or a list of objects with the `name`, `proxied`, and `ttl` properties.

`hosts.name` string  
The Fully Qualified Domain Name to update the DNS record of.

`hosts.proxied` boolean  
Whether to enable Cloudflare proxy for the DNS records. If not specified, update will not overwrite the existing proxy setting and create will use the Cloudflare default.

`hosts.ttl` number  
The TTL of the DNS records. If not specified, update will not overwrite the existing TTL and create will use the Cloudflare _Auto_ setting.

`useHostsFromRequest` boolean  
When `true`, any hostname specified in the request will be updated. The hostnames specified in
the request are combined with the `hosts` property.

### Example
Minimal config:
```yaml
cloudflare:
  apiToken:
    from: Env
    name: CLOUDFLARE_API_TOKEN
  zoneId: 0eb4e056cd3ad6653d4635e1aa208992
  hosts:
    - example.com
    - name: example.com
      ttl: 60
      proxied: false
  useHostsFromRequest: true
```
