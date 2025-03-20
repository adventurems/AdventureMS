
/*
MiniDungeon - Bob - AdventureMS
*/ 

var baseid = 104040000;
var dungeonid = 1010200;
var dungeons = 5;

function enter(pi)
{
    if (pi.getMapId() == baseid)
    {
        if (pi.getPlayer().getLevel() >= 10)
        {
            if (pi.getParty() != null)
            {
                pi.playerMessage(5, "You may only challenge the zone boss alone!");
                return false;
            }

            else
            {
                for (var i = 0; i < dungeons; i++)
                {
                    if(pi.startDungeonInstance(dungeonid + i))
                    {
                        pi.playPortalSound();
                        pi.warp(dungeonid + i, "out00");
                        pi.playerMessage(5, "Welcome to Bob's Domain. He's holding something important!");
                        pi.resetMapObjects(dungeonid + i);
                        pi.spawnMonster(9400551, 170, -745);
                        return true;
                    }
                }

                pi.playerMessage(5, "All instances of the zone boss are occupied, try again in a few moments!");
                return false;
            }
        }

        // It doesn't think we are level 10
        else
        {
            pi.playerMessage(5, "You must be level 10 to challenge the zone boss!");
            return false;
        }
    }

    // We are leaving the boss room
    else
    {
    	var map = pi.getMap();
        map.clearDrops();
    	pi.playPortalSound();
    	pi.warp(baseid, "MD00");
    	return true;
    }
}