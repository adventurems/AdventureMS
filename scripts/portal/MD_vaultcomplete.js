/*
Inside Vault - Mob Check
*/

function enter(pi)
{
    if (pi.getPlayer().getMapId() < 198000103)
    {
        // Check for specific mob ID 9400633 for maps below 198000103
        if (pi.getPlayer().getMap().getMonsterById(9400633) == null && pi.getPlayer().getMap().getMonsterById(9400634) == null)
        {
            pi.playPortalSound();
            pi.warp(198000105, "st00");
            return true;
        }
        else
        {
            pi.playerMessage(5, "Astaroth still stands, defeat the vault protector!");
            return false;
        }
    }
    else
    {
        // Check for any monsters for other maps
        if (pi.getPlayer().getMap().countMonsters() === 0)
        {
            pi.playPortalSound();
            pi.warp(198000105, "st00");
            return true;
        }
        else
        {
            pi.playerMessage(5, "The cursed adventurers still stand, defeat the vault protectors!");
            return false;
        }
    }
}