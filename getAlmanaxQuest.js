const quests = require('./D2O/Quests.json');
const questSteps = require('./D2O/QuestSteps.json');
const questObjectives = require('./D2O/QuestObjectives.json');
const items = require('./D2O/Items.json');
const npc = require('./D2O/Npcs');
const req = require('request');
const cheerio = require('cheerio');

req(
  {
    method: 'GET',
    url: `http://www.krosmoz.com/fr/almanax`
  },
  (error, response, body) => {
    const $ = cheerio.load(body);
    for (const npcid of Object.values(npc)) {
      if (npcid.nameId == $('#almanax_boss_desc > span').text()) {
        Object.values(quests).forEach(quest => {
          if (quest.categoryId == 31 && quest.nameId.match(npcid.nameId)) {
            quest.stepIds.forEach(step => {
              console.log(`Reward ${Math.round(questSteps[step].kamasRatio * 43978)} K`);
              questSteps[step].objectiveIds.forEach(objective => {
                switch (questObjectives[objective]._type) {
                  case 'QuestObjectiveBringItemToNpc':
                    console.log(
                      `Give ${items[questObjectives[objective].parameters[1]].nameId}(${questObjectives[objective].parameters[1]}) x ${
                        questObjectives[objective].parameters[2]
                      } to ${npc[questObjectives[objective].parameters[0]].nameId}(${questObjectives[objective].parameters[0]})`
                    );
                    break;
                  case 'QuestObjectiveFreeForm':
                    console.log(`Go prey`);
                    break;
                  case 'QuestObjectiveGoToNpc':
                    console.log(
                      `Talk to ${npc[questObjectives[objective].parameters[0]].nameId}(${questObjectives[objective].parameters[0]})(${
                        npc[questObjectives[objective].parameters[0]].dialogReplies.length
                      })`
                    );
                    break;
                  default:
                }
              });
            });
          }
        });
      }
    }
  }
);
