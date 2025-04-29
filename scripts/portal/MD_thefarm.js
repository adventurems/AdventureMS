// AdventureMS The Farm

function enter(pi)
{
    // Leaving the dungeon
    var map = pi.getMapId();
    pi.getPlayer().dispelDebuffs();
    pi.resetMapObjects(map);
    pi.getMap().clearDrops();
    pi.playPortalSound();
    pi.warp(106010117);
    return true;
}