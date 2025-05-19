// AdventureMS Ruins Entrance

function enter(pi)
{
    if (pi.getPlayer().getQuestStatus(1012) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010108, "east00");
        return true;
    }

    else
    {
        pi.getPlayer().yellowMessage("The forge rejects your presence... You are not ready yet.");
        return false;
    }
}