// AdventureMS Zone 3

function enter(pi)
{
    if (pi.getPlayer().getZoneProgress() >= 2)
    {
        pi.playPortalSound();
        pi.warp(260010000, "west00");
        return false;
    }

    else
    {
        pi.getPlayer().yellowMessage("You haven't cleared Zone 2! Kerning is in trouble...");
        return false;
    }
}