# Unifi DDNS configuration and internal workings
Unifi uses [inadyn](https://github.com/troglobit/inadyn) to perform DDNS. See config man page: <https://man.troglobit.com/man5/inadyn.conf.5.html>.

## Configuring unifi DDNS
![Unifi DDNS settings](assets/unifi-ddns-settings.png)

On every configuration change, an update will be sent unless the current IP has already been sent for that hostname. This means that editing the hostname setting to a previously unused hostname is an easy way to force an update request.  Inadyn cache can be found and deleted in `/var/cache/inadyn/`.

### Service
Working:
- afraid
- dnspark
- dyndns

Not working:
- namecheap

### Hostname
Mapped to [Inadyn hostname](https://man.troglobit.com/man5/inadyn.conf.5.html#hostname_=_HOSTNAME). Changing this setting to a previously unused value will force trigger a DDNS update. 

### Username
Mapped to [Inadyn username](https://man.troglobit.com/man5/inadyn.conf.5.html#username_=_USERNAME.). Username used in basic auth in request to server. Not used by _Custom DDNS_.

### Password
Mapped to [Inadyn password](https://man.troglobit.com/man5/inadyn.conf.5.html#password_=_PASSWORD.). Password used in basic auth in request to server.

### Server
Entering a value here will make Unifi configure the provider as custom. Otherwise, it will use `provider dyndns`.

URL starting from hostname that the DDNS notification request will be sent to. URL parts are assigned as follows:
- host -> [ddns-server](https://man.troglobit.com/man5/inadyn.conf.5.html#ddns-server_=_update.example.com)
- path -> [ddns-path](https://man.troglobit.com/man5/inadyn.conf.5.html#ddns-path_=_/update?domain=)  
  Here, tokens can be used to include the ip and hostname in the URL. If no tokens are used, the value of _hostname_ is appended to the URL.

Example: `domain.tld/update?wan=wan-name&ip=%i`

## Inadyn expected responses
The following responses must be returned for the request to be considered successful:
- `good`
- `OK`
- `true`
- `updated`
- `nochg`
