// AdventureMS Custom Dungeon

// Dungeon Information
var isPq = true;
var eventTime = 5; // 5 minutes
var minPlayers = 1, maxPlayers = 6;
var minLevel = 1, maxLevel = 255;
var startMap = 3000000;
var minMapId = 3000000;
var maxMapId = 3000030;
var bossId = 3300008; // AdventureMS Custom Boss Spawn

// Import Java classes
const Point = Java.type('java.awt.Point');

function setup(level, lobbyid, monsterId, mapId)
{
    // Set up the event
    var eim = em.newInstance("Dungeon1" + lobbyid); // Create new instance
    eim.setProperty("level", level); // Set difficulty of dungeon
    eim.setProperty("entranceMap", mapId); // The map where the dungeon was spawned
    basicDungeonSetup(eim); // Set stages, set timer, etc...

    // Format: [mapOffset, [[x, y, spawnCount], [x, y, spawnCount], ...]]
    var mapPlatforms = [
        // First map (startMap)
        [0, [
            [855, 798, 6],    // Platform 1
            [234, 678, 6],    // Platform 2
            [384, 378, 6],    // Platform 3
            [304, -162, 9],   // Platform 4
            [888, -462, 9],   // Platform 5
            [154, -762, 8],   // Platform 6
            [684, -1122, 8],  // Platform 7
            [227, -1422, 7]   // Platform 8
        ]],

        // Second map (startMap + 10)
        [10, [
            [475, -1487, 5],  // Platform 1
            [232, -1187, 5],  // Platform 2
            [922, -1067, 7],  // Platform 3
            [1583, -1436, 8], // Platform 4
            [2033, -1099, 9], // Platform 5
            [3555, -1234, 5], // Platform 6
            [3015, -1055, 6], // Platform 7
            [2791, -1436, 7]  // Platform 8
        ]],

        // Third map (startMap + 20)
        [20, [
            [585, 68, 8],     // Platform 1
            [585, 188, 7],    // Platform 2
            [675, -52, 9],    // Platform 3
            [675, -832, 9],   // Platform 4
            [585, -952, 8],   // Platform 5
            [675, -1072, 7],  // Platform 6
        ]]
    ];

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
} // AdventureMS Custom
function basicDungeonSetup(eim) {
    eim.setProperty("stage1", "0");
    eim.setProperty("stage2", "0");
    eim.setProperty("stage3", "0");
    eim.setProperty("stage4", "0");
    eim.setProperty("curStage", "1");
    eim.startEventTimer(eventTime * 60000);
} // AdventureMS Custom
function spawnMonstersOnPlatform(eim, map, monsterId, x, y, count) {
    var difficulty = eim.getPlayers().size() * 2;

    // Loop through and create / modify monsters
    for (var i = 0; i < count; i++)
    {
        var mob = em.getMonster(monsterId);

        // Scale the monster BEFORE spawning using changeDifficulty
        mob.changeDifficultyBasic(difficulty);

        // Set the position
        var spos = new Point(x, y);
        mob.setPosition(spos);

        // Spawn the monster on the map
        map.spawnMonster(mob);
    }
}
function spawnBoss(eim, map, bossId) {
    var difficulty = eim.getPlayers().size() * 2;
    var mob = em.getMonster(bossId);

    // Scale the boss BEFORE spawning using changeDifficulty
    mob.changeDifficultyBasic(difficulty);

    // Set the position
    var spos = new Point(811, 368);
    mob.setPosition(spos);

    // Spawn the monster on the map
    map.spawnMonster(mob);
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
} // AdventureMS Custom
function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    var mapId = parseInt(eim.getProperty("entranceMap"));
    player.changeMap(mapId, 0);
} // AdventureMS Custom
function monsterKilled(mob, eim) {  // AdventureMS Custom
    var map = mob.getMap(); // Get the map the monster is on
    if (map.countMonsters() === 0)
    {
        eim.showClearEffect(map.getId());  // Show clear effect when all monsters dead

        // If it's the last map, clear the event
        if (map.getId() === maxMapId) {clearPQ(eim);}
    }
}
function clearPQ(eim) {
    eim.restartEventTimer(30000);
    eim.setEventCleared();
} // AdventureMS Custom

// Think I can remove
function allMonstersDead(eim) {}
function cancelSchedule() {}
function dispose(eim) {}
function playerDead(eim, player) {}
function playerUnregistered(eim, player) {}
function afterSetup(eim) {}
