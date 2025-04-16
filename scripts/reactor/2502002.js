// AdventureMS Dyle Spawner
const PacketCreator = Java.type('tools.PacketCreator');

function act()
{
    // Spawn Dyle
    rm.spawnMonster(6220000, 1, 45, -117)

    // Message the map!
    rm.getPlayer().getMap().broadcastMessage(PacketCreator.serverNotice(6, "Dyle takes the bait and slithers out of the swamp!"));
}