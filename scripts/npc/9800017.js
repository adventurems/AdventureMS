// AdventureMS Dungeon Portal

// Import the classes
var MapleMap = Java.type('server.maps.MapleMap');
var LifeFactory = Java.type('server.life.LifeFactory');

// Additional Variables
var dungeonTier = 1;
var solo = false;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    if (status == 0)
    {
        // Get NPC data using the NPC's object ID
        var npcData = MapleMap.getNpcData(cm.getNpcObjectId());
        var party = npcData.get("party");
        var player = npcData.get("player");
        var monsterLvl = LifeFactory.getMonsterLevel(npcData.get("monster"));

        // Check if they are solo
        if (party === -1) {solo = true;}

        // Check that they are in real party
        if (party != -1)
        {
            // Check that they are in the party that spawned this portal
            if (party === cm.getPlayer().getPartyId())
            {
                // Check that they are the leader of the party
                if (cm.getPlayer().isPartyLeader())
                {
                    // Determine the tier of the Dungeon
                    // if (monsterLvl < 32) {dungeonTier = 1;}
                    // else if (monsterLvl < 32) {dungeonTier = 2;}
                    // else {dungeonTier = 3;}

                    // Check for ready
                    cm.sendYesNo("Is your party ready to enter the Dungeon?");
                }

                // They aren't the party leader
                else
                {
                    cm.sendOk("Please have your party leader talk to me!");
                    cm.dispose();
                }
            }

            // They are not in the party that spawned the portal
            else
            {
                cm.sendOk("You are not in the party that spawned this portal!");
                cm.dispose();
            }
        }

        // They are not in the party that spawned this portal, see if they are solo
        else if (cm.getPlayer().getId() === player)
        {
            // Check for ready
            cm.sendYesNo("Are you ready to enter the Dungeon?");
        }

        // They didn't spawn the portal and they are not in the party that did
        else
        {
            cm.sendOk("You are not in the party that spawned this portal!");
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

        // If not solo, start the party instance of the Dungeon
        if (!solo)
        {
            // Error Checking
            if (em == null)
            {
                cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
            }

            // Create the instance of the event
            else if (!em.startInstance(cm.getPlayer().getParty(), cm.getMap(), 1, monster, cm.getPlayer().getMapId()))
            {
                cm.sendOk("The Dungeon failed to start. Please report this in the bugs section of #bDiscord#k!");
            }
        }

        // If solo, start the player instance of the Dungeon
        else
        {
            // Error Checking
            if (em == null)
            {
                cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
            }

            // Create the instance of the event
            else if (!em.startInstance(cm.getPlayer(), cm.getMap(), 1, monster, cm.getPlayer().getMapId()))
            {
                cm.sendOk("The Dungeon failed to start (solo). Please report this in the bugs section of #bDiscord#k!");
            }
        }

        // Dispose no matter what
        cm.dispose();
    }
}