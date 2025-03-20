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

// AdventureMS Don Hwang

function start() {
	if (cm.getQuestStatus(2217) == 2)
	{
	    cm.sendOk("Hey, you're the one that took down King Slime, right?\r\n\r\nCities much better off with people like you around.\r\n\r\n*zap*!?!?! Whoa, look out. I think a fuse just blew. Damn electricity been all out of whack lately. I could've sworn I saw a squirrel get launched from the electricity pole...");
	    cm.dispose();
	} else
	{
        cm.sendOk("Don's the name, Hwang's the...Wait, that's not right...\r\n\r\nAnyways, I'm Don. I run this joint. It's not much but it's an honest living. My family migrated here from SG many moons ago.\r\n\r\nMy family owes a lot to Kerning. Kerning giveth and Kerning taketh away, is what I always say.\r\n\r\nWell, quit jib jabbin and buy something will ya?");
        cm.dispose();
	}
}