const Domain = require('./lib/domain.js');
const Network = require('./lib/network.js');

class Updater {

    constructor(key) {
        this.domain = new Domain(key);
        this.network = new Network();
    }
    /**
     * Sets the IP for a specific subdomain, will default to resolving your current external IP if none is supplied. (using ipinfo.io as resolver).
     * @param {string} subdomain - The record/subdomain we want to set IP on.
     * @param {string} domain - The domain we want to set IP on.
     * @param {string} [ip=null] - Optional IP to set if you do not want your current external IP.
     * @param {boolean} [debug=false] - Optional boolean to display some console logs.
     */
    async setIP(subdomain, domain, ip = null, debug = false) {

        const returnObject = {
            success: true,
            subdomain: `${subdomain}.${domain}`,
            ip: null,
            message: ''
        };

        //This should mean that we skipped the ip parameter but supplied the debug boolean.
        if (typeof ip === "boolean") {
            debug = ip
        }

        try {
            let record, recordIp;

            if (ip) {
                let result = await this.domain.getRecord(subdomain, domain);

                record = result;
                recordIp = ip;

                if (debug)
                    console.log(`Input IP: ${recordIp}, Registered IP: ${record.data}`)
            } else {
                let result = await Promise.all([
                    this.domain.getRecord(subdomain, domain),
                    this.network.getPublicIP()
                ]);

                record = result[0];
                recordIp = result[1];

                if (debug)
                    console.log(`External IP: ${recordIp}, Registered IP: ${record.data}`)
            }

            if (record.data == recordIp) {

                returnObject.message = `Same IP, no update needed.`;
                returnObject.ip = record.data;

                if (debug)
                    console.log(returnObject.message);
            }
            else {
                if (debug)
                    console.log(`New IP, will update.`);

                let putData = { data: recordIp }
                let updateDomain = await this.domain.updateRecord(domain, record.id, putData);

                if (updateDomain.domain_record.data == recordIp) {

                    returnObject.message = `Update done.`;
                    returnObject.ip = updateDomain.domain_record.data;

                    if (debug)
                        console.log(returnObject.message);
                }
                else {
                    returnObject.success = false;

                    if (typeof updateDomain.domain_record !== 'object') {

                        returnObject.message = `Update could not be performed, no domain record object returned.`;

                        if (debug)
                            console.log(returnObject.message);
                    }
                    else {
                        returnObject.message = `Update could not be performed, unknown error`;

                        if (debug)
                            console.log(returnObject.message, updateDomain);
                    }
                }
            }

            return returnObject;
        }
        catch (err) {
            returnObject.message = err;
            returnObject.success = false;
            return returnObject;
        }
    }
}

module.exports = Updater;