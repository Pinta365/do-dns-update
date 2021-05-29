'use strict';

var Main = require('./main.js');

class Network extends Main {

    constructor() {
        super();
    }

    async getPublicIP() {
        try {
            let options = {
                method: 'GET',
                hostname: 'ipinfo.io',
                path: '/json',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            };

            let result = JSON.parse(await super.makeRequest(options));
            if (result.ip) {
                return result.ip;
            }
            else {

                throw `Unexpected response from host that resolves external IP`;
            }

        }
        catch (err) {
            throw err;
        }


    }
}

module.exports = Network;
