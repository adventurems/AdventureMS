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
Inside Vault - Mob Check
*/

function enter(pi)
{
    if (pi.getPlayer().getMapId() < 198000103)
    {
        // Check for specific mob ID 9400633 for maps below 198000103
        if (pi.getPlayer().getMap().getMonsterById(9400633) == null)
        {
            pi.playPortalSound();
            pi.warp(198000105, "st00");
            return true;
        }
        else
        {
            pi.playerMessage(5, "Astaroth still stands, defeat the vault protector!");
            return false;
        }
    }
    else
    {
        // Check for any monsters for other maps
        if (pi.getPlayer().getMap().countMonsters() == 0)
        {
            pi.playPortalSound();
            pi.warp(198000105, "st00");
            return true;
        }
        else
        {
            pi.playerMessage(5, "The cursed adventurers still stand, defeat the vault protectors!");
            return false;
        }
    }
}