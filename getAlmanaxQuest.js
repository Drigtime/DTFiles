const quests = require('./D2O/Quests.json');
const questSteps = require('./D2O/QuestSteps.json')
const questObjectives = require('./D2O/QuestObjectives.json')
const items = require('./D2O/Items.json')
const npc = require('./D2O/Npcs')

Object.values(quests).forEach((quest)=>{
  if (quest.categoryId == 31) {
      quest.stepIds.forEach((step)=>{
        questSteps[step].objectiveIds.forEach((objective)=>{
          if (questObjectives[objective].parameters.length === 3) {
            if (questObjectives[objective].parameters[0] === 1625) {
              // if (items[questObjectives[objective].parameters[1]].nameId === "Oeuf de Dragoeuf Noir") {
                // console.log(step, objective, questObjectives[objective].parameters[1]);
              // }
              console.log(npc[questObjectives[objective].parameters[0]].nameId, items[questObjectives[objective].parameters[1]].nameId, questObjectives[objective].parameters[2]);
            }
          }
        })
      })
  }
})
