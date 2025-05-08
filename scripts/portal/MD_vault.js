/*
MiniDungeon - The Vault
*/ 

var baseid = 198000000;
var dungeonid = 198000100;
var singledungeons = 3;
var multidungeons = 5;

function enter(pi) {
    var job = pi.getPlayer().getJob();
    if (pi.getMapId() === baseid)
    {
        if (pi.getPlayer().haveItem(3997002) && pi.getPlayer().getZoneProgress() <= 2)
        {
            if (pi.getParty() != null)
            {
                pi.playerMessage(5, "You may only access the vault alone!");
                return false;
            }
            else
            {
                if (job === "MAGICIAN" || job === "BOWMAN" || job === "THIEF" || job === "PIRATE" || job === "WARRIOR")
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
                else
                {
                    for (var i = 3; i < multidungeons; i++)
                    {
                        if(pi.startDungeonInstance(dungeonid + i))
                        {
                            pi.playPortalSound();
                            pi.warp(dungeonid + i, "west00");
                            pi.playerMessage(5, "The vault is protected, you must battle your way through!");
                            pi.resetMapObjects(dungeonid + i);
                            pi.spawnMonster(9400609, 920, 200);
                            pi.spawnMonster(9400610, 935, 200);
                            pi.spawnMonster(9400611, 950, 200);
                            pi.spawnMonster(9400612, 965, 200);
                            pi.spawnMonster(9400613, 980, 200);
                            return true;
                        }
                    }

                    // No open maps, tell the player it's occupied
                    pi.playerMessage(5, "All vault instances are currently occupied, just a moment!");
                    return false;
                }
            }
        } else
        {
            if (pi.getPlayer().getZoneProgress() >= 3)
            {
                pi.playerMessage(5, "You have already cleared the vault!");
                return false;
            } else
            {
                pi.playerMessage(5, "You need the Black Vault Key!")
                return false;
            }
        }
    } else
    {
    	var map = pi.getMapId();
        pi.resetMapObjects(map);
        pi.getMap().clearDrops();
    	pi.playPortalSound();
    	pi.warp(baseid, "in00");
    	return true;
    }
}