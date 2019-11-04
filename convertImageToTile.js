const imageMapTiles = require("image-map-tiles");

const worlds = ["amakna", "incarnam"];

const options = world => ({
  outputDir: `map/${world}/tiles`,
  zoom: 4,
  tileHeight: 256,
  tileWidth: 256
});

worlds.forEach(world => {
  imageMapTiles(`map/${world}/full.jpg`, options(world));
});
