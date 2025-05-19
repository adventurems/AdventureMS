// AdventureMS - The Forge

function enter(pi)
{
    if (pi.getPlayer().getQuestStatus(1034) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010116, "out00");
        return false;
    }

    else
    {
        pi.playPortalSound();
        pi.warp(106010123, "out00");
        return false;
    }
}