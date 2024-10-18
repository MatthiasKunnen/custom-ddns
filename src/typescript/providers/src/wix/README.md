# Wix provider

***Experimental***, the wix API endpoints used are still in `Developer Preview`.

## Requirements

- Name of the zone you want to change the DNS records of.
- API key, generate one at <https://manage.wix.com/account/api-keys> with the `All account permissions > Manage Domains` scope.  
  Only the owner of the Wix _Site_ that is served on the domain can create an API Key with sufficient permissions. **Co-owners' API Keys will result in permission errors**, see [troubleshooting](#domain-is-not-permitted-to-target-account).
- Account ID of the account that created the API key, this can be found at <https://manage.wix.com/account/api-keys> when at least one API key is generated.

## Provider config

The following provider specific config is available.

`accountId` Var(string) **required**  
The account ID of the account that created the API key.

`apiKey` Var(string) **required**  
An API key that has `All account permissions > Manage Domains` permissions.

`dnsZone` Var(string) **required**  
The zone in which the DNS records will be updated.

`hosts` Array  
Either a list of domain names or a list of objects with the `name` and `ttl` properties.

`hosts.name` string  
The Fully Qualified Domain Name to update the DNS record of.

`hosts.ttl` number  
The TTL of the DNS record. If not specified, update will not overwrite the existing TTL and create will use the Wix default setting.

`useHostsFromRequest` boolean  
When `false` (default), only the hosts in the config will have their IP set.
This is more secure as the router will not be able to set arbitrary A and AAAA records.  
When `true`, any hostname specified in the request will be updated.
The hostnames specified in the request are combined with the hosts property.

### Example

Minimal config:

```yaml
wix:
  accountId:
    from: Env
    name: WIX_ACCOUNT_ID
  apiKey:
    from: Env
    name: WIX_API_KEY
  zone: example.com
  hosts:
    - foo.example.com
    - name: bar.example.com
      ttl: 60
```

## Troubleshooting

### Domain is not permitted to target account

> DOMAIN_NOT_PERMITTED, domain example.com is not permitted to target account

This error is most likely caused due to the use of an API Key with insufficient permissions.
Verify that you are using an API Key of the owner (not co-owner) of the Wix _Site_ which uses this domain.

More API error messages can be located in the [REST docs](https://dev.wix.com/docs/rest/account-level/domains/domain-dns/error-messages).
