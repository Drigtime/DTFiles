const axios = require("axios").default;
const fse = require("fs-extra");
const https = require("https");
const Path = require("path");

https.globalAgent.maxSockets = 250;

const worlds = [
  {
    label: "amakna",
    worldId: 1,
    zooms: [
      { label: "1", maxHorizontalTile: 40, maxVerticalTile: 32 },
      { label: "0.6", maxHorizontalTile: 24, maxVerticalTile: 20 },
      { label: "0.4", maxHorizontalTile: 16, maxVerticalTile: 13 },
      { label: "0.2", maxHorizontalTile: 8, maxVerticalTile: 7 },
    ],
  },
  {
    label: "incarnam",
    worldId: 2,
    zooms: [
      { label: "1", maxHorizontalTile: 20, maxVerticalTile: 12 },
      { label: "0.5", maxHorizontalTile: 10, maxVerticalTile: 6 },
      { label: "0.25", maxHorizontalTile: 5, maxVerticalTile: 3 },
    ],
  },
];

const promises = [];

function downloadImage(url, dirname, filename) {
  return new Promise(async (resolve, reject) => {
    const path = Path.resolve(__dirname, dirname, filename);
    try {
      await fse.stat(dirname);
    } catch (err) {
      await fse.mkdirp(dirname);
    }
    const writer = fse.createWriteStream(path);

    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      response.data.pipe(writer);

      writer.on("finish", resolve);
      writer.on("error", reject);
    } catch (err) {
      resolve();
    }
  });
}

axios
  .get("https://proxyconnection.touch.dofus.com/config.json?lang=fr")
  .then(async (res) => {
    const assetsUrl = res.data.assetsUrl;
    for (const world of worlds) {
      for (const zoom of world.zooms) {
        for (let x = 1; x < zoom.maxHorizontalTile; x++) {
          let col = 1 * x;
          const path = {
            horizontal: null,
            vertical: null,
          };
          path.horizontal = (x < 10 ? "00" : x < 100 && "0") + x;
          for (let y = 1; y < zoom.maxVerticalTile; y++) {
            path.vertical = (y < 10 ? "00" : y < 100 && "0") + y;
            promises.push(
              downloadImage(
                `${assetsUrl}/gfx/maps/${world.worldId}-${zoom.label}-${col}.jpg`,
                `./map/${world.label}/${zoom.label}/${path.horizontal}`,
                `${path.vertical}.jpg`
              )
            );
            col = col + zoom.maxHorizontalTile;
          }
        }
      }
    }
    await Promise.all(promises);
    console.log("All map tile have been downloaded");
  });
