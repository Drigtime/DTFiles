const Jobs = require("./D2O/Jobs.json");
const Skills = require("./D2O/Skills.json");
const Items = require("./D2O/Items.json");
const fs = require("fs");
const request = require("request");
const JobsResources = [];

function download(uri, filename, callback) {
  request.head(uri, function() {
    request(uri).pipe(fs.createWriteStream(filename));
    // .on("finish", callback);
  });
}

Object.values(Jobs).forEach(job => {
  download(
    `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/gfx/jobs/${job.iconId}.png`,
    `./resources/jobIcon/${job.iconId}.png`,
    () => {}
  );
  const jobResources = [];
  Object.values(Skills).forEach(skill => {
    if (skill.parentJobId === job.id && skill.gatheredRessourceItem !== -1) {
      if (!fs.existsSync(`./resources/assets/${job.nameId}`))
        fs.mkdirSync(`./resources/assets/${job.nameId}`);
      if (Items[skill.gatheredRessourceItem]) {
        const currentItem = Items[skill.gatheredRessourceItem];
        download(
          `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/gfx/items/${currentItem.iconId}.png`,
          `./resources/assets/${job.nameId}/${currentItem.id}.png`,
          () => {}
        );
        jobResources.push({
          id: currentItem.id,
          nameId: currentItem.nameId,
          iconId: currentItem.iconId,
          level: currentItem.level
        });
      }
    }
  });
  if (jobResources.length > 0)
    JobsResources.push({
      name: job.nameId,
      id: job.id,
      resources: jobResources.sort((a, b) => a.level - b.level)
    });
});

fs.writeFileSync(
  "./resources/JobsResources.json",
  JSON.stringify(JobsResources, null, "\t")
);
