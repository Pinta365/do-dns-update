# do-dns-update

Update a dns record through the DigitalOcean API.

Personally im using it to make sure that my gaming server that is sitting behind a dynamic IP got a working subdomain
pointing to it :)

## Installation

```bash
#For Deno
deno add @pinta365/do-dns-update

#For Bun
bunx jsr add @pinta365/do-dns-update

#For Node.js
npx jsr add @pinta365/do-dns-update
```

## Usage

As simple as it gets, this sets the IP of a record. Check out the return object format below the code example.

```javascript
import { RecordManager } from "@pinta365/do-dns-update";
const apiKey = "...."; // API key from Digital Ocean (https://cloud.digitalocean.com/account/api/)

// Instantiate with your API key.
const manager = new RecordManager(apiKey);

// Sets game.example.com to your current public IP
const updatedRecord = await manager.setIP("game", "example.com");
console.log(updatedRecord)
// Output: 
// {
//   success: true,                // true/false
//   record: "game.example.com",   // affected record
//   ip: "217.64.123.123",         // ip number
//   message: "Update successful"  // No update needed / Update successful
// }


// Or with an override IP of "123.123.123.123" instead of your current public IP
const updatedRecord = await manager.setIP("game", "example.com", "123.123.123.123");
console.log(updatedRecord)
// Output: 
// {
//   success: true,                // true/false
//   record: "game.example.com",   // affected record
//   ip: "123.123.123.123",        // ip number
//   message: "Update successful"  // No update needed / Update successful
// }
```


Interfaces for the return objects
```ts
//setIP()
interface IPSetResponse {    
    success: boolean;   // Indicates if the operation was successful.
    record: string;     // The record (subdomain+domain) affected by the operation.
    ip: string | null;  // The IP address set for the subdomain.
    message: string;    // Message detailing the outcome of the operation.
}



//setTTL()
interface TTLSetResponse {
    success: boolean;   // Indicates if the operation was successful.
    record: string;     // The record (subdomain+domain) affected by the operation.
    ttl: number;        // The time to live for the record, in seconds.
    message: string;    // Message detailing the outcome of the operation.
}
```

## Methods

**RecordManager Class**

`setIP`(subdomain: string, domain: string, ipOverride: string | null = null);

`setTTL`(subdomain: string, domain: string, ttl: number);