# Require imagemagick to be installed on the computer https://imagemagick.org/script/download.php

import subprocess
import os

worlds = [
    'amakna',
    'incarnam'
]

print('Get map titles')
subprocess.run(["node", "getMapTiles"])

print('Generating columns from tiles')
for world in worlds:
    for zoom in os.listdir(f"./map/{world}/"):
        listDir = os.listdir(f"./map/{world}/{zoom}/")
        listDir = filter(lambda x: not '.jpg' in x, listDir)
        for foldername in listDir:
            colPath = f"./map/{world}/{zoom}/{foldername}.jpg"
            if os.path.exists(colPath):
                os.remove(colPath)
            tilePath = []
            for filename in os.listdir(f"./map/{world}/{zoom}/{foldername}/"):
                tilePath.append(
                    f"./map/{world}/{zoom}/{foldername}/{filename}"
                )
            subprocess.check_call(
                f"magick {' '.join(tilePath)} -append {colPath}", shell=True)


print('Generating full map from columns')
for world in worlds:
    for zoom in os.listdir(f"./map/{world}/"):
        listDir = os.listdir(f"./map/{world}/{zoom}/")
        listDir = filter(lambda x: '.jpg' in x, listDir)
        fullMapPath = f"./map/{world}/full.jpg"
        if os.path.exists(fullMapPath):
            os.remove(fullMapPath)
        colPath = []
        for colName in listDir:
            colPath.append(
                f"./map/{world}/{zoom}/{colName}"
            )
        subprocess.check_call(
            f"magick {' '.join(colPath)} +append {fullMapPath}", shell=True)

print('Generating leaflet compatible tiles from map')
subprocess.run(["node", "convertImageToTile"])

print('Generation of the map is done')
exit(1)
