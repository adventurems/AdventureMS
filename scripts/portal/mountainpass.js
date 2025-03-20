// AdventureMS
// Location - Blazing Peak Mountain

function enter(pi)
{
    // Check if we already on the east side of the mountain
    if (pi.getPlayer().getMapId() == 101030100)
    {
        // If we already cleared the zone, don't give another key
        if (pi.getPlayer().getZoneProgress() < 3)
        {
            // If they don't have the key, give it to them
            if (!pi.haveItem(3997003)) {pi.gainItem(3997003, 1);}
        }

        // Warp the player no matter what since we are on the other side of the mountain
        pi.playPortalSound();
        pi.warp(101040002, "cross00");
        return true;

    // We are on the west side of the mountain
    } else
    {
        // Check if we have the key or have cleared the zone
        if (pi.haveItem(3997003) || pi.getPlayer().getZoneProgress() >= 3)
        {
            pi.playPortalSound();
            pi.warp(101030100, "cross00");
            return true;
        }

        // We don't have the key, tell them to pass the test
        else
        {
            pi.playerMessage(5, "You have not cleared test on The Peak. Pass the test to unlock the shortcut!");
            return false;
        }
    }
}