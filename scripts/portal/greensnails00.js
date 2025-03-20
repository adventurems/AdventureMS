// AdventureMS
// Location - Kora Park

function enter(pi)
{
    if (pi.getPlayer().haveItem(3991000) || pi.getPlayer().job >= 10 || pi.getPlayer().getZoneProgress() >= 1)
    {
        pi.playPortalSound();
        pi.warp(104040000, "out00");
        return true;
    } else
    {
        pi.getPlayer().yellowMessage("You haven't helped out Sam yet!");
        return false;
    }
}