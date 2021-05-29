'use strict';

var Main = require('./main.js');

class Domain extends Main {

    constructor(bearer) {
        super();
        this.bearer = bearer;
        this.host = 'api.digitalocean.com';
    }

    listRecords(domain) {
        try {

            let options = {
                method: 'GET',
                hostname: this.host,
                path: `/v2/domains/${domain}/records`,
                headers: {
                    'Authorization': `Bearer ${this.bearer}`,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                }
            };

            return super.makeRequest(options);
        }
        catch (err) {
            throw (err);
        }


    }

    updateRecord(domain, id, putData) {
        try {
            let options = {
                method: 'PUT',
                hostname: this.host,
                path: `/v2/domains/${domain}/records/${id}`,
                headers: {
                    'Authorization': `Bearer ${this.bearer}`,
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'
                }
            };

            return super.makeRequest(options, putData);
        }
        catch (err) {
            throw (err);
        }

    }

    async getRecord(rec, dom) {
        try {
            let records = await this.listRecords(dom);
            let record = records.domain_records.find(record => record.name == rec);

            if (typeof record !== 'object') {
                throw `Record "${rec}" not found at the domain "${dom}"`;
            }
            else {
                return record;
            }

        }
        catch (err) {
            throw (err);
        }
    }

}

module.exports = Domain;