// AdventureMS Dungeon Portal

// Import the classes
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
        var player = npcData.get("player");
        var monsterLvl = LifeFactory.getMonsterLevel(npcData.get("monster"));

        // Determine the tier of the Dungeon
        dungeonTier = 1;

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
                    if (monsterLvl <= 38) {dungeonTier = 1;}
                    else if (monsterLvl <= 46) {dungeonTier = 2;}
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
            // Check that they are the leader of the party
            if (cm.getPlayer().isPartyLeader())
            {
                // Check for ready
                cm.sendYesNo("Are you ready to enter the Dungeon?");
            }

            else
            {
                cm.sendOk("Please create a party, prior to starting the dungeon.");
                cm.dispose();
            }
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
        // Store the Object ID
        var npcOID = cm.getNpcObjectId();

        // Get NPC data using the NPC's object ID
        var npcData = MapleMap.getNpcData(npcOID);
        var monster = npcData.get("monster");

        // Assign the next EventManager
        em = cm.getEventManager("Dungeon" + dungeonTier);

        // Error Checking
        if (em == null)
        {
            cm.sendOk("The Dungeon returned an empty instance. Please report this in the bugs section of #bDiscord#k!");
        }

        // Create the instance of the events
        else
        {
            // Get the party and set eligible members
            var party = cm.getPlayer().getParty();
            var eligibleMembers = [];

            // Get all party members in the same map
            var partyMembers = party.getPartyMembersOnline();
            for (var i = 0; i < partyMembers.size(); i++) {
                var member = partyMembers.get(i);
                if (member.getMapId() == cm.getPlayer().getMapId()) {
                    eligibleMembers.push(member);
                }
            }

            // Set the eligible members before starting the instance
            party.setEligibleMembers(eligibleMembers);

            // Remove this NPC
            cm.getMap().removeDungeonPortal(npcOID);

            // Attempt to start the dungeon
            if (!em.startInstance(party, cm.getMap(), partyMembers.size(), 9402050, cm.getPlayer().getMapId()))
            {
                cm.sendOk("The Dungeon failed to start. Please report this in the bugs section of #bDiscord#k!");
            }
        }

        // Dispose no matter what
        cm.dispose();
    }
}