// AdventureMS Standard Map Script

var quest = 1028;
var start = false;
var end = true;

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