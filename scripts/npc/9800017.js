// AdventureMS Dungeon Portal

// Import the MapleMap class
var MapleMap = Java.type('server.maps.MapleMap');
var LifeFactory = Java.type('server.life.LifeFactory');

// Additional Variables
var dungeonTier = 1;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    if (status == 0)
    {
        // Get NPC data using the NPC's object ID
        var npcData = MapleMap.getNpcData(cm.getNpcObjectId());
        var party = npcData.get("party");
        var monsterLvl = LifeFactory.getMonsterLevel(npcData.get("monster"));

        // Check that they are in the correct party
        if (party === cm.getPlayer().getPartyId())
        {
            // Check that they are the leader of the party
            if (cm.getPlayer().isPartyLeader())
            {
                // Determine the tier of the Dungeon
                // if (monsterLvl < 32) {dungeonTier = 1;}
                // else if (monsterLvl < 32) {dungeonTier = 2;}
                // else {dungeonTier = 3;}

                // Send first message
                cm.sendYesNo("Is your party ready to enter the Dungeon?");
            }

            // They aren't the party leader
            else
            {
                cm.sendOk("Please have your party leader talk to me! If you are solo, please create a party before talking to me.");
                cm.dispose();
            }
        }

        // They are not in the party that spawned this portal
        else
        {
            cm.sendOk("You are not part of the party that spawned this portal!");
            cm.dispose();
        }
    }

    // They want in the dungeon
    else if (status == 1)
    {
        // Get NPC data using the NPC's object ID
        var npcData = MapleMap.getNpcData(cm.getNpcObjectId());
        var monster = npcData.get("monster");

        // Assign the next EventManager
        em = cm.getEventManager("Dungeon" + dungeonTier);

        // Error Checking
        if (em == null)
        {
            cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
            cm.dispose();
        }

        // Create the instance of the event
        else (!em.startInstance(cm.getPlayer().getParty(), cm.getMap(), 1, monster, cm.getPlayer().getMapId()))
        {
            cm.sendOk("The Dungeon failed to start. Please report this in the bugs section of #bDiscord#k!");
        }

        // Dispose no matter what
        cm.dispose();
    }
}