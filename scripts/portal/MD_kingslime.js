/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
MiniDungeon - King Slime
*/ 

var baseid = 103000000;
var dungeonid = 103000910;
var dungeons = 4;

// Enter the Boss Room
function enter(pi)
{
    // Check if we are on the correct map
    if (pi.getMapId() == baseid)
    {
        // Make sure the player has the key to the sewers
        if (pi.getPlayer().haveItem(3997000))
        {
            // Ensure the player is alone
            if (pi.getParty() != null)
            {
                pi.playerMessage(5, "You may only challenge the zone boss alone!");
                return false;
            }

            // They've passed all checks and they are ready to enter
            else
            {
                // Loop through and find an open room
                for (var i = 0; i < dungeons; i++)
                {
                    // If open, warp them
                    if(pi.startDungeonInstance(dungeonid + i))
                    {
                        pi.playPortalSound();
                        pi.warp(dungeonid + i, "h002");
                        pi.playerMessage(5, "Defeat King Slime before time expires!");
                        pi.resetMapObjects(dungeonid + i);
                        pi.getMap().clearDrops();
                        pi.spawnMonster(9300003, 128, 923);
                        return true;
                    }

                }

                // All maps are taken
                pi.playerMessage(5, "All instances of the zone boss are occupied, wait a few moments and try again.");
                return false;
            }
        }

        // They don't have the keys to the sewer
        else
        {
            pi.playerMessage(5, "You need the keys to the sewer. Progress the storyline!")
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
    	pi.warp(baseid, "MD00");
    	return true;
    }
}