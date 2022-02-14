/*
    This file is part of the HeavenMS MapleStory Server, commands OdinMS-based
    Copyleft (L) 2016 - 2019 RonanLana

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

/*
   @Author: Arthur L - Refactored command content into modules
*/
package client.command.commands.gm3;

import client.Character;
import client.Client;
import client.command.Command;
import io.netty.buffer.Unpooled;
import net.PacketHandler;
import net.PacketProcessor;
import net.packet.ByteBufInPacket;
import net.packet.InPacket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.HexTool;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

public class PeCommand extends Command {
    {
        setDescription("Handle synthesized packets from file, and handle them as if sent from a client");
    }

    private static final Logger log = LoggerFactory.getLogger(PeCommand.class);

    @Override
    public void execute(Client c, String[] params) {
        Character player = c.getPlayer();
        String packet = "";
        try {
            InputStreamReader is = new FileReader("pe.txt");
            Properties packetProps = new Properties();
            packetProps.load(is);
            is.close();
            packet = packetProps.getProperty("pe");
        } catch (IOException ex) {
            ex.printStackTrace();
            player.yellowMessage("Failed to load pe.txt");
            return;

        }

        byte[] packetContent = HexTool.toBytes(packet);
        InPacket inPacket = new ByteBufInPacket(Unpooled.wrappedBuffer(packetContent));
        short packetId = inPacket.readShort();
        final PacketHandler packetHandler = PacketProcessor.getProcessor(0, c.getChannel()).getHandler(packetId);
        if (packetHandler != null && packetHandler.validateState(c)) {
            try {
                player.yellowMessage("Receiving: " + packet);
                packetHandler.handlePacket(inPacket, c);
            } catch (final Throwable t) {
                final String chrInfo = player != null ? player.getName() + " on map " + player.getMapId() : "?";
                log.warn("Error in packet handler {}. Chr {}, account {}. Packet: {}", packetHandler.getClass().getSimpleName(),
                        chrInfo, c.getAccountName(), packet, t);
            }
        }
    }
}
