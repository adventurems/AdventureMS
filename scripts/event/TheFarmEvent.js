// TheFarmEvent.js
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

    // Spawn monsters
    eim.spawnMonster(9420005, 1936, -811);
    eim.spawnMonster(9420005, 2115, -811);
    eim.spawnMonster(9420005, 2395, -811);
    eim.spawnMonster(9420005, 2571, -811);
    eim.spawnMonster(9420005, 2903, -811);
    eim.spawnMonster(9420005, 1869, -535);
    eim.spawnMonster(9420005, 2066, -535);
    eim.spawnMonster(9420005, 2448, -535);
    eim.spawnMonster(9420005, 2646, -535);
    eim.spawnMonster(9420005, 2837, -535);

    // Start timer
    eim.startEventTimer(300000); // 5 minutes

    return eim;
}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
    player.dropMessage(5, "Defeat all chickens and collect the Golden Egg before time expires!");
}

function monsterKilled(mob, eim) {
    // Get the map where the monster was killed
    var map = mob.getMap();

    // Check if this was the last monster on the map
    if (map.countMonsters() == 0) {
        // This was the last monster, so we'll drop the special item

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
function playerDisconnected(eim, player) { eim.unregisterPlayer(player); }
function playerRevive(eim, player) { return false; }
function changedMap(eim, player, mapid) {
    if (mapid != entryMap) {
        eim.unregisterPlayer(player);
    }
}
function playerDead(eim, player) {}
function monsterValue(eim, mobId) { return 1; }
function allMonstersDead(eim) {}
function cancelSchedule() {}
function dispose() {}