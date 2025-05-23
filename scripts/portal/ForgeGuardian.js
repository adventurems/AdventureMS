// AdventureMS Forge Guardian

var baseid = 106010111;
var baseDungeonId = 106010125;
var finalDungeonId = 106010130;
var baseDungeons = 5;
var finalDungeons = 5;

function enter(pi)
{
    // They've already defeated the guardian, warp to outdoors
    if (pi.getQuestStatus(1028) === 2)
    {
        pi.playPortalSound();
        pi.warp(106010115, "in00");
        return true;
    }

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
            // Check if they have the hammer
            if (pi.haveItemWithId(1422500, true))
            {
                for (var i = 0; i < finalDungeons; i++)
                {
                    if(pi.startDungeonInstance(finalDungeonId + i))
                    {
                        pi.playPortalSound();
                        pi.warp(finalDungeonId + i, "in00");
                        pi.playerMessage(5, "The Forge Guardians are blocking the way!");
                        pi.resetMapObjects(finalDungeonId + i);
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
                for (var i = 0; i < baseDungeons; i++)
                {
                    if(pi.startDungeonInstance(baseDungeonId + i))
                    {
                        pi.playPortalSound();
                        pi.warp(baseDungeonId + i, "in00");
                        pi.playerMessage(5, "The Forge Guardian is protecting the Forge!");
                        pi.resetMapObjects(baseDungeonId + i);
                        pi.spawnMonster(8644814, -1024, -479);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.playerMessage(5, "All instances are currently occupied, just a moment!");
                return false;
            }
        }
    }

    // Leaving the chamber
    else
    {
        pi.resetMapObjects(pi.getMapId());
        pi.getMap().clearDrops();
        pi.playPortalSound();
        pi.warp(baseid, "in00");
        return true;
    }
}