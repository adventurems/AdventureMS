// AdventureMS West of Kora

// Player Engages the Portal
function enter(pi)
{
    // Check if they are wearing Goggles
    if (pi.getPlayer().areGogglesEquipped())
    {
        pi.playPortalSound(); // Sound

        // Send to working portal map
        pi.warp(100000202, "out00");
        return true;
    }

    // They don't have Goggles equipped
    else
    {
        pi.playPortalSound(); // Sound

        // Send to broken portal map
        pi.warp(100000201, "out00");
        return true;
    }
}