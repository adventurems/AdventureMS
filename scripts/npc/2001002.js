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

/* 2001002 - Metal Bucket Snowman
    @author Ronan
 */

// Old Snowman
/*
var status = -1;

function start() { 
    action(1, 0, 0);
} 
function action(mode, type, selection) { 
    if (mode < 0)
        cm.dispose();
    else {
        if (mode == 1)
            status++;
        else
            status--;
        
        if (status == 0) {
            cm.sendYesNo("We have a beautiful christmas tree.\r\nDo you want to see/decorate it?");
        } else if(status == 1) {
            cm.warp(209000002);
            cm.dispose();
        }
    }
} */

// AdventureMS
function start() {
	if (cm.getQuestStatus(2217) == 2)
	{
	    cm.sendOk("Ya know, it's not so bad around here after cleaning up the pollution. I actually stay pretty white now.\r\n\r\nThanks for getting Gold Richie out of here and helping with the trash...");
	    cm.dispose();
	} else
	{
        cm.sendOk("Don't ask questions, I don't know why either. I'm the god damn garbageman around here, Frosty...");
        cm.dispose();
	}
}