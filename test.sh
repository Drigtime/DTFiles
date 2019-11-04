#!/bin/bash

echo Get map tiles
node getMapTiles 1
echo Generate columns from tiles

for foldername in ./map/amakna/1/*; do
	for filename in $foldername; do 
		echo "Append $filename in $foldername.jpg"
		magick "$filename" -append "$foldername".jpg
	done
done

echo Generate full map from columns

for filesname in ./map/amakna/1/*; do
	echo "Append $filesname.jpg to amakna.jpg"
	convert $filename +append ./map/amakna/amakna.jpg
done

rm -rf "map/amakna/1"
echo Generating leaflet compatible tiles from map
node convertImageToTile
echo Done
