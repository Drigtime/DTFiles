const fs = require('graceful-fs');
const request = require('request')

const D2O = JSON.parse(fs.readFileSync('./D2O/Maps.json'))

Object.keys(D2O).forEach(map => {
    fs.exists(`./D2P/${map}.json`, (exists) => {
        if (!exists) {
            request({
                method: 'GET',
                url: `https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/maps/${map}.json`,
                Headers: {
                    "Content-Type": "application/json"
                }
            }, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    fs.writeFile(`./D2P/${map}.json`, body, () => {
                        console.log(`${map}`);
                    });
                }
            });
        } else {
            console.log(`${map}`);
        }
    })
})