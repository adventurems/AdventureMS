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

// AdventureMS Dr. Faymus

function start() {
	if (cm.getQuestStatus(2217) == 2)
	{
	    cm.sendOk("I guess this is my life now, upside down and all. At least I'm not banging my head on the ground when the earth shakes anymore. Thanks for taking out the king!");
	    cm.dispose();
	} else if (cm.getQuestStatus(2062) == 2 || cm.getQuestStatus(28271) == 2)
	{
        cm.sendOk("Icarus is a great kid, thanks for helping him out with his troubles!\r\n\r\nStill stuck upside down... Not sure what to do here.");
        cm.dispose();
	} else {
	    cm.sendOk("Hmmmmmm...yes...this with that and that with this and...upside down...damn!\r\n\r\nMy nephew, Icarus, is having a rough week, he could use some help...");
        cm.dispose();
	}
}