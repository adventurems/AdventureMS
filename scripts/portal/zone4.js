// AdventureMS Zone 4

function enter(pi)
{
    if (pi.getPlayer().getZoneProgress() >= 3)
    {
        pi.playPortalSound();
        pi.warp(106010100, "out00");
        return true;
    }

    else
    {
        pi.getPlayer().yellowMessage("You haven't cleared Zone 3! Descend into the vault!");
        return false;
    }
}