// AdventureMS Dungeon Portals

function enter(pi)
{
    var eim = pi.getPlayer().getEventInstance();
    var curMap = pi.getPlayer().getMapId();
    var target = eim.getMapInstance(curMap + 10);

    // Ensure all monsters are defeated
    if (pi.getPlayer().getMap().countMonsters() == 0)
    {
        // Add debugging
        pi.getPlayer().yellowMessage("curMap: " + curMap + " | target: " + target + " | Monsters: " + pi.getPlayer().getMap().countMonsters());
        pi.playPortalSound();
        pi.getPlayer().changeMap(target, target.getPortal("in00"));
        return true;
    }

    else
    {
        pi.getPlayer().yellowMessage("curMap: " + curMap + " | target: " + target + " | Monsters: " + pi.getPlayer().getMap().countMonsters());
        // pi.getPlayer().dropMessage(5, "Defeat all the monsters prior to entering the next stage.");
        return false;
    }
}