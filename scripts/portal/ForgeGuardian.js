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
    // Add debugging
    pi.getPlayer().yellowMessage("1028 Status: " + pi.getQuestStatus(1028) + "| 1023 Status: " + pi.getQuestStatus(1023));

    // They've already defeated the guardian, warp to outdoors
    if (pi.getQuestStatus(1028) === 2)
    {
        pi.getPlayer().yellowMessage("Quest 1028 completed. Warping to outdoors map 106010115.");
        pi.playPortalSound();
        pi.warp(106010115, "in00");
        return true;
    }
    else if (pi.getQuestStatus(1023) === 2) 
    {
        dungeon2 = true;
        pi.getPlayer().yellowMessage("Quest 1023 completed. Setting target to real boss dungeon (dungeon2).");
    } // They've helped Vicious, they can now fight the real boss
    else 
    {
        dungeon1 = true;
        pi.getPlayer().yellowMessage("Quests incomplete. Setting target to impossible boss dungeon (dungeon1).");
    } // They haven't helped Vicious yet, give the impossible bosses

    // Check the base map
    var currentMap = pi.getMapId();
    pi.getPlayer().yellowMessage("Current map: " + currentMap + ", Base map: " + baseid);
    if (currentMap === baseid)
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
                pi.getPlayer().yellowMessage("Attempting to enter dungeon1 (impossible boss dungeon)");
                for (var i = 0; i < dungeons1; i++)
                {
                    var targetMap = dungeonid1 + i;
                    pi.getPlayer().yellowMessage("Trying to create dungeon instance at map: " + targetMap);
                    if(pi.startDungeonInstance(targetMap))
                    {
                        pi.getPlayer().yellowMessage("Dungeon instance created successfully at map: " + targetMap);
                        pi.playPortalSound();
                        pi.warp(targetMap, "in00");
                        pi.playerMessage(5, "The Forge Guardian is protecting the Forge!");
                        pi.resetMapObjects(targetMap);
                        pi.getPlayer().yellowMessage("Spawning monster 8644814 at map: " + targetMap);
                        pi.spawnMonster(8644814, -1024, -479);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.getPlayer().yellowMessage("Failed to create dungeon instance - all instances occupied");
                pi.playerMessage(5, "All instances are currently occupied, just a moment!");
                return false;
            }

            else if (dungeon2)
            {
                pi.getPlayer().yellowMessage("Attempting to enter dungeon2 (real boss dungeon)");
                for (var i = 0; i < dungeons2; i++)
                {
                    var targetMap = dungeonid2 + i;
                    pi.getPlayer().yellowMessage("Trying to create dungeon instance at map: " + targetMap);
                    if(pi.startDungeonInstance(targetMap))
                    {
                        pi.getPlayer().yellowMessage("Dungeon instance created successfully at map: " + targetMap);
                        pi.playPortalSound();
                        pi.warp(targetMap, "in00");
                        pi.playerMessage(5, "The Forge Guardians are blocking the way!");
                        pi.resetMapObjects(targetMap);
                        pi.getPlayer().yellowMessage("Spawning monsters 8644815 and 8644816 at map: " + targetMap);
                        pi.spawnMonster(8644815, -1069, -46);
                        pi.spawnMonster(8644816, -1089, -680);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.getPlayer().yellowMessage("Failed to create dungeon instance - all instances occupied");
                pi.playerMessage(5, "All instances are currently occupied, just a moment!");
                return false;
            }

            else
            {
                // No open maps, tell the player it's occupied
                pi.getPlayer().yellowMessage("Error: Neither dungeon1 nor dungeon2 is set - chamber event broken");
                pi.playerMessage(5, "Chamber event broken, report in #bDiscord#k!");
                return false;
            }
        }
    }

    // Leaving the chamber
    else
    {
        // Update currentMap value before leaving
        currentMap = pi.getMapId();
        pi.getPlayer().yellowMessage("Leaving chamber from map: " + currentMap + " to base map: " + baseid);
        pi.resetMapObjects(currentMap);
        pi.getMap().clearDrops();
        pi.playPortalSound();
        pi.warp(baseid, "in00");
        return true;
    }
}
