// AdventureMS The Farm

function enter(pi)
{
    // Leaving the dungeon
    var map = pi.getMapId();
    var player = pi.getPlayer();

    // Get the event instance the player is in
    var eim = player.getEventInstance();

    // If the player is in an event instance, unregister them
    if (eim != null)
    {
        eim.unregisterPlayer(player);
        eim.dispose();
    }

    // Clean up and warp the player
    player.dispelDebuffs();
    pi.resetMapObjects(map);
    pi.getMap().clearDrops();
    pi.playPortalSound();
    pi.warp(106010117);
    return true;
}