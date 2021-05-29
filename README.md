# do-dns-update

Update a dns record through the DigitalOcean API. 

Personally im using it to make sure that my gaming server that is sitting behind a dynamic IP got a working subdomain pointing to it :) 

## Installation
> npm install do-dns-update

## Example code

As simple as it gets, you won't really know if the change went through or not. Check out the return object below the example code.
```javascript

const api_key = 'bd17aec......ec8'; // API key from Digital Ocean (https://cloud.digitalocean.com/account/api/)
const Updater = require('do-dns-update');

(async () => {

    try {
        const updater = new Updater(api_key);
        await updater.setIP('game', 'example.com'); //Sets the ip of game.example.com to your currently external resolved IP.

    } catch (error) {
        console.log(error);
    }

})();

```

setIP() returns an object that you can access to figure out if the change went through or not.
```
{
  success: true/false
  subdomain: affected subdomain with domain.
  ip: the ip that got set
  message: short message, could be that an update was done, failed or didnt run because it is already pointing to the same ip.
}
```

## Available methods
### setIP(subdomain, domain, ip=null, debug=false)
```
Sets the IP for a specific subdomain, will default to resolving your current external IP if none is supplied.
(using ipinfo.io as resolver).
@param {string}     subdomain       - The record/subdomain we want to set IP on.
@param {string}     domain          - The domain we want to set IP on.
@param {string}     [ip=null]       - Optional IP to set if you what to use a specific IP and not your current external IP.
@param {boolean}    [debug=false]   - Optional boolean to display some console logs.
```