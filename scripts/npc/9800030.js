// AdventureMS Rare Dungeon Portal

// Get NPC data using the NPC's object ID
var npcData = MapleMap.getNpcData(cm.getNpcObjectId());
var character = npcData.get("character");
var monster = npcData.get("monster");
var map = npcData.get("map");

// Additional Variables
var dungeonTier = 1;
var monsterLvl = monster.getLevel();

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    if (status == 0)
    {
        // Determine the tier of the Dungeon
        if (monsterLvl < 23) {dungeonTier = 1;}
        else if (monsterLvl < 32) {dungeonTier = 2;}
        else {dungeonTier = 3;}

        // Run through all dungeons and find one that's not running'
        for (var i = 1; i <= 10; i++)
        {
            // Assign the next EventManager
            em = cm.getEventManager("Dungeon" + dungeonTier + "_" + i);

            // Check that the em is not fake and that it is not running
            if (em != null && em.getProperty("running") !== "true") { break; }
            em = null; // Couldn't find one open
        }

        // Error Checking
        if (em == null)
        {
            cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
            cm.dispose();
        }

        // Send first message
        cm.sendYesNo("Is your party ready to enter the Dungeon?");
    }

    // They want in the dungeon
    else if (status == 1)
    {
        // Make sure the dungeon is still free to enter
        if (em.getProperty("running") !== "true")
        {
            // Create the instance of the event
            eim = em.startInstance(cm.getPlayer());

            // Start the event
            if (eim)
            {
                // Now set properties on the instance
                eim.setProperty("playerId", character.getId());
                eim.setProperty("monsterId", monster.getId());
                eim.setProperty("mapId", map.getId());
            }

            else
            {
                cm.sendOk("The Dungeon failed to start. Please report this in the bugs section of #bDiscord#k!");
                cm.dispose();
            }
        }

        // The dungeon was taken while they chose, find a new one
        else
        {

            // Determine the tier of the Dungeon
            if (monsterLvl < 23) {dungeonTier = 1;}
            else if (monsterLvl < 32) {dungeonTier = 2;}
            else {dungeonTier = 3;}

            // Run through all dungeons and find one that's not running'
            for (var i = 1; i <= 10; i++)
            {
                // Assign the next EventManager
                em = cm.getEventManager("Dungeon" + dungeonTier + "_" + i);

                // Check that the em is not fake and that it is not running
                if (em != null && em.getProperty("running") !== "true") { break; }
                em = null; // Couldn't find one open
            }

            // Now we couldn't find any open dungeons
            if (em == null)
            {
                cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
                cm.dispose();
            }

            else // Start the new dungeon
            {
                // Create the instance of the event
                eim = em.startInstance(cm.getPlayer());

                // Start the event
                if (eim)
                {
                    // Now set properties on the instance
                    eim.setProperty("playerId", character.getId());
                    eim.setProperty("monsterId", monster.getId());
                    eim.setProperty("mapId", map.getId());
                }

                else
                {
                    cm.sendOk("The Dungeon failed to start. Please report this in the bugs section of #bDiscord#k!");
                    cm.dispose();
                }
            }
        }
    }
}