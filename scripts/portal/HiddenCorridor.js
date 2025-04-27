// AdventureMS West of Kora

// Player Engages the Portal
function enter(pi)
{
    // Check if they are wearing Goggles
    if (cm.getPlayer().areGogglesEquipped())
    {
        pi.playPortalSound(); // Sound

        // Send to working portal map
        pi.warp(999999999, "west00"); // TODO Update Map / Portal ID
        return true;
    }

    // They don't have Goggles equipped
    else
    {
        pi.playPortalSound(); // Sound

        // Send to broken portal map
        pi.warp(999999999, "west00"); // TODO Update Map / Portal ID
        return true;
    }
}