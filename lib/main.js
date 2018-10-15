'use strict';

const https = require('https');

class Main { 

    constructor() {
            
    }    

    makeRequest(options, putData) {

        return new Promise((resolve, reject) => {

            let req = https.request(options, (res) => {
               
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('Error code=' + res.statusCode + ' '+ res.statusMessage));
                }
                
                let parts = [];
                
                res.on('data', (part) => {
                    parts.push(part);
                });
               
                res.on('end', () => {
                    try {
                        if (options.headers['Content-Type'] =='application/json') {
                            parts = JSON.parse(Buffer.concat(parts).toString());
                        }
                        else {
                            parts = Buffer.concat(parts).toString();    
                        }                        
                    } catch(err) {
                        reject(err);
                    } finally {
                        resolve(parts);
                    }
                    
                });
            });
           
            req.on('error', (err) => {
                reject(err);
            });

            if (options.method=='PUT' && putData) {
                req.write(JSON.stringify(putData));
            }                   
            
            req.end();
        });
    }

}

module.exports = Main;