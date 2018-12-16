// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-1-1.jpg - 40x32
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.6-1.jpg - 24x20
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.4-1.jpg - 16x13
// https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-0.2-1.jpg - 8x7

const req = require('request');
const fs = require('fs');
const zoom = {
  1: { maxHorizontalTile: 40, maxVerticalTile: 32 },
  0.6: { maxHorizontalTile: 24, maxVerticalTile: 20 },
  0.4: { maxHorizontalTile: 16, maxVerticalTile: 13 },
  0.2: { maxHorizontalTile: 8, maxVerticalTile: 7 }
};
const path = {};

if (!fs.existsSync(`./map/amakna/${process.argv[2]}`)) {
  fs.mkdirSync(`./map/amakna/${process.argv[2]}`);
}
for (let horizontal = 1; horizontal < zoom[process.argv[2]].maxHorizontalTile + 1; horizontal++) {
  let col = 1 * horizontal;
  path.horizontal = 10 > horizontal ? (horizontal = `00${horizontal}`) : 100 > horizontal && (horizontal = `0${horizontal}`);
  for (let vertical = 1; vertical <  zoom[process.argv[2]].maxVerticalTile + 1; vertical++) {
    path.vertical = 10 > vertical ? (vertical = `00${vertical}`) : 100 > vertical && (vertical = `0${vertical}`);
    if (!fs.existsSync(`./map/amakna/${process.argv[2]}/${path.horizontal}`)) {
      fs.mkdirSync(`./map/amakna/${process.argv[2]}/${path.horizontal}`);
    }
    req(`https://ankama.akamaized.net/games/dofus-tablette/assets/2.24.6/gfx/maps/1-${process.argv[2]}-${col}.jpg`, { method: 'GET' }).pipe(
      fs.createWriteStream(`./map/amakna/${process.argv[2]}/${path.horizontal}/${path.vertical}.jpg`)
    );
    col = col + zoom[process.argv[2]].maxHorizontalTile;
  }
}
