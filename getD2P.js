const axios = require("axios").default;
const fse = require("fs-extra");
const https = require("https");
const D2O = require("./D2O/MapPositions.json");

const D2OKeys = Object.keys(D2O);
let progress = 0;

https.globalAgent.maxSockets = 250;

axios
  .get("https://proxyconnection.touch.dofus.com/config.json?lang=fr")
  .then(async (res) => {
    const assetsUrl = res.data.assetsUrl;
    await Promise.all(
      D2OKeys.map(
        (map, index) =>
          new Promise(async (resolve) => {
            let D2P;
            try {
              D2P = await axios.get(`${assetsUrl}/maps/${map}.json`);
              await fse.outputJSON(`./D2P/${map}.json`, D2P.data);
              progress++;
              console.log(`${progress} / ${D2OKeys.length}`);
              resolve();
            } catch (error) {
              progress++;
              resolve();
            }
          })
      )
    );
  });
