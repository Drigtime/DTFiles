const fs = require('graceful-fs');
const request = require('request')

const https = require('https');
https.globalAgent.maxSockets = 250;

const D2O = JSON.parse(fs.readFileSync('./D2O/MapPositions.json'))
const D2OKeys = Object.keys(D2O);

D2OKeys.forEach((map, index) => {
    // console.log(`Downloading ${map}.json`);
    
    fs.exists(`./D2P/${map}.json`, (exists) => {      
        if (!exists) {
            request({
                method: 'GET',
                url: `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/maps/${map}.json`,
                Headers: {
                    "Content-Type": "application/json"
                }
            }, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    fs.writeFile(`./D2P/${map}.json`, body, () => {
                        console.log(`${map} downloaded`);
                        console.log(`${index} / ${D2OKeys.length}`)
                    });
                }
            });
        } else {
            console.log(`${map} already exist`);
            console.log(`${index} / ${D2OKeys.length}`)
        }
    })
})
