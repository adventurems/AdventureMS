// AdventureMS Forge Guardian

function enter(pi)
{
    // They've already defeated the guardian, warp to outdoors
    if (cm.getQuestStatus(1028) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010115, "in00");
        return true;
    }

    // They've helped Vicious, they can now fight the real boss
    else if (cm.getQuestStatus(1023) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010125, "in00");
        return true;
    }

    // They haven't helped Vicious yet
    else
    {
        pi.playPortalSound();
        pi.warp(106010120, "in00");
        return true;
    }
}