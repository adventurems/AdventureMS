        /*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Author: Pepa

// AdventureMS

function start() {
	if (cm.getQuestStatus(2217) == 2)
	{
	    cm.sendOk("I'm still trying to get back on my feet, physically and financially. Maybe you would be up for a jum...Ah nevermind. I'll make the money up somewhere else...\r\n\r\nWhy are you staring?");
	    cm.dispose();
	} else
	{
        cm.sendOk("I'm okay, it's alright. I fell over when the earthquake hit. I think my money fell through the sewer grate into the subway...\r\n\r\nI hope everyone else is okay...");
        cm.dispose();
	}
}