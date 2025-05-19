// AdventureMS Standard Map Script

var quest = 999;
var startQuest = false;
var endQuest = false;

// Standard Map Script Start
function start(ms)
{
    if (startQuest)
    {
        if (ms.getQuestStatus(quest) === 0)
        {
            ms.startQuest(quest);
        }
    }

    else if (endQuest)
    {
        if (ms.getQuestStatus(quest) <= 1)
        {
            ms.completeQuest(quest);
        }
    }
}