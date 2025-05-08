/*
MiniDungeon - The Vault
*/ 

var baseid = 198000000;
var dungeonid = 198000100;
var singledungeons = 3;

function enter(pi)
{
    // Get the players job
    var job = pi.getPlayer().getJob();

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
                for (var i = 0; i < singledungeons; i++)
                {
                    if(pi.startDungeonInstance(dungeonid + i))
                    {
                        pi.playPortalSound();
                        pi.warp(dungeonid + i, "west00");
                        pi.playerMessage(5, "The vault is protected, you must battle your way through!");
                        pi.resetMapObjects(dungeonid + i);
                        pi.spawnMonster(9400633, 954, 200);
                        return true;
                    }
                }

                // No open maps, tell the player it's occupied
                pi.playerMessage(5, "All vault instances are currently occupied, just a moment!");
                return false;
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