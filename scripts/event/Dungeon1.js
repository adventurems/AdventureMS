// AdventureMS Custom Dungeon

// Varied Dungeon Information
const dungeonName = "Dungeon1";
const dungeonTier = 1;
const startMap = 3000000 + dungeonTier - 1;
const minMapId = 3000000 + dungeonTier - 1;
const maxMapId = 3000030 + dungeonTier - 1;
let bossId = 3300008;

// Default Dungeon Information
const isPq = true;
let eventTime = 7; // 7 minutes
const minPlayers = 1, maxPlayers = 6;
const minLevel = 1, maxLevel = 255;

// Rare Dungeon Information
let rare = false;
const rareBossId = 9400569;
const goblinLoot = 9402050 + dungeonTier - 1;
const goblinMeso = 9010150 + dungeonTier - 1;
const goblinGem = 2600420 + dungeonTier - 1;

function setup(level, lobbyid, monsterId, mapId)
{
    /*/ Check if it's a rare dungeons
    if (goblinLoot == monsterId)
    {
        rare = true;
        bossId = rareBossId;
        eventTime = 7;
    }*/

    // Set up the event
    var eim = em.newInstance(dungeonName + lobbyid); // Create new instance
    eim.setProperty("level", level); // Set difficulty of dungeon
    eim.setProperty("entranceMap", mapId); // The map where the dungeon was spawned
    basicDungeonSetup(eim); // Set stages, set timer, etc...

    // Normal Dungeon
    if (!rare)
    {
        // Format: [mapOffset, [[x, y, spawnCount], [x, y, spawnCount], ...]]
        var mapPlatforms = [
            // First map (startMap)
            [0, [
                [3864, 193, 6],    // Platform 1
                [403,195, 9],    // Platform 2
                [595,-109, 8],    // Platform 3
                [2901,97, 6],   // Platform 4
                [2256,182, 5],   // Platform 5
                [1985,98, 5],   // Platform 6
                [1938,-20, 10],  // Platform 7
                [1903,-210, 7]   // Platform 8
            ]],

            // Second map (startMap + 10)
            [10, [
                [3845,-82, 9],  // Platform 1
                [3721,5, 9],  // Platform 2
                [1514,-262, 8],  // Platform 3
                [2144,178, 8], // Platform 4
                [371,-1, 12], // Platform 5
                [1151,96, 5], // Platform 6
                [592,181, 6] // Platform 7
            ]],

            // Third map (startMap + 20)
            [20, [
                [500,219, 9],     // Platform 1
                [43,561, 5],    // Platform 2
                [712,560, 3],    // Platform 3
                [741,663, 7],   // Platform 4
                [-159,849, 8],   // Platform 5
                [730,962, 5],
                [302,983, 6],
                [11,1083, 11]
            ]]
        ];
    }

    // Rare Dungeon
    else
    {
        // Format: [mapOffset, [[x, y, spawnCount], [x, y, spawnCount], ...]]
        var mapPlatforms = [
            // First map (startMap)
            [0, [
                [3864, 193, 2],    // Platform 1
                [403,195, 3],    // Platform 2
                [595,-109, 3],    // Platform 3
                [2901,97, 2],   // Platform 4
                [2256,182, 2],   // Platform 5
                [1985,98, 2],   // Platform 6
                [1938,-109, 2],  // Platform 7
                [1903,-210, 2]   // Platform 8
            ]],

            // Second map (startMap + 10)
            [10, [
                [3845,-82, 3],  // Platform 1
                [3721,5, 3],  // Platform 2
                [1514,-262, 2],  // Platform 3
                [2144,178, 3], // Platform 4
                [371,-1, 4], // Platform 5
                [1151,96, 2], // Platform 6
                [592,181, 2] // Platform 7
            ]],

            // Third map (startMap + 20)
            [20, [
                [500,219, 3],     // Platform 1
                [43,561, 2],    // Platform 2
                [712,560, 1],    // Platform 3
                [741,663, 2],   // Platform 4
                [-159,849, 3],   // Platform 5
                [730,962, 1],
                [302,983, 2],
                [11,1083, 3]
            ]]
        ];
    }

    // Process each map
    mapPlatforms.forEach(function(mapData) {
        var mapOffset = mapData[0];
        var platforms = mapData[1];
        var map = eim.getInstanceMap(startMap + mapOffset);

        // Spawn monsters on all platforms
        platforms.forEach(function(platform, index) {
            spawnMonstersOnPlatform(eim, map, monsterId, platform[0], platform[1], platform[2]);
        });
    });

    // Handle boss room
    var map = eim.getInstanceMap(maxMapId);
    spawnBoss(eim, map, bossId);
    return eim;
}

// Default DungeonPQ Functions w/o changes
function init() {
    setEventRequirements(); }
function setEventRequirements() {
    var reqStr = "";

    reqStr += "\r\n    Number of players: ";
    if (maxPlayers - minPlayers >= 1) {
        reqStr += minPlayers + " ~ " + maxPlayers;
    } else {
        reqStr += minPlayers;
    }

    reqStr += "\r\n    Level range: ";
    if (maxLevel - minLevel >= 1) {
        reqStr += minLevel + " ~ " + maxLevel;
    } else {
        reqStr += minLevel;
    }

    reqStr += "\r\n    Time limit: ";
    reqStr += eventTime + " minutes";

    em.setProperty("party", reqStr);
}
function playerEntry(eim, player) {
    var map = eim.getMapInstance(startMap);
    player.changeMap(map, map.getPortal(0));
}
function scheduledTimeout(eim) {
    end(eim);
}
function playerLeft(eim, player) {
    if (!eim.isEventCleared()) {
        playerExit(eim, player);
    }
}
function changedMap(eim, player, mapid) {
    if (mapid < minMapId || mapid > maxMapId) {
        if (eim.isEventTeamLackingNow(true, minPlayers, player)) {
            eim.unregisterPlayer(player);
            end(eim);
        } else {
            eim.unregisterPlayer(player);
        }
    } else {
        changedMapInside(eim, mapid);
    }
}
function changedLeader(eim, leader) {
    var mapid = leader.getMapId();
    if (!eim.isEventCleared() && (mapid < minMapId || mapid > maxMapId)) {
        end(eim);
    }
}
function playerRevive(eim, player) { // player presses ok on the death pop up.
    if (eim.isEventTeamLackingNow(true, minPlayers, player)) {
        eim.unregisterPlayer(player);
        end(eim);
    } else {
        eim.unregisterPlayer(player);
    }
}
function playerDisconnected(eim, player) {
    if (eim.isEventTeamLackingNow(true, minPlayers, player)) {
        end(eim);
    } else {
        playerExit(eim, player);
    }
}
function leftParty(eim, player) {
    if (eim.isEventTeamLackingNow(false, minPlayers, player)) {
        end(eim);
    } else {
        playerLeft(eim, player);
    }
}
function disbandParty(eim) {
    if (!eim.isEventCleared()) {
        end(eim);
    }
}
function end(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}
function monsterValue(eim, mobId) {
    return 1;
}
function allMonstersDead(eim) {}
function cancelSchedule() {}
function dispose(eim) {}
function playerDead(eim, player) {}
function playerUnregistered(eim, player) {}
function afterSetup(eim) {}

// AdventureMS Custom
function getEligibleParty(party) {
    var eligible = [];
    var hasLeader = false;
    var leaderMapId = -1;  // Initialize with a default value

    if (party.size() > 0) {
        var partyList = party.toArray();

        // First find the leader and get their map ID
        for (var i = 0; i < party.size(); i++) {
            var ch = partyList[i];
            if (ch.isLeader()) {
                leaderMapId = ch.getMapId();
                break;
            }
        }

        // Now check eligibility based on the leader's map
        for (var i = 0; i < party.size(); i++) {
            var ch = partyList[i];

            if (ch.getMapId() === leaderMapId && ch.getLevel() >= minLevel && ch.getLevel() <= maxLevel) {
                if (ch.isLeader()) {
                    hasLeader = true;
                }
                eligible.push(ch);
            }
        }
    }

    if (!(hasLeader && eligible.length >= minPlayers && eligible.length <= maxPlayers)) {
        eligible = [];
    }
    return Java.to(eligible, Java.type('net.server.world.PartyCharacter[]'));
}
function basicDungeonSetup(eim) {
    eim.setProperty("stage1", "0");
    eim.setProperty("stage2", "0");
    eim.setProperty("stage3", "0");
    eim.setProperty("stage4", "0");
    eim.setProperty("curStage", "1");
    eim.startEventTimer(eventTime * 60000);
}
function spawnMonstersOnPlatform(eim, map, monsterId, x, y, count) {

    // Loop through and create monsters
    for (var i = 0; i < count; i++)
    {
        // Assign the normal mob if not a rare dungeon
        if (!rare) {var mob = em.getMonster(monsterId); mob.setDungeonMob();}
        else
        {
            // Randomly select a monster from the loot table
            var roll = Math.floor(Math.random() * 3);
            if (roll === 0) {mob = em.getMonster(goblinLoot);}
            else if (roll === 1) {mob = em.getMonster(goblinMeso);}
            else {mob = em.getMonster(goblinGem);}
        }

        // Scale monster stats
        mob.changeDifficultyBasic(eim.getProperty("level") * 2);

        // Spawn the monster on the map
        map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(x, y));
    }
}
function spawnBoss(eim, map, bossId) {

    // Get the boss monster object
    var mob = em.getMonster(bossId);

    // Scale monster stats
    mob.changeDifficultyBasic(eim.getProperty("level") * 2);

    // Disable drops for the boss monster - this ensures the base drop table is disabled
    // before any drops are generated, preventing the issue where boss drops appear for everyone
    mob.disableDrops();

    // Spawn the boss on the map
    map.spawnMonsterOnGroundBelow(mob, new java.awt.Point(320, 292));
}
function changedMapInside(eim, mapid) {
    var stage = eim.getIntProperty("curStage");

    if (stage === 1)
    {
        if (mapid === minMapId + 10)
        {
            eim.setIntProperty("curStage", 2);
        }
    }

    else if (stage === 2)
    {
        if (mapid === minMapId + 20)
        {
            eim.setIntProperty("curStage", 3);
        }
    }

    else if (stage === 3)
    {
        if (mapid === minMapId + 30) {
            eim.setIntProperty("curStage", 4);
        }
    }
}
function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    var mapId = parseInt(eim.getProperty("entranceMap"));
    player.changeMap(mapId, 0);
}
function monsterKilled(mob, eim) {  // AdventureMS Custom
    var map = mob.getMap(); // Get the map the monster is on

    // Check if the killed monster is the boss
    if (mob.getId() === bossId || mob.getId() === rareBossId) {
        // Disable normal drops for this monster - must be called before any drops are processed
        mob.disableDrops();

        // Handle instanced boss drops for each player
        handleBossDrops(mob, eim);
    }

    if (map.countMonsters() === 0) {
        eim.showClearEffect(map.getId());  // Show clear effect when all monsters dead

        // If it's the last map, clear the event
        if (map.getId() === maxMapId) {clearPQ(eim);}
    }
}
function clearPQ(eim) {
    eim.restartEventTimer(30000);
    eim.setEventCleared();
}

// ---- Instanced Drops ---- //

// Player-specific drop function (from previous solution)
function handleBossDrops(mob, eim)
{
    var map = mob.getMap();
    var mobPos = mob.getPosition();
    var players = map.getCharacters();
    // Convert to ArrayList to support index-based access
    var playersList = new java.util.ArrayList(players);

    // Get the drop table for the boss
    var mi = Java.type('server.life.MonsterInformationProvider').getInstance();
    var dropEntries = mi.retrieveEffectiveDrop(mob.getId());

    // For each player in the map, create their own instanced drops
    for (var i = 0; i < playersList.size(); i++)
    {
        var player = playersList.get(i);

        // Use the exact position where the monster died
        var dropPos = new java.awt.Point(
            mobPos.x, 
            mobPos.y
        );

        // Process each drop entry and create player-specific drops
        for (var j = 0; j < dropEntries.size(); j++) {
            var de = dropEntries.get(j);

            // Check if this item should drop (based on chance)
            var dropChance = Math.min(de.chance, 2147483647); // Integer.MAX_VALUE

            if (Math.floor(Math.random() * 999999) < dropChance) {
                // Create the item
                var itemId = de.itemId;
                var quantity = Math.min(de.Maximum, Math.max(de.Minimum, Math.floor(Math.random() * (de.Maximum - de.Minimum + 1)) + de.Minimum));

                // Create the item object
                var ii = Java.type('server.ItemInformationProvider').getInstance();
                var item;

                if (Java.type('constants.inventory.ItemConstants').getInventoryType(itemId) === Java.type('client.inventory.InventoryType').EQUIP)
                {
                    item = ii.getEquipById(itemId);
                }

                else
                {
                    var ItemClass = Java.type('client.inventory.Item');
                    item = new ItemClass(itemId, 0, quantity);
                }

                // Use a custom method to create a player-specific drop
                createPlayerSpecificDrop(map, mob, player, item, dropPos);
            }
        }
    }
}

// Helper function to create player-specific drops
function createPlayerSpecificDrop(map, dropper, player, item, dropPos)
{
    map.spawnPlayerSpecificItemDrop(dropper, player, item, dropPos, true);
}
