// AdventureMS Portal Default

function enter(pi)
{
    if (pi.getPlayer().getZoneProgress() >= 1)
    {
        pi.playPortalSound();
        pi.warp(100020000, " ");
        return false;
    }

    else
    {
        pi.getPlayer().yellowMessage(" ");
        return false;
    }
}