// AdventureMS Forge Guardian

var baseid = 106010111;
var dungeon1 = false;
var dungeon2 = false;
var dungeonid1 = 106010125;
var dungeons1 = 5;
var dungeonid2 = 106010130;
var dungeons2 = 5;

function enter(pi)
{
    // They've already defeated the guardian, warp to outdoors
    if (cm.getQuestStatus(1028) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010115, "in00");
        return true;
    }
    else if (cm.getQuestStatus(1023) === 2) {dungeon2 = true;} // They've helped Vicious, they can now fight the real boss
    else {dungeon1 = true;} // They haven't helped Vicious yet, give the impossible bosses

    // Debugging
    pi.getPlayer().yellowMessage("baseid: " + baseid + "Current Map: " + pi.getMapId());

    // Check the base map
    if (pi.getMapId() === baseid)
    {
        // Check their party
        if (pi.getParty() != null)
        {
            pi.playerMessage(5, "You must face the test alone!");
            return false;
        }

        // Party is empty, enter the vault
        else
        {
            if (dungeon1)
            {
                for (var i = 0; i < dungeons1; i++)
                {
                    if(pi.startDungeonInstance(dungeonid1 + i))
                    {
                        pi.playPortalSound();
                        pi.warp(dungeonid1 + i, "out00");
                        pi.playerMessage(5, "The Forge Guardian is protecting the Forge!");
                        pi.resetMapObjects(dungeonid1 + i);
                        pi.spawnMonster(8644814, -1024, -479);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.playerMessage(5, "All instances are currently occupied, just a moment!");
                return false;
            }

            else if (dungeon2)
            {
                for (var i = 0; i < dungeons2; i++)
                {
                    if(pi.startDungeonInstance(dungeonid2 + i))
                    {
                        pi.playPortalSound();
                        pi.warp(dungeonid2 + i, "out00");
                        pi.playerMessage(5, "The Forge Guardians are blocking the way!");
                        pi.resetMapObjects(dungeonid2 + i);
                        pi.spawnMonster(8644815, -1069, -46);
                        pi.spawnMonster(8644816, -1089, -680);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.playerMessage(5, "All instances are currently occupied, just a moment!");
                return false;
            }

            else
            {
                // No open maps, tell the player it's occupied
                pi.playerMessage(5, "Chamber event broken, report in #bDiscord#k!");
                return false;
            }
        }
    }

    // Leaving the chamber
    else
    {
        var map = pi.getMapId();
        pi.resetMapObjects(map);
        pi.getMap().clearDrops();
        pi.playPortalSound();
        pi.warp(baseid, "in00");
        return true;
    }
}