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
package net.server.channel.handlers;

import client.MapleClient;
import net.AbstractMaplePacketHandler;
import net.opcodes.SendOpcode;
import net.packet.OutPacket;
import tools.data.input.SeekableLittleEndianAccessor;

public final class NPCAnimationHandler extends AbstractMaplePacketHandler {
    @Override
    public final void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c) {
        if (c.getPlayer().isChangingMaps()) {   // possible cause of error 38 in some map transition scenarios, thanks Arnah
            return;
        }

        OutPacket p = OutPacket.create(SendOpcode.NPC_ACTION);
        int length = (int) slea.available();
        if (length == 6) { // NPC Talk
            p.writeInt(slea.readInt());
            p.writeByte(slea.readByte());   // 2 bytes, thanks resinate
            p.writeByte(slea.readByte());
        } else if (length > 6) { // NPC Move
            byte[] bytes = slea.read(length - 9);
            p.writeBytes(bytes);
        }
        c.sendPacket(p);
    }
}
