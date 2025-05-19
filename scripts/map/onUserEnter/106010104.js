// AdventureMS Standard Map Script

var quest = 1019;
var start = true;
var end = false;

// Standard Map Script Start
function start(ms)
{
    if (start)
    {
        if (ms.getQuestStatus(quest) === 0)
        {
            ms.startQuest(quest);
        }
    }

    else if (end)
    {
        if (ms.getQuestStatus(quest) <= 1)
        {
            ms.completeQuest(quest);
        }
    }
}