@echo off
echo Get map tiles
node getMapTiles 1
echo Generate columns from tiles
for /D %%x in (./map/amakna/1/*) do magick ./map/amakna/1/%%x/*.jpg -append ./map/amakna/1/%%x.jpg
echo Generate full map from columns
magick ./map/amakna/1/*.jpg +append ./map/amakna/amakna.jpg
rmdir /S /Q "map/amakna/1"
echo Generate leaflet compatible tiles from map
@echo on
node convertImageToTile
echo Done