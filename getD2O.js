const axios = require("axios").default;
const fse = require("fs-extra");

const classes = [
  "AbuseReasons",
  "AchievementCategories",
  "AchievementObjectives",
  "AchievementRewards",
  "Achievements",
  "ActionDescriptions",
  "AlignmentBalance",
  "AlignmentEffect",
  "AlignmentGift",
  "AlignmentOrder",
  "AlignmentRank",
  "AlignmentRankJntGift",
  "AlignmentSides",
  "AlignmentTitles",
  "AlmanaxCalendars",
  "Appearances",
  "Areas",
  "BidHouseCategories",
  "Breeds",
  "CensoredContents",
  "CensoredWords",
  "Challenge",
  "ChatChannels",
  "CompanionCharacteristics",
  "Companions",
  "CompanionSpells",
  "CreatureBonesOverrides",
  "CreatureBonesTypes",
  "Documents",
  "Dungeons",
  "Effects",
  "EmblemBackgrounds",
  "EmblemSymbolCategories",
  "EmblemSymbols",
  "Emoticons",
  "ExternalNotifications",
  "Heads",
  "HintCategory",
  "Hints",
  "Houses",
  "Incarnation",
  "IncarnationLevels",
  "InfoMessages",
  "Interactives",
  "Items",
  "ItemSets",
  "ItemTypes",
  "Jobs",
  "LegendaryTreasureHunts",
  "LivingObjectSkinJntMood",
  "MapCoordinates",
  "MapPositions",
  "MapReferences",
  "MapScrollActions",
  "MonsterMiniBoss",
  "MonsterRaces",
  "Monsters",
  "MonsterSuperRaces",
  "Months",
  "MountBehaviors",
  "MountBones",
  "Mounts",
  "Notifications",
  "NpcActions",
  "NpcMessages",
  "Npcs",
  "OptionalFeatures",
  "Ornaments",
  "Pack",
  "Pets",
  "Phoenixes",
  "PointOfInterest",
  "PointOfInterestCategory",
  "PresetIcons",
  "QuestCategory",
  "QuestObjectives",
  "QuestObjectiveTypes",
  "Quests",
  "QuestStepRewards",
  "QuestSteps",
  "RankNames",
  "Recipes",
  "RideFood",
  "ServerCommunities",
  "ServerGameTypes",
  "ServerPopulations",
  "Servers",
  "ShieldModelsLevels",
  "SkillNames",
  "Skills",
  "SkinMappings",
  "SkinPositions",
  "Smileys",
  "SoundBones",
  "SoundUi",
  "SoundUiHook",
  "SpeakingItemsText",
  "SpeakingItemsTriggers",
  "SpellBombs",
  "SpellLevels",
  "SpellPairs",
  "Spells",
  "SpellStates",
  "SpellTypes",
  "StealthBones",
  "SubAreas",
  "SubAreaIdPerCoordinate",
  "SubAreasWorldMapData",
  "SuperAreas",
  "TaxCollectorFirstnames",
  "TaxCollectorNames",
  "Tips",
  "TitleCategories",
  "Titles",
  "ToaRank",
  "TypeActions",
  "Url",
  "Waypoints",
  "WorldMaps",
];

axios
  .get("https://proxyconnection.touch.dofus.com/config.json?lang=fr")
  .then(async (res) => {
    const assetsUrl = res.data.assetsUrl;
    const dataUrl = res.data.dataUrl;
    await Promise.all(
      classes.map(
        (classe) =>
          new Promise(async (resolve, reject) => {
            let D2O;
            try {
              D2O = await axios.post(`${dataUrl}/data/map`, {
                class: classe,
              });
              await fse.outputJSON(`./D2O/${classe}.json`, D2O.data);
              resolve();
            } catch (error) {
              console.error(error);
              console.error(classe);
              resolve();
            }
          })
      )
    );
  });
