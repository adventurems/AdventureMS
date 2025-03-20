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

// AdventureMS Jane Doe

function start() {
	if (cm.getQuestStatus(2072) == 2)
	{
	    cm.sendOk("Thanks again for helping out. Well at least I know the truth now...\r\n\r\nTake care of that #rFashionista#k card, someone else might want it...");
	    cm.dispose();
	} else
	{
        cm.sendOk("It's...so...cold. I can't see much, but neither can that so called doctor.");
        cm.dispose();
	}
}