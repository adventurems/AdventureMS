// AdventureMS Standard Map Script

var quest = 999;

// Standard Map Script Start
function start(ms)
{
    // Check quest status
    if (ms.getQuestStatus(quest) <= 1)
    {
        ms.completeQuest(quest);
    }
}