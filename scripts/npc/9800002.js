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

// AdventureMS - Rinne - Ancient Coin Trader

var status;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    else if (status == 0)
    {
        // Check to see if the introduction has occurred
        if(cm.getQuestStatus(1002) < 2)
        {
            // Send Explanation of Coin System
            cm.sendOk("Hey #h #!\r\n\r\nI've come from quite far away to find these coins... I thought I was in for the hunt of my life!\r\n\r\nInstead though, what I arrived to was a large group of aspiring adventurers like you. You're all runnin, whackin everything, 'defeat this', 'defeat that'... On and on! You never stop! That works out great for me!\r\n\r\nAs you get stronger, so will my resources, for now though, I've started you out with some basic scrolls. Basic, from my world, but #rvery strong for yours#k!\r\n\r\nTake a look as even the 100%'s are stronger than what you are used to!");
            cm.completeQuest(1002);
            cm.dispose();
        }

        else
        {
            // Normal experience, ask which shop they want to open
            cm.sendSimple("Which shop would you like to see?\r\n\r\n#L0#100% Scrolls#l\r\n#L1#60% Scrolls#l\r\n#L2#10% Scrolls#l");
        }
    }
    else if (status == 1)
    {
        // Open 100% Scrolls
        if (selection == 0)
        {
            cm.openShopNPC(3000);
            cm.dispose();
        }

        // Open 60% Scrolls
        else if (selection == 1)
        {
            cm.openShopNPC(3001);
            cm.dispose();
        }

        // Open 10% Scrolls
        else if (selection == 2)
        {
            cm.openShopNPC(3002);
            cm.dispose();
        }

        // Something else happened?
        cm.dispose();
    }
}