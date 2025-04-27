// AdventureMS Portal Default

function enter(pi)
{
    if (pi.getPlayer().getZoneProgress() >= 1)
    {
        pi.playPortalSound();
        pi.warp(100020000, "west00");
        return false;
    }

    else
    {
        pi.getPlayer().yellowMessage("You haven't cleared Zone 1! That dirty snail is still running amok");
        return false;
    }
}