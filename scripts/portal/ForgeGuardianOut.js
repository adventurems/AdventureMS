// AdventureMS Forge Guardian Out

function enter(pi)
{
    // Check for any monsters for other maps
    if (pi.getPlayer().getMap().countMonsters() === 0)
    {
        pi.playPortalSound();
        pi.warp(106010115, "in00");
        return true;
    }

    else
    {
        if (pi.getMapId() < 106010130)
        {
            pi.playerMessage(5, "The portal is protected by the guardian! It must be defeated!");
            return false;
        }

        else
        {
            pi.playerMessage(5, "The portal is protected by the guardians! They must be defeated!");
            return false;
        }
    }
}