const quests = require('./D2O/Quests.json');
const questSteps = require('./D2O/QuestSteps.json')
const questObjectives = require('./D2O/QuestObjectives.json')
const items = require('./D2O/Items.json')
const npc = require('./D2O/Npcs')

Object.values(quests).forEach((quest) => {
  if (quest.categoryId == 31 && quest.id == 989) {
    quest.stepIds.forEach((step) => {
      questSteps[step].objectiveIds.forEach((objective) => {
        switch (questObjectives[objective]._type) {
          case 'QuestObjectiveBringItemToNpc':
            console.log(`Give ${items[questObjectives[objective].parameters[1]].nameId}(${questObjectives[objective].parameters[1]}) x ${questObjectives[objective].parameters[2]} to ${npc[questObjectives[objective].parameters[0]].nameId}(${questObjectives[objective].parameters[0]})`);
            break;
          case 'QuestObjectiveFreeForm':
            console.log(`Go prey`);
            break;
          case 'QuestObjectiveGoToNpc':
            console.log(`Talk to ${npc[questObjectives[objective].parameters[0]].nameId}(${questObjectives[objective].parameters[0]})`);
            break;
          default:
        }
      })
    })
  }
})
