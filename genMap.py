# Require imagemagick to be installed on the computer https://imagemagick.org/script/download.php

import subprocess
import os

worlds = [
    'amakna',
    'incarnam'
]

def normalizeListDir(path, exclude = True):
    array = os.listdir(path)
    array = list(filter(lambda x: not '.jpg' in x, array)) if exclude  else list(filter(lambda x: '.jpg' in x, array))
    array.sort()
    return array

print('Get map titles')
subprocess.run(["node", "getMapTiles"])

print('Generating columns from tiles')
for world in worlds:
    zoomList = normalizeListDir(f"./map/{world}/")
    for zoom in zoomList:
        listDir = normalizeListDir(f"./map/{world}/{zoom}/")
        for foldername in listDir:
            colPath = f"./map/{world}/{zoom}/{foldername}.jpg"
            if os.path.exists(colPath):
                os.remove(colPath)
            tilePath = []
            fileList = os.listdir(f"./map/{world}/{zoom}/{foldername}/")
            fileList.sort()
            for filename in fileList:
                tilePath.append(
                    f"./map/{world}/{zoom}/{foldername}/{filename}"
                )
            subprocess.check_call(
                f"magick {' '.join(tilePath)} -append {colPath}", shell=True)


print('Generating full map from columns')
for world in worlds:
    zoomList = normalizeListDir(f"./map/{world}/")
    for zoom in zoomList:
        listDir = normalizeListDir(f"./map/{world}/{zoom}/", False)
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
