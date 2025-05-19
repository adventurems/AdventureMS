// AdventureMS TheFarmEvent

var isPq = false;
var minPlayers = 1, maxPlayers = 1;
var minLevel = 1, maxLevel = 255;
var entryMap = 100000007; // Your dungeon map ID
var exitMap = 106010117;  // Your base map ID

function init() {
    // Initialize the event
}

function setup(level, lobbyid) {
    var eim = em.newInstance("TheFarm" + lobbyid);

    // Set up the map
    var map = eim.getInstanceMap(entryMap);
    map.resetPQ(level);
    map.clearDrops();

    // Import required Java classes
    const Point = Java.type('java.awt.Point');

    // Spawn monsters - using the correct method
    var positions = [
        new Point(2197, -325),
        new Point(1824, -207),
        new Point(1825, -483),
        new Point(1824, -788),
        new Point(2210, -680),
        new Point(2567, -482),
        new Point(2962, -812),
        new Point(2579, -812),
        new Point(2953, -324)
    ];

    for (var i = 0; i < positions.length; i++) {
        var mob = em.getMonster(9420005); // Chicken monster ID
        eim.registerMonster(mob);
        map.spawnMonsterOnGroundBelow(mob, positions[i]);
    }

    // Start timer
    eim.startEventTimer(33000); // 18 Seconds

    return eim;
}

function playerEntry(eim, player)
{
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
    player.dropMessage(5, "Defeat all chickens and collect the Golden Egg before time expires!");
}

function monsterKilled(mob, eim) {
    // Get the map where the monster was killed
    var map = mob.getMap();

    // Check if this was the last monster on the map
    if (map.countMonsters() === 0) {

        // Create the item object
        const Item = Java.type('client.inventory.Item');
        var itemObj = new Item(4031284, 0, 1); // Create 1 of item ID 4031284

        // Get a player to be the "dropper" (owner of the drop)
        var dropper = eim.getPlayers().get(0);

        // Spawn the item at the position where the monster died
        map.spawnItemDrop(mob, dropper, itemObj, mob.getPosition(), true, false);

        // Optional: Send a message to players
        eim.dropMessage(5, "The final monster has been defeated! A special item has appeared!");
    }
}

function scheduledTimeout(eim) {
    // What happens when time runs out
    end(eim);
}

function playerUnregistered(eim, player) {}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}

function end(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

// Include other required event functions
function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
    end(eim); // End the event if player disconnects
}

function playerRevive(eim, player) {
    return false;
}

function changedMap(eim, player, mapid) {
    if (mapid != entryMap) {
        eim.unregisterPlayer(player);
        end(eim); // End the event if player leaves the map
    }
}

function afterSetup(eim) {
    // This function is called after the instance is set up
    // It can be empty, but must exist
}

function monsterValue(eim, mobId) {
    return 1;
}

function dispose(eim) {}

function cancelSchedule() {
    // This function is called when the server is shutting down
    // It should cancel any scheduled tasks
}