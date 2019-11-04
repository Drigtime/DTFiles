// const req = require("request");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

function downloadAsset(asset, x, y, sx, sy, hue, ctx) {
  return new Promise((resolve, reject) => {
    loadImage(
      `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/gfx/world/png/${asset}.png`
    ).then(img => {
      ctx.save();
      ctx.scale(sx, sy);
      if (hue[0] == -128 && hue[1] == -128 && hue[2] == -128) {
        ctx.filter = `hue-rotate(0deg) saturate(0%) brightness(0%)`;
      }
      ctx.drawImage(img, x, y, img.width, img.height);
      ctx.filter = "none";
      ctx.restore();
      resolve();
    });
  });
}

function generateRealMap(mapJson) {
  let canvas = createCanvas(1287, 866);
  let ctx = canvas.getContext("2d"),
    content = mapJson;
  loadImage(
    `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/backgrounds/${content.id}.jpg`
  ).then(img => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let midgroundLayer = Object.keys(content.midgroundLayer);
    const promises = [];
    for (const key of midgroundLayer) {
      if (content.midgroundLayer[key] != undefined) {
        for (const element of content.midgroundLayer[key]) {
          if (element.g != undefined) {
            if (element.sx && element.sy) {
              promises.push(
                downloadAsset(
                  element.g,
                  element.x * -1 - 58,
                  element.y * -1 - 15,
                  element.sx,
                  element.sy,
                  element.hue,
                  ctx
                )
              );
            } else if (element.sx && !element.sy) {
              promises.push(
                downloadAsset(
                  element.g,
                  element.x * -1 - 58,
                  element.y + 15,
                  element.sx,
                  1,
                  element.hue,
                  ctx
                )
              );
            } else if (!element.sx && element.sy) {
              promises.push(
                downloadAsset(
                  element.g,
                  element.x + 58,
                  element.y * -1 - 15,
                  1,
                  element.sy,
                  element.hue,
                  ctx
                )
              );
            } else
              promises.push(
                downloadAsset(
                  element.g,
                  element.x + 58,
                  element.y + 15,
                  1,
                  1,
                  element.hue,
                  ctx
                )
              );
          }
        }
      }
    }
    Promise.all(promises).then(() => {
      if (content.foreground) {
        loadImage(
          `https://ankama.akamaized.net/games/dofus-tablette/assets/2.28.4_T99'1'Q2hkeFvVmjPpzcjlR7I*d2eWg*/foregrounds//${content.id}.png`
        ).then(img => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const buffer = canvas.toBuffer();
          fs.writeFileSync("test.png", buffer);
        });
      } else {
        const buffer = canvas.toBuffer();
        fs.writeFileSync("test.png", buffer);
      }
    });
  });
}

const map = JSON.parse(fs.readFileSync("D2P/257.json"));
generateRealMap(map);
