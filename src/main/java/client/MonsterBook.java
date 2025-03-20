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
package client;

import tools.DatabaseConnection;
import tools.PacketCreator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public final class MonsterBook {
    private int specialCard = 0;
    private int normalCard = 0;
    private int bookLevel = 1;
    private final Map<Integer, Integer> cards = new LinkedHashMap<>();
    private final Lock lock = new ReentrantLock();

    public Set<Entry<Integer, Integer>> getCardSet() {
        lock.lock();
        try {
            return new HashSet<>(cards.entrySet());
        } finally {
            lock.unlock();
        }
    }

    // AdventureMS Custom
    public int getCardCount(final int cardId) {
        Integer qty = cards.get(cardId);
        return (qty != null) ? qty : 0;
    }

    // AdventureMS Custom
    public void addCard(final Client c, final int cardid) {
        c.getPlayer().getMap().broadcastMessage(c.getPlayer(), PacketCreator.showForeignCardEffect(c.getPlayer().getId()), false);

        Integer qty;
        lock.lock();

        try
        {
            qty = cards.get(cardid);

            // Set Card Amount to 5
            cards.put(cardid, 5);

            // Increment the amount of cards collected
            if (cardid / 1000 >= 2388) {
                specialCard++;
            } else {
                normalCard++;
            }
        }

        finally
        {
            lock.unlock();
        }

        // Get new card collect level
        calculateLevel();

        // Announce to player and update card to max collected
        c.sendPacket(PacketCreator.addCard(false, cardid, 5));
        c.sendPacket(PacketCreator.showGainCard());
    }

    private void calculateLevel() {
        lock.lock();
        try {
            int collectionExp = (normalCard + specialCard);

            int level = 0, expToNextlevel = 1;
            do {
                level++;
                expToNextlevel += level * 10;
            } while (collectionExp >= expToNextlevel);

            bookLevel = level;
        } finally {
            lock.unlock();
        }
    }

    public int getBookLevel() {
        lock.lock();
        try {
            return bookLevel;
        } finally {
            lock.unlock();
        }
    }

    public Map<Integer, Integer> getCards() {
        lock.lock();
        try {
            return Collections.unmodifiableMap(cards);
        } finally {
            lock.unlock();
        }
    }

    public int getTotalCards() {
        lock.lock();
        try {
            return specialCard + normalCard;
        } finally {
            lock.unlock();
        }
    }

    public int getNormalCard() {
        lock.lock();
        try {
            return normalCard;
        } finally {
            lock.unlock();
        }
    }

    public int getSpecialCard() {
        lock.lock();
        try {
            return specialCard;
        } finally {
            lock.unlock();
        }
    }

    public void loadCards(final int charid) throws SQLException {
        lock.lock();
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT cardid, level FROM monsterbook WHERE charid = ? ORDER BY cardid ASC")) {
            ps.setInt(1, charid);

            try (ResultSet rs = ps.executeQuery()) {
                int cardid;
                int level;
                while (rs.next()) {
                    cardid = rs.getInt("cardid");
                    level = rs.getInt("level");
                    if (cardid / 1000 >= 2388) {
                        specialCard++;
                    } else {
                        normalCard++;
                    }
                    cards.put(cardid, level);
                }
            }
        } finally {
            lock.unlock();
        }

        calculateLevel();
    }

    public void saveCards(Connection con, int chrId) throws SQLException {
        final String query = """
                INSERT INTO monsterbook (charid, cardid, level)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE level = ?;
                """;
        try (final PreparedStatement ps = con.prepareStatement(query)) {
            for (Map.Entry<Integer, Integer> cardAndLevel : cards.entrySet()) {
                final int card = cardAndLevel.getKey();
                final int level = cardAndLevel.getValue();
                // insert
                ps.setInt(1, chrId);
                ps.setInt(2, card);
                ps.setInt(3, level);

                // update
                ps.setInt(4, level);

                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    public static int[] getCardTierSize() {
        try (Connection con = DatabaseConnection.getConnection();
             PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM monstercarddata GROUP BY floor(cardid / 1000);", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
             ResultSet rs = ps.executeQuery()) {
            rs.last();
            int[] tierSizes = new int[rs.getRow()];
            rs.beforeFirst();

            while (rs.next()) {
                tierSizes[rs.getRow() - 1] = rs.getInt(1);
            }

            return tierSizes;
        } catch (SQLException e) {
            e.printStackTrace();
            return new int[0];
        }
    }
}
