// AdventureMS Kerning Barber Shop

// Player pressed up on portal
function enter(pi)
{
    // Check to see if they've completed Shumi's popularity requirement
    if (pi.getPlayer().getQuestStatus(1010) == 2)
    {
        pi.playPortalSound();
        pi.warp(103000005, "out00");
        return true;
    }

    // Hasn't completed Shumi's quest yet
    {
        pi.getPlayer().yellowMessage("Don and Andre are only accepting high-profile clients from Shumi...");
        return false;
    }
}