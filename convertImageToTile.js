const imageMapTiles = require('image-map-tiles');

var options = {
    'outputDir': 'map/amakna/tiles',
    'zoom': 4,
    'tileHeight': 256,
    'tileWidth': 256
}

imageMapTiles('map/amakna/amakna.jpg', options );
