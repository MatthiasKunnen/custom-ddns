# Wix provider

***Experimental***, the wix API endpoints used are still in `Developer Preview`.

## Requirements

- Name of the zone you want to change the DNS records of.
- API key, generate one at https://manage.wix.com/account/api-keys with the `All account permissions > Manage Domains` scope.  
  **Only an API key generated using the account of the owner of the site to which the domain is linked can manage DNS records.**
- Account ID of the account linked to the API key, this can be found at https://manage.wix.com/account/api-keys when at least one API key is generated.

## Provider config

The following provider specific config is available.

`accountId` Var(string) **required**  
The account ID of the account linked to the `apiKey`.

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
When `true`, any hostname specified in the request will be updated. The hostnames specified in
the request are combined with the `hosts` property.

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
    - example.com
    - name: example.com
      ttl: 60
  useHostsFromRequest: true
```
