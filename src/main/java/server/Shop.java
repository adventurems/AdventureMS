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
package server;

import client.Client;
import client.inventory.Equip;
import client.inventory.InventoryType;
import client.inventory.Item;
import client.inventory.Pet;
import client.inventory.manipulator.InventoryManipulator;
import constants.id.ItemId;
import constants.inventory.ItemConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.DatabaseConnection;
import tools.PacketCreator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * @author Matze
 */
public class Shop {
    private static final Logger log = LoggerFactory.getLogger(Shop.class);
    private static final Set<Integer> rechargeableItems = new LinkedHashSet<>();

    private final int id;
    private final int npcId;
    private final List<ShopItem> items;
    private final int tokenvalue = 1000000000;
    private final int token = ItemId.GOLDEN_MAPLE_LEAF;

    static {
        for (int throwingStarId : ItemId.allThrowingStarIds()) {
            rechargeableItems.add(throwingStarId);
        }
        rechargeableItems.add(ItemId.BLAZE_CAPSULE);
        rechargeableItems.add(ItemId.GLAZE_CAPSULE);
        rechargeableItems.add(ItemId.BALANCED_FURY);
        rechargeableItems.remove(ItemId.DEVIL_RAIN_THROWING_STAR); // doesn't exist
        for (int bulletId : ItemId.allBulletIds()) {
            rechargeableItems.add(bulletId);
        }
    }

    private Shop(int id, int npcId) {
        this.id = id;
        this.npcId = npcId;
        items = new ArrayList<>();
    }

    private void addItem(ShopItem item) {
        items.add(item);
    }

    public void sendShop(Client c) {
        c.getPlayer().setShop(this);
        c.sendPacket(PacketCreator.getNPCShop(c, getNpcId(), items));
    }

    public void buy(Client c, short slot, int itemId, short quantity) {
        ShopItem item = findBySlot(slot);
        if (item != null) {
            if (item.getItemId() != itemId) {
                log.warn("Wrong slot number in shop {}", id);
                return;
            }
        } else {
            return;
        }
        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        if (item.getPrice() > 0) {
            int amount = (int) Math.min((float) item.getPrice() * quantity, Integer.MAX_VALUE);
            if (c.getPlayer().getMeso() >= amount) {
                if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (!ItemConstants.isRechargeable(itemId)) { //Pets can't be bought from shops
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                        c.getPlayer().gainMeso(-amount, false);
                    } else {
                        short slotMax = ii.getSlotMax(c, item.getItemId());
                        quantity = slotMax;
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                        c.getPlayer().gainMeso(-item.getPrice(), false);
                    }
                    c.sendPacket(PacketCreator.shopTransaction((byte) 0));
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                }

            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 2));
            }

        } else if (item.getPitch() > 0) {
            int amount = (int) Math.min((float) item.getPitch() * quantity, Integer.MAX_VALUE);

            if (c.getPlayer().getInventory(InventoryType.ETC).countById(ItemId.PERFECT_PITCH) >= amount) {
                if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (!ItemConstants.isRechargeable(itemId)) {
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                        InventoryManipulator.removeById(c, InventoryType.ETC, ItemId.PERFECT_PITCH, amount, false, false);
                    } else {
                        short slotMax = ii.getSlotMax(c, item.getItemId());
                        quantity = slotMax;
                        InventoryManipulator.addById(c, itemId, quantity, "", -1);
                        InventoryManipulator.removeById(c, InventoryType.ETC, ItemId.PERFECT_PITCH, amount, false, false);
                    }
                    c.sendPacket(PacketCreator.shopTransaction((byte) 0));
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                }
            }

        } else if (c.getPlayer().getInventory(InventoryType.CASH).countById(token) != 0) {
            int amount = c.getPlayer().getInventory(InventoryType.CASH).countById(token);
            int value = amount * tokenvalue;
            int cost = item.getPrice() * quantity;
            if (c.getPlayer().getMeso() + value >= cost) {
                int cardreduce = value - cost;
                int diff = cardreduce + c.getPlayer().getMeso();
                if (InventoryManipulator.checkSpace(c, itemId, quantity, "")) {
                    if (ItemConstants.isPet(itemId)) {
                        int petid = Pet.createPet(itemId);
                        InventoryManipulator.addById(c, itemId, quantity, "", petid, -1);
                    } else {
                        InventoryManipulator.addById(c, itemId, quantity, "", -1, -1);
                    }
                    c.getPlayer().gainMeso(diff, false);
                } else {
                    c.sendPacket(PacketCreator.shopTransaction((byte) 3));
                }
                c.sendPacket(PacketCreator.shopTransaction((byte) 0));
            } else {
                c.sendPacket(PacketCreator.shopTransaction((byte) 2));
            }
        }
    }

    private static boolean canSell(Item item, short quantity) {
        if (item == null) { //Basic check
            return false;
        }

        short iQuant = item.getQuantity();
        if (iQuant == 0xFFFF) {
            iQuant = 1;
        } else if (iQuant < 0) {
            return false;
        }

        if (!ItemConstants.isRechargeable(item.getItemId())) {
            return iQuant != 0 && quantity <= iQuant;
        }

        return true;
    }

    private static short getSellingQuantity(Item item, short quantity) {
        if (ItemConstants.isRechargeable(item.getItemId())) {
            quantity = item.getQuantity();
            if (quantity == 0xFFFF) {
                quantity = 1;
            }
        }

        return quantity;
    }

    // AdventureMS Custom
    public void sell(Client c, InventoryType type, short slot, short quantity)
    {
        // Ensure we have at least one to sell
        if (quantity == 0xFFFF || quantity == 0)
        {
            quantity = 1;
        }

        // Item doesn't actually exist, stop
        else if (quantity < 0)
        {
            return;
        }

        // Store the item object
        Item item = c.getPlayer().getInventory(type).getItem(slot);

        // Make sure we can sell it
        if (canSell(item, quantity))
        {
            // Set the quantity to sell (if it's rechargeable or multiple)
            quantity = getSellingQuantity(item, quantity);

            // Remove the item and all of the quantity suggested
            InventoryManipulator.removeFromSlot(c, type, (byte) slot, quantity, false);

            ItemInformationProvider ii = ItemInformationProvider.getInstance();

            // Find and store the price of the item
            int recvMesos = ii.getPrice(item.getItemId(), quantity);

            // If there is a price associated with the item (in the wz) give to player
            if (recvMesos > 0)
            {
                c.getPlayer().gainMeso(recvMesos, false);
            }

            // Check to make sure it's an equip
            if (item instanceof Equip e)
            {
                // Send to buyback table
                c.getPlayer().updateBuyback(c.getPlayer().getAccountID(), e.getItemId(), e.getUpgradeSlots(), e.getLevel(), e.getStr(), e.getDex(), e.getInt(), e.getLuk(), e.getHp(), e.getMp(), e.getWatk(), e.getMatk(), e.getWdef(), e.getMdef(), e.getAcc(), e.getAvoid(), e.getHands(), e.getSpeed(), e.getJump(), e.getVicious());
            }

            // Send sale success to client
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x8));
        }

        // Can't sell, failed transaction
        else
        {
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x5));
        }
    }

    // AdventureMS Custom - Rechargeable Arrows
    public void recharge(Client c, short slot) {
        ItemInformationProvider ii = ItemInformationProvider.getInstance();
        Item item = c.getPlayer().getInventory(InventoryType.USE).getItem(slot);
        if (item == null || !ItemConstants.isRechargeable(item.getItemId())) {
            return;
        }

        short slotMax = ii.getSlotMax(c, item.getItemId());
        if (item.getQuantity() < 0) {
            return;
        }

        int currentQuantity = item.getQuantity();
        int missingAmount = slotMax - currentQuantity;
        if (missingAmount <= 0) {
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x8));
            c.getPlayer().dropMessage(1, "This item is already fully recharged.");
            return;
        }

        double unitPrice = ii.getUnitPrice(item.getItemId());
        if (unitPrice <= 0) {
            unitPrice = 1.0; // Fallback unit price
        }

        int affordableAmount = (int) Math.floor(c.getPlayer().getMeso() / unitPrice);
        int rechargeAmount = Math.min(affordableAmount, missingAmount);

        if (rechargeAmount > 0) {
            int cost = (int) Math.ceil(rechargeAmount * unitPrice);
            item.setQuantity((short) (currentQuantity + rechargeAmount));
            c.getPlayer().forceUpdateItem(item);
            c.getPlayer().gainMeso(-cost, false, true, false);
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x8));
        } else {
            c.sendPacket(PacketCreator.shopTransaction((byte) 0x2));
            c.getPlayer().dropMessage(1, "You do not have enough mesos to recharge this item.");
        }
    }

    private ShopItem findBySlot(short slot) {
        return items.get(slot);
    }

    public static Shop createFromDB(int id, boolean isShopId) {
        Shop ret = null;
        int shopId;
        try (Connection con = DatabaseConnection.getConnection()) {
            final String query;
            if (isShopId) {
                query = "SELECT * FROM shops WHERE shopid = ?";
            } else {
                query = "SELECT * FROM shops WHERE npcid = ?";
            }

            try (PreparedStatement ps = con.prepareStatement(query)) {
                ps.setInt(1, id);

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        shopId = rs.getInt("shopid");
                        ret = new Shop(shopId, rs.getInt("npcid"));
                    } else {
                        return null;
                    }
                }
            }

            try (PreparedStatement ps = con.prepareStatement("SELECT itemid, price, pitch FROM shopitems WHERE shopid = ? ORDER BY position DESC")) {
                ps.setInt(1, shopId);

                try (ResultSet rs = ps.executeQuery()) {
                    List<Integer> recharges = new ArrayList<>(rechargeableItems);
                    while (rs.next()) {
                        if (ItemConstants.isRechargeable(rs.getInt("itemid"))) {
                            ShopItem starItem = new ShopItem((short) 1, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("pitch"));
                            ret.addItem(starItem);
                            if (rechargeableItems.contains(starItem.getItemId())) {
                                recharges.remove(Integer.valueOf(starItem.getItemId()));
                            }
                        } else {
                            ret.addItem(new ShopItem((short) 1000, rs.getInt("itemid"), rs.getInt("price"), rs.getInt("pitch")));
                        }
                    }
                    for (Integer recharge : recharges) {
                        ret.addItem(new ShopItem((short) 1000, recharge, 0, 0));
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    public int getNpcId() {
        return npcId;
    }

    public int getId() {
        return id;
    }
}
