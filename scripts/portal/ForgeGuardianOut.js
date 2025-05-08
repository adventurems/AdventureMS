// AdventureMS Portal Default

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
        pi.playerMessage(5, "The door is protected by the guardian! It must be defeated!");
        return false;
    }
}