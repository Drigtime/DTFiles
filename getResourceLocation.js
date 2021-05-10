const Promise = require("bluebird");
const fse = require("fs-extra");
const mapPositions = require("./D2O/MapPositions.json");
const jobs = require("./resources/JobsResources.json");

/*
Je prend une map, 
je check tout les "look" si ca correspond a une *resource* 
et je met le resultat dans un tableau
*/

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

jobsWithLocation = Object.values(jobs).map((job) => {
  job.resources = job.resources.map(
    (resource) => (resource = { ...resource, locations: [] })
  );
  return job;
});

Promise.map(
  Object.values(mapPositions),
  (map) =>
    new Promise(async (resolve) => {
      try {
        const D2P = await fse.readJson(`./D2P/${map.id}.json`);

        for (const midgroundLayer of Object.values(D2P.midgroundLayer)) {
          for (const element of midgroundLayer) {
            if (element.look && element.x > 0 && element.y > 0) {
              for (const job of jobsWithLocation) {
                for (const resource of job.resources) {
                  if (element.look == resource.id) {
                    const index = findWithAttr(
                      resource.locations,
                      "mapId",
                      map.id
                    );
                    if (index !== -1) {
                      resource.locations[index].quantity += 1;
                    } else {
                      resource.locations.push({
                        mapId: map.id,
                        quantity: 1,
                      });
                    }
                  }
                }
              }
            }
          }
        }

        resolve();
      } catch (err) {
        // console.error(err);
        resolve();
      }
    }),
  { concurrency: 50 }
)
  .then((result) => {
    console.log(jobsWithLocation);
  })
  .catch((err) => {
    // console.error(err);
  });

// Object.keys(elementLooks).forEach((prop) => {
//   if (!fs.existsSync(`./resources/${prop}`))
//     fs.mkdirSync(`./resources/${prop}`);
//   Object.keys(elementLooks[prop]).forEach((element) => {
//     if (!fs.existsSync(`./resources/${prop}/${element}.json`))
//       fs.writeFileSync(`./resources/${prop}/${element}.json`, "");
//     let container = [];
//     Object.values(D2O).forEach((map) => {
//       let mapJson;
//       if (fs.existsSync(`./D2P/${map.id}.json`))
//         mapJson = JSON.parse(fs.readFileSync(`./D2P/${map.id}.json`));
//       else return;
//       let quant = 0;
//       Object.values(mapJson.midgroundLayer).forEach((cell) => {
//         if (Array.isArray(cell)) {
//           cell.forEach((elementOnCell) => {
//             if (elementOnCell.look) {
//               if (
//                 elementOnCell.look == elementLooks[prop][element] &&
//                 elementOnCell.x > 0 &&
//                 elementOnCell.y > 0
//               ) {
//                 quant += 1;
//               }
//             }
//           });
//         }
//       });
//       let areadyExist = checkIfAlreadyExist(map.posX, map.posY, container);
//       if (quant > 0) {
//         if (areadyExist) {
//           container[areadyExist].q += quant;
//         } else {
//           container.push({
//             posX: map.posX,
//             posY: map.posY,
//             q: quant,
//             w: map.worldMap,
//           });
//         }
//       }
//     });
//     fs.writeFileSync(
//       `./resources/${prop}/${element}.json`,
//       JSON.stringify(container)
//     );
//   });
// });
