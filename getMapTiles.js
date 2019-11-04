// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-1-1.jpg - 40x32
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.6-1.jpg - 24x20
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.4-1.jpg - 16x13
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.2-1.jpg - 8x7
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/gfx/maps/1-1-1.jpg

const fetch = require("node-fetch");
const fs = require("graceful-fs");

const worlds = [
  {
    label: "amakna",
    worldId: 1,
    zooms: [
      { label: "1", maxHorizontalTile: 40, maxVerticalTile: 32 },
      { label: "0.6", maxHorizontalTile: 24, maxVerticalTile: 20 },
      { label: "0.4", maxHorizontalTile: 16, maxVerticalTile: 13 },
      { label: "0.2", maxHorizontalTile: 8, maxVerticalTile: 7 }
    ]
  },
  {
    label: "incarnam",
    worldId: 2,
    zooms: [
      { label: "1", maxHorizontalTile: 20, maxVerticalTile: 12 },
      { label: "0.5", maxHorizontalTile: 10, maxVerticalTile: 6 },
      { label: "0.25", maxHorizontalTile: 5, maxVerticalTile: 3 }
    ]
  }
];

const promises = [];

const getMapTile = (world, zoom, col, path) => {
  return new Promise((resolve, reject) => {
    const filePath = `./map/${world.label}/${zoom.label}/${path.horizontal}/${path.vertical}.jpg`;
    const url = `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/gfx/maps/${world.worldId}-${zoom.label}-${col}.jpg`;
    fetch(url)
      .then(res => {
        const stream = fs.createWriteStream(filePath);
        const req = res.body.pipe(stream);
        req.on("finish", () => {
          console.log(filePath);
          resolve(filePath);
        });
      })
      .catch(res => {
        console.log(`${res} downloaded`);
        reject();
      });
  });
};

worlds.forEach(world => {
  world.zooms.forEach(zoom => {
    console.log(zoom.label);
    if (!fs.existsSync(`./map`)) fs.mkdirSync(`./map`);
    if (!fs.existsSync(`./map/${world.label}`))
      fs.mkdirSync(`./map/${world.label}`);
    if (!fs.existsSync(`./map/${world.label}/${zoom.label}`))
      fs.mkdirSync(`./map/${world.label}/${zoom.label}`);
    for (
      let horizontal = 1;
      horizontal < zoom.maxHorizontalTile + 1;
      horizontal++
    ) {
      let col = 1 * horizontal;
      const path = {
        horizontal: null,
        vertical: null
      };
      path.horizontal =
        10 > horizontal
          ? (horizontal = `00${horizontal}`)
          : 100 > horizontal && (horizontal = `0${horizontal}`);
      for (let vertical = 1; vertical < zoom.maxVerticalTile + 1; vertical++) {
        path.vertical =
          10 > vertical
            ? (vertical = `00${vertical}`)
            : 100 > vertical && (vertical = `0${vertical}`);
        if (
          !fs.existsSync(
            `./map/${world.label}/${zoom.label}/${path.horizontal}`
          )
        ) {
          fs.mkdirSync(`./map/${world.label}/${zoom.label}/${path.horizontal}`);
        }
        promises.push(getMapTile(world, zoom, col, path));
        col = col + zoom.maxHorizontalTile;
      }
    }
  });
});

Promise.all(promises).then(() =>
  console.log("All map tile have been downloaded")
);
