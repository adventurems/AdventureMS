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
package net.server.handlers.login;

import client.Character;
import client.MapleClient;
import config.YamlConfig;
import net.AbstractPacketHandler;
import net.packet.InPacket;
import net.server.Server;
import tools.PacketCreator;
import tools.Pair;

import java.util.List;

public final class ViewAllCharHandler extends AbstractPacketHandler {
    @Override
    public final void handlePacket(InPacket p, MapleClient c) {
        try {
            if(!c.canRequestCharlist()) {   // client breaks if the charlist request pops too soon
                c.sendPacket(PacketCreator.showAllCharacter(0, 0));
                return;
            }
            
            int accountId = c.getAccID();
            Pair<Pair<Integer, List<Character>>, List<Pair<Integer, List<Character>>>> loginBlob = Server.getInstance().loadAccountCharlist(accountId, c.getVisibleWorlds());
            
            List<Pair<Integer, List<Character>>> worldChars = loginBlob.getRight();
            int chrTotal = loginBlob.getLeft().getLeft();
            List<Character> lastwchars = loginBlob.getLeft().getRight();
            
            if (chrTotal > 9) {
                int padRight = chrTotal % 3;
                if (padRight > 0 && lastwchars != null) {
                    Character chr = lastwchars.get(lastwchars.size() - 1);
                    
                    for(int i = padRight; i < 3; i++) { // filling the remaining slots with the last character loaded
                        chrTotal++;
                        lastwchars.add(chr);
                    }
                }
            }
            
            int charsSize = chrTotal;
            int unk = charsSize + (3 - charsSize % 3); //rowSize?
            c.sendPacket(PacketCreator.showAllCharacter(charsSize, unk));
            
            for (Pair<Integer, List<Character>> wchars : worldChars) {
                c.sendPacket(PacketCreator.showAllCharacterInfo(wchars.getLeft(), wchars.getRight(), YamlConfig.config.server.ENABLE_PIC && !c.canBypassPic()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
