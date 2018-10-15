'use strict';

const api = require('./lib');
const Domain = new api.domain(process.env.DO_API_KEY);
const Network = new api.network();

async function test(rec, dom){
    try {       
        let result = await Promise.all([
                            Domain.getRecord(rec, dom),
                            Network.getPublicIP()
                            ]);

        let record = result[0];
        let ip = result[1];

        console.log('External IP:', ip, ', Registered IP:', record.data);

        if(record.data == ip) {
            console.log('The same IP, no update.');
        }
        else {
            console.log('New IP, will update.');            
            let putData = {data: ip}
            let updateDomain = await Domain.updateRecord(dom, record.id, putData);

            if(updateDomain.domain_record.data == ip) {
                console.log('Update done.');
            }
            else {
                if(typeof updateDomain.domain_record !== 'object') {
                    console.log('Update could not be performed, no domain record object returned.');
                }
                else {
                    console.log('Update could not be performed,', updateDomain);
                }                
            }            
        }        
    }
    catch(err) {
        console.log(err);
    }
}

test('test', 'test.eu');