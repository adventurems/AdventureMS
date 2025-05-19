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

import client.Character;
import client.Client;
import client.inventory.Equip;
import client.inventory.Item;
import config.YamlConfig;
import net.AbstractPacketHandler;
import net.packet.InPacket;
import net.server.Server;
import scripting.npc.NPCScriptManager;
import scripting.quest.QuestScriptManager;
import server.MTSItemInfo;
import server.maps.FieldLimit;
import server.maps.MiniDungeonInfo;
import tools.DatabaseConnection;
import tools.PacketCreator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public final class EnterMTSHandler extends AbstractPacketHandler {

    @Override
    public void handlePacket(InPacket p, Client c)
    {
        // Non-Usable Maps
        int[] badMaps =
                {
                        1010200, // Bob's Domain
                        1010201, // Bob's Domain
                        1010202, // Bob's Domain
                        1010203, // Bob's Domain
                        1010204, // Bob's Domain
                        100000003, // Off the beaten path
                        100000005, // Someone Else's House
                        103000910, // King Slime
                        103000911, // King Slime
                        103000912, // King Slime
                        103000913, // King Slime
                        260020100, // The Peak
                        260020101, // The Peak
                        260020102, // The Peak
                        198000100, // The Vault
                        198000101, // The Vault
                        198000102, // The Vault
                        198000103, // The Vault
                        198000104, // The Vault
                        198000105, // The Vault
                        100000203, // Kora City
                        300000012, // Jail
                        106010140, // Far Side of Florina
                        106010141, // Treasure Hunt #1
                        106010142, // Treasure Hunt #1
                        106010143, // Treasure Hunt #1
                        106010144, // Treasure Hunt #1
                        106010145, // Treasure Hunt #1
                        106010146, // Treasure Hunt #1
                        106010147, // Treasure Hunt #1
                        106010148, // Treasure Hunt #1
                        106010149, // Shipwreck
                        106010150, // Treasure Hunt #1
                        106010125, // Guardians Chamber
                        106010126, // Guardians Chamber
                        106010127, // Guardians Chamber
                        106010128, // Guardians Chamber
                        106010129, // Guardians Chamber
                        106010130, // Guardians Chamber
                        106010131, // Guardians Chamber
                        106010132, // Guardians Chamber
                        106010133, // Guardians Chamber
                        106010134 // Guardians Chamber
                };

        // Current Map
        int playerMap = c.getPlayer().getMapId();

        // Check if we are in a badMap
        boolean isBadMap = false;

        // Check if map ID is in the range 3000000 to 4000000 (inclusive of 3000000 but not 4000000)
        if (playerMap >= 3000000 && playerMap < 4000000) {
            isBadMap = true;
        } else {
            // Check individual bad maps
            for (int badMap : badMaps) {
                if (playerMap == badMap) {
                    isBadMap = true;
                    break;  // No need to check further once we find a match
                }
            }
        }

        // Evaluate badMap
        if (isBadMap)
        {
            c.getPlayer().yellowMessage("You cannot move to move to Kora City from this map!");
            NPCScriptManager.getInstance().dispose(c);
            QuestScriptManager.getInstance().dispose(c);
            c.sendPacket(PacketCreator.enableActions());
            c.removeClickedNPC();
        }

        // Make the warp
        else
        {
            // Store Current Map
            c.getPlayer().saveLocation("FREE_MARKET");

            // Warp to FM Entrance
            c.getPlayer().changeMap(100000203, "out00");
        }
    }
}
