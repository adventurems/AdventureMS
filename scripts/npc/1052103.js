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

// AdventureMS Nella

function start() {
	if (cm.getQuestStatus(2213) == 2)
	{
	    cm.sendOk("If you want to know anything, I'm the person to talk to. Gossiper extraordinaire...\r\n\r\nOh you want to know more about the Mayor? Another time perhaps...");
	    cm.dispose();
	} else
	{
        cm.sendOk("So, here's the scoop.\r\n\r\nI'm Nella, I know everything about everyone. People tell me everything with the hope that I got information about what they want to know, ya get it?\r\n\r\nI don't trust you because I don't know you. You'll need someone to vouch for you...");
        cm.dispose();
	}
}