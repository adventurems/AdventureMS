/*
MiniDungeon - The Vault
*/ 

var baseid = 198000000;
var physDungeons = 4;
var physDungeonId = 198000100;
var magDungeonId = 198000104;
var magDungeons = 1;

function enter(pi)
{
    // CHeck the base map
    if (pi.getMapId() === baseid)
    {
        // Make sure they have the key and that they haven't cleared already
        if (pi.getPlayer().haveItem(3997002) && pi.getPlayer().getZoneProgress() <= 2)
        {
            // Check their party
            if (pi.getParty() != null)
            {
                pi.playerMessage(5, "You may only access the vault alone!");
                return false;
            }

            // Party is empty, enter the vault
            else
            {
                // Get the players job
                var job = pi.getJobId();
                pi.getPlayer().yellowMessage("Job: " + job);

                // Send them to the mage dungeon
                if (job === 200)
                {
                    for (var i = 0; i < magDungeons; i++)
                    {
                        if(pi.startDungeonInstance(magDungeonId + i))
                        {
                            pi.playPortalSound();
                            pi.warp(magDungeonId + i, "west00");
                            pi.playerMessage(5, "The vault is protected, you must battle your way through!");
                            pi.resetMapObjects(magDungeonId + i);
                            pi.spawnMonster(9400634, 954, 200);
                            return true;
                        }
                    }

                    // No open maps, tell the player it's occupied
                    pi.playerMessage(5, "All vault instances are currently occupied, just a moment!");
                    return false;
                }

                // Send them to a physical dungeon
                else
                {
                    for (var i = 0; i < physDungeons; i++)
                    {
                        if(pi.startDungeonInstance(physDungeonId + i))
                        {
                            pi.playPortalSound();
                            pi.warp(physDungeonId + i, "west00");
                            pi.playerMessage(5, "The vault is protected, you must battle your way through!");
                            pi.resetMapObjects(physDungeonId + i);
                            pi.spawnMonster(9400633, 954, 200);
                            return true;
                        }
                    }

                    // No open maps, tell the player it's occupied
                    pi.playerMessage(5, "All vault instances are currently occupied, just a moment!");
                    return false;
                }
            }
        }

        else if (pi.getPlayer().getZoneProgress() >= 3)
        {
                pi.playerMessage(5, "You have already cleared the vault!");
                return false;
        }


        else
        {
            pi.playerMessage(5, "You need the Black Vault Key!")
            return false;
        }
    }

    // Leaving the dungeon
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