const axios = require("axios").default;
const fse = require("fs-extra");
const https = require("https");
const Path = require("path");
const Jobs = require("./D2O/Jobs.json");
const Skills = require("./D2O/Skills.json");
const Interactives = require("./D2O/Interactives.json");
const Items = require("./D2O/Items.json");

https.globalAgent.maxSockets = 250;

const JobsResources = {};

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
    await Promise.all(
      Object.values(Jobs).map(
        (job) =>
          new Promise(async (resolve) => {
            await downloadImage(
              `${assetsUrl}/gfx/jobs/${job.iconId}.png`,
              `./resources/jobIcon/`,
              `${job.iconId}.png`
            );

            await Promise.all(
              Object.values(Skills).map(
                (skill) =>
                  new Promise(async (resolve) => {
                    if (
                      skill.parentJobId === job.id &&
                      skill.gatheredRessourceItem !== -1
                    ) {
                      if (Interactives[skill.interactiveId]) {
                        const interactive = Interactives[skill.interactiveId];
                        const item = Items[skill.gatheredRessourceItem];
                        if (item) {
                          await downloadImage(
                            `${assetsUrl}/gfx/items/${item.iconId}.png`,
                            `./resources/assets/${job.nameId}/`,
                            `${item.iconId}.png`
                          );
                        }
                        JobsResources[job.id] = JobsResources[job.id] || {
                          id: job.id,
                          nameId: job.nameId,
                          iconId: job.iconId,
                          specializationOfId: job.specializationOfId,
                          toolIds: job.toolIds,
                          resources: [],
                        };
                        JobsResources[job.id].resources.push({
                          id: interactive.id,
                          nameId: interactive.nameId,
                          iconId: item ? item.iconId : null,
                          level: skill.levelMin,
                        });
                      }
                    }

                    resolve();
                  })
              )
            );

            resolve();
          })
      )
    );

    await fse.outputJSON("./resources/JobsResources.json", JobsResources, {
      spaces: 1,
    });
  });
