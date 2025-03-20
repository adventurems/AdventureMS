// AdventureMS
// Location - Lost Land > Take A Break

function enter(pi)
{
        pi.playPortalSound();
        pi.warp(101040104, "out00");
        pi.getPlayer().yellowMessage("You've been playing Maplestory for 8 hour(s), we suggest you take a break from Mapling.");
        return true;
}