// AdventureMS Enter the Ruins

var quest = 1024;

// Standard Map Script Start
function start(ms)
{
    // Check quest status
    if (ms.getQuestStatus(quest) <= 1)
    {
        ms.completeQuest(quest);
    }
}