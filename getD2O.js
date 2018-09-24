const fs = require('graceful-fs');
const request = require('request')

request({
    method: 'POST',
    url: 'https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=1.35.2',
    Headers: {
        "Content-Type": "application/json"
    },
    form: {
        class: "MapPositions"
    }
}, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        fs.writeFileSync(`./D2O/Maps.json`, body);
    }
})