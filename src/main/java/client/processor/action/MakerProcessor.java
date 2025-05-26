/*
    This file is part of the HeavenMS MapleStory Server
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
package client.processor.action;

import client.Character;
import client.Client;
import client.inventory.Equip;
import client.inventory.InventoryType;
import client.inventory.Item;
import client.inventory.manipulator.InventoryManipulator;
import config.YamlConfig;
import constants.game.GameConstants;
import constants.id.ItemId;
import constants.inventory.ItemConstants;
import net.packet.InPacket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.ItemInformationProvider;
import server.MakerItemFactory;
import server.MakerItemFactory.MakerItemCreateEntry;
import tools.PacketCreator;
import tools.Pair;
import tools.Randomizer;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author Ronan
 */
public class MakerProcessor {
    private static final Logger log = LoggerFactory.getLogger(MakerProcessor.class);
    private static final ItemInformationProvider ii = ItemInformationProvider.getInstance();

    public static void makerAction(InPacket p, Client c) {
        if (c.tryacquireClient()) {
            try {
                int type = p.readInt();
                int toCreate = p.readInt();
                int toDisassemble = -1, pos = -1;
                boolean makerSucceeded = true;
                boolean isDivineForge = false;

                MakerItemCreateEntry recipe;
                Map<Integer, Short> reagentids = new LinkedHashMap<>();
                int stimulantid = -1;

                if (type == 3) {    // building monster crystal
                    int fromLeftover = toCreate;
                    toCreate = ii.getMakerCrystalFromLeftover(toCreate);
                    if (toCreate == -1) {
                        c.sendPacket(PacketCreator.serverNotice(1, ii.getName(fromLeftover) + " is unavailable for Monster Crystal conversion."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        return;
                    }

                    recipe = MakerItemFactory.generateLeftoverCrystalEntry(fromLeftover, toCreate);
                } else if (type == 4) {  // disassembling
                    p.readInt(); // 1... probably inventory type
                    pos = p.readInt();

                    Item it = c.getPlayer().getInventory(InventoryType.EQUIP).getItem((short) pos);
                    if (it != null && it.getItemId() == toCreate) {
                        toDisassemble = toCreate;

                        // Get the list of items that would be returned from disassembly
                        List<Pair<Integer, Integer>> disassembledItems = ii.getMakerDisassembledItems(toDisassemble);

                        // Check if the list is empty
                        if (disassembledItems.isEmpty()) {
                            c.sendPacket(PacketCreator.serverNotice(1, ii.getName(toCreate) + " is unavailable for disassembly. If this seems wrong, please report in Discord!"));
                            c.sendPacket(PacketCreator.makerEnableActions());
                            return;
                        }

                        // Check if player has room for at least one of each ingredient
                        List<Integer> addItemIds = new LinkedList<>();
                        List<Integer> addQuantities = new LinkedList<>();
                        List<Integer> rmvItemIds = new LinkedList<>();
                        List<Integer> rmvQuantities = new LinkedList<>();

                        // We're removing the item being disassembled
                        rmvItemIds.add(toDisassemble);
                        rmvQuantities.add(1);

                        for (Pair<Integer, Integer> item : disassembledItems) {
                            addItemIds.add(item.getLeft());
                            addQuantities.add(1); // We only need to check for room for 1 of each
                        }

                        if (!c.getAbstractPlayerInteraction().canHoldAllAfterRemoving(addItemIds, addQuantities, rmvItemIds, rmvQuantities)) {
                            c.sendPacket(PacketCreator.serverNotice(1, "You don't have enough inventory space to disassemble this item."));
                            c.sendPacket(PacketCreator.makerEnableActions());
                            return;
                        }

                        // Get the fee
                        int recvFee = ii.getMakerDisassembledFee(toDisassemble);
                        if (recvFee < 0) {
                            c.sendPacket(PacketCreator.serverNotice(1, ii.getName(toCreate) + " is unavailable for disassembly. If this seems wrong, please report in Discord!"));
                            c.sendPacket(PacketCreator.makerEnableActions());
                            return;
                        }

                        recipe = MakerItemFactory.generateDisassemblyCrystalEntry(toDisassemble, recvFee, disassembledItems);
                    } else {
                        c.sendPacket(PacketCreator.serverNotice(1, "Something went wrong disassembling " + ii.getName(toCreate) + ". Please report in Discord!"));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        return;
                    }
                } else {
                    if (ItemConstants.isEquipment(toCreate)) {   // only equips uses stimulant and reagents
                        if (p.readByte() != 0) {  // stimulant
                            stimulantid = ii.getMakerStimulant(toCreate);
                            if (!c.getAbstractPlayerInteraction().haveItem(stimulantid)) {
                                stimulantid = -1;
                            }
                        }

                        int reagents = Math.min(p.readInt(), 4); // AdventureMS - Allows allow 4 gem slots
                        for (int i = 0; i < reagents; i++) {  // crystals
                            int reagentid = p.readInt();
                            if (ItemConstants.isMakerReagent(reagentid)) {
                                Short rs = reagentids.get(reagentid);
                                if (rs == null) {
                                    reagentids.put(reagentid, (short) 1);
                                } else {
                                    reagentids.put(reagentid, (short) (rs + 1));
                                }
                            }
                        }

                        List<Pair<Integer, Short>> toUpdate = new LinkedList<>();
                        for (Map.Entry<Integer, Short> r : reagentids.entrySet()) {
                            int qty = c.getAbstractPlayerInteraction().getItemQuantity(r.getKey());

                            if (qty < r.getValue()) {
                                toUpdate.add(new Pair<>(r.getKey(), (short) qty));
                            }
                        }

                        // remove those not present on player inventory
                        if (!toUpdate.isEmpty()) {
                            for (Pair<Integer, Short> rp : toUpdate) {
                                if (rp.getRight() > 0) {
                                    reagentids.put(rp.getLeft(), rp.getRight());
                                } else {
                                    reagentids.remove(rp.getLeft());
                                }
                            }
                        }

                        if (!reagentids.isEmpty()) {
                            if (!removeOddMakerReagents(toCreate, reagentids)) {
                                c.sendPacket(PacketCreator.serverNotice(1, "You can only use WATK and MATK Strengthening Gems on weapons."));
                                c.sendPacket(PacketCreator.makerEnableActions());
                                return;
                            }
                        }
                    }

                    recipe = MakerItemFactory.getItemCreateEntry(toCreate, stimulantid, reagentids);
                }

                short createStatus = getCreateStatus(c, recipe);

                switch (createStatus) {
                    case -1: // An ID was passed that is not in the DB
                        log.warn("Chr {} tried to craft itemid {} using the Maker skill.", c.getPlayer().getName(), toCreate);
                        c.sendPacket(PacketCreator.serverNotice(1, "This is not a valid item to craft using the Maker skill. Please try again or contact a GM if you believe this is an error."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    case 1: // Missing items
                        c.sendPacket(PacketCreator.serverNotice(1, "You are missing required items to create " + ii.getName(toCreate) + "."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    case 2: // Not enough mesos
                        c.sendPacket(PacketCreator.serverNotice(1, "You don't have enough mesos (" + GameConstants.numberWithCommas(recipe.getCost()) + ") to complete this operation."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    case 3: // Character Level too low
                        c.sendPacket(PacketCreator.serverNotice(1, "Your character level is too low to complete this operation."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    case 4: // Maker skill level too low
                        c.sendPacket(PacketCreator.serverNotice(1, "Your maker skill level is too low to complete this operation."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    case 5: // The player doesn't have room to receive the item
                        c.sendPacket(PacketCreator.serverNotice(1, "You do not have room in your inventory to complete this operation."));
                        c.sendPacket(PacketCreator.makerEnableActions());
                        break;

                    default:
                        if (toDisassemble != -1) {
                            InventoryManipulator.removeFromSlot(c, InventoryType.EQUIP, (short) pos, (short) 1, false);
                        } else {
                            for (Pair<Integer, Integer> pair : recipe.getReqItems()) {
                                c.getAbstractPlayerInteraction().gainItem(pair.getLeft(), (short) -pair.getRight(), false);
                            }
                        }

                        int cost = recipe.getCost();

                        // No stim and no reagents
                        if (stimulantid == -1 && reagentids.isEmpty())
                        {
                            if (cost > 0)
                            {
                                c.getPlayer().gainMeso(-cost, false);
                            }

                            // Check for divine forge once and store the result
                            isDivineForge = Math.random() < 0.125 && ItemConstants.isEquipment(recipe.getGainItems().get(0).getLeft());

                            // AdventureMS Custom - Divine Forge for items without stimulant or reagents
                            if (isDivineForge)
                            {
                                toCreate = recipe.getGainItems().get(0).getLeft();
                                makerSucceeded = divineForge(c, toCreate);
                            }

                            else
                            {
                                for (Pair<Integer, Integer> pair : recipe.getGainItems()) {
                                    c.getPlayer().setCS(true);
                                    c.getAbstractPlayerInteraction().gainItem(pair.getLeft(), pair.getRight().shortValue(), false);
                                    c.getPlayer().setCS(false);
                                }
                            }
                        }

                        else
                        {
                            toCreate = recipe.getGainItems().get(0).getLeft();

                            if (stimulantid != -1) {
                                c.getAbstractPlayerInteraction().gainItem(stimulantid, (short) -1, false);
                            }
                            if (!reagentids.isEmpty()) {
                                for (Map.Entry<Integer, Short> r : reagentids.entrySet()) {
                                    c.getAbstractPlayerInteraction().gainItem(r.getKey(), (short) (-1 * r.getValue()), false);
                                }
                            }

                            if (cost > 0) {
                                c.getPlayer().gainMeso(-cost, false);
                            }

                            // Check for divine forge once and store the result
                            isDivineForge = Math.random() < 0.125 && ItemConstants.isEquipment(recipe.getGainItems().get(0).getLeft());

                            if (stimulantid != -1)
                            {
                                makerSucceeded = addBoostedMakerItem(c, toCreate, stimulantid, reagentids);
                            }

                            // AdventureMS Custom - Divine Forge for items without stimulant
                            else if (isDivineForge)
                            {
                                makerSucceeded = addBoostedMakerItem(c, toCreate, 1, reagentids);
                            }

                            else
                            {
                                makerSucceeded = addBoostedMakerItem(c, toCreate, stimulantid, reagentids);
                            }
                        }

                        // thanks inhyuk for noticing missing MAKER_RESULT packets
                        if (type == 3) {
                            c.sendPacket(PacketCreator.makerResultCrystal(recipe.getGainItems().get(0).getLeft(), recipe.getReqItems().get(0).getLeft()));
                        } else if (type == 4) {
                            c.sendPacket(PacketCreator.makerResultDesynth(recipe.getReqItems().get(0).getLeft(), recipe.getCost(), recipe.getGainItems()));
                        } else {
                            c.sendPacket(PacketCreator.makerResult(makerSucceeded, recipe.getGainItems().get(0).getLeft(), recipe.getGainItems().get(0).getRight(), recipe.getCost(), recipe.getReqItems(), stimulantid, new LinkedList<>(reagentids.keySet())));
                        }

                        if (!isDivineForge)
                        {
                            c.sendPacket(PacketCreator.showMakerEffect(makerSucceeded));
                            c.getPlayer().getMap().broadcastMessage(c.getPlayer(), PacketCreator.showForeignMakerEffect(c.getPlayer().getId(), makerSucceeded), false);
                        }

                        else
                        {
                            c.getPlayer().getMap().broadcastMessage(PacketCreator.playSound("AdventureMS/divineForge"));
                            c.sendPacket(PacketCreator.serverNotice(6, "A crack of thunder and the maple gods have blessed your craft with divine power!"));
                            c.getPlayer().getMap().broadcastMessage(c.getPlayer(), PacketCreator.showForeignMakerEffect(c.getPlayer().getId(), makerSucceeded), false);
                        }

                        if (toCreate == 4260003 && type == 3 && c.getPlayer().getQuestStatus(6033) == 1) {
                            c.getAbstractPlayerInteraction().setQuestProgress(6033, 1);
                        }
                }
            } finally {
                c.releaseClient();
            }
        }
    }

    // checks and prevents hackers from PE'ing Maker operations with invalid operations
    private static boolean removeOddMakerReagents(int toCreate, Map<Integer, Short> reagentids) {
        Map<Integer, Integer> reagentType = new LinkedHashMap<>();
        List<Integer> toRemove = new LinkedList<>();

        boolean isWeapon = ItemConstants.isWeapon(toCreate) || YamlConfig.config.server.USE_MAKER_PERMISSIVE_ATKUP;  // thanks Vcoc for finding a case where a weapon wouldn't be counted as such due to a bounding on isWeapon

        for (Map.Entry<Integer, Short> r : reagentids.entrySet()) {
            int curRid = r.getKey();
            int type = r.getKey() / 100;

            if (type < 42502 && !isWeapon) {     // only weapons should gain w.att/m.att from these.
                return false;   //toRemove.add(curRid);
            } else {
                Integer tableRid = reagentType.get(type);

                if (tableRid != null) {
                    if (tableRid < curRid) {
                        toRemove.add(tableRid);
                        reagentType.put(type, curRid);
                    } else {
                        toRemove.add(curRid);
                    }
                } else {
                    reagentType.put(type, curRid);
                }
            }
        }

        // removing less effective gems of repeated type
        for (Integer i : toRemove) {
            reagentids.remove(i);
        }

        // the Maker skill will use only one of each gem
        for (Integer i : reagentids.keySet()) {
            reagentids.put(i, (short) 1);
        }

        return true;
    }

    public static int getMakerSkillLevel(Character chr) {
        return chr.getSkillLevel((chr.getJob().getId() / 1000) * 10000000 + 1007);
    }

    private static short getCreateStatus(Client c, MakerItemCreateEntry recipe) {
        if (recipe.isInvalid()) {
            return -1;
        }

        if (!hasItems(c, recipe)) {
            return 1;
        }

        if (c.getPlayer().getMeso() < recipe.getCost()) {
            return 2;
        }

        if (c.getPlayer().getLevel() < recipe.getReqLevel()) {
            return 3;
        }

        if (getMakerSkillLevel(c.getPlayer()) < recipe.getReqSkillLevel()) {
            return 4;
        }

        List<Integer> addItemids = new LinkedList<>();
        List<Integer> addQuantity = new LinkedList<>();
        List<Integer> rmvItemids = new LinkedList<>();
        List<Integer> rmvQuantity = new LinkedList<>();

        for (Pair<Integer, Integer> p : recipe.getReqItems()) {
            rmvItemids.add(p.getLeft());
            rmvQuantity.add(p.getRight());
        }

        for (Pair<Integer, Integer> p : recipe.getGainItems()) {
            addItemids.add(p.getLeft());
            addQuantity.add(p.getRight());
        }

        if (!c.getAbstractPlayerInteraction().canHoldAllAfterRemoving(addItemids, addQuantity, rmvItemids, rmvQuantity)) {
            return 5;
        }

        return 0;
    }

    private static boolean hasItems(Client c, MakerItemCreateEntry recipe) {
        for (Pair<Integer, Integer> p : recipe.getReqItems()) {
            int itemId = p.getLeft();
            if (c.getPlayer().getInventory(ItemConstants.getInventoryType(itemId)).countById(itemId) < p.getRight()) {
                return false;
            }
        }
        return true;
    }

    // AdventureMS Custom
    private static boolean addBoostedMakerItem(Client c, int itemid, int stimulantid, Map<Integer, Short> reagentids)
    {
        // Create an Item by ID (make sure it's a real item)
        Item item = ii.getEquipById(itemid);
        if (item == null) {
            return false;
        }

        // Cast the item to an equip
        Equip eqp = (Equip) item;

        // Check if enhancements were passed
        if (!reagentids.isEmpty())
        {
            // Initialize Variables
            Map<String, Integer> stats = new LinkedHashMap<>();
            List<Short> randOption = new LinkedList<>();

            // Loop through each reagent to get the stat changes
            for (Map.Entry<Integer, Short> r : reagentids.entrySet())
            {

                // Check if this is a white crystal (slot increase reagent)
                // White crystal IDs: 4251400, 4251401, 4251402
                if (r.getKey() >= 4251400 && r.getKey() <= 4251402) {

                    // Get the current upgrade slots from the equip
                    int currentSlots = eqp.getUpgradeSlots();

                    // Determine slot value based on crystal type
                    int slotValue;
                    switch (r.getKey()) {
                        case 4251400:
                            slotValue = 1; // Basic White Crystal adds 1 slot
                            break;
                        case 4251401:
                            slotValue = 2; // Intermediate White Crystal adds 2 slots
                            break;
                        case 4251402:
                            slotValue = 3; // Advanced White Crystal adds 3 slots
                            break;
                        default:
                            slotValue = 1; // Default to 1 slot
                    }

                    // Multiply by quantity
                    slotValue *= r.getValue();

                    // Add the slots to the stats map
                    String stat = "tuc";
                    Integer d = stats.get(stat);

                    if (d == null) {
                        // Just store the reagent value, let improveEquipStats add it to current slots
                        stats.put(stat, slotValue);
                    }
                    else {
                        // Add to any existing reagent values
                        int newValue = d + slotValue;
                        stats.put(stat, newValue);
                    }
                }

                // Get the stat increase name and value from the DB
                Pair<String, Integer> reagentBuff = ii.getMakerReagentStatUpgrade(r.getKey());


                // Check to make sure it's a real buff (it's in the DB)
                if (reagentBuff != null)
                {
                    // Get the name of the Stat Increase
                    String s = reagentBuff.getLeft();

                    // Check that it's not a flat stat increase
                    if (!s.substring(0, 3).contains("inc"))
                    {
                        // Check for Black Crystal
                        if (s.substring(4).equals("Option")) {randOption.add((short) (reagentBuff.getRight() * r.getValue()));}

                        // It's a % increase gem
                        else if (s.startsWith("special"))
                        {
                            String stat = s.substring(7); // Get's the specialSTAT (DEX, STR, MHP, etc...)
                            Integer d = stats.get(stat); // Gets the stat on the item currently

                            // Calculate the percentage increase based on the current stat value
                            int currentStat = switch (stat) {
                                case "STR" -> eqp.getStr();
                                case "DEX" -> eqp.getDex();
                                case "INT" -> eqp.getInt();
                                case "LUK" -> eqp.getLuk();
                                case "PAD" -> eqp.getWatk();
                                case "PDD" -> eqp.getWdef();
                                case "MAD" -> eqp.getMatk();
                                case "MDD" -> eqp.getMdef();
                                case "ACC" -> eqp.getAcc();
                                case "EVA" -> eqp.getAvoid();
                                case "Speed" -> eqp.getSpeed();
                                case "Jump" -> eqp.getJump();
                                case "MHP" -> eqp.getHp();
                                case "MMP" -> eqp.getMp();
                                default -> 0;
                            };

                            // Calculate the increase amount (percentage of current stat)
                            int increaseAmount = (int) Math.ceil((currentStat * reagentBuff.getRight() * r.getValue()) / 100.0);

                            // Add to stats map
                            if (d == null) {stats.put(stat, increaseAmount);} // If the item doesn't currently have the stat, it just set's the items stat to the reagent stat
                            else {stats.put(stat, d + increaseAmount);} // Add the reagent stat to the item stat
                        }

                        // It's the flat allSTAT gem
                        else if (s.contains("allSTAT"))
                        {
                            // Add 20 to each main stat
                            Integer dex = stats.get("DEX");
                            Integer str = stats.get("STR");
                            Integer int_ = stats.get("INT");
                            Integer luk = stats.get("LUK");

                            stats.put("DEX", (dex == null ? 20 : dex + 20));
                            stats.put("STR", (str == null ? 20 : str + 20));
                            stats.put("INT", (int_ == null ? 20 : int_ + 20));
                            stats.put("LUK", (luk == null ? 20 : luk + 20));
                        }
                    }

                    // It's a normal flat stat, pass it along
                    else
                    {
                        String stat = s.substring(3); // Get's the incSTAT (DEX, STR, MHP, etc...)
                        Integer d = stats.get(stat); // Gets the stat on the item currently
                        if (d == null) {stats.put(stat, reagentBuff.getRight() * r.getValue());} // If the item doesn't currently have the stat, it just set's the items stat to the reagent stat
                        else {stats.put(stat, d + (reagentBuff.getRight() * r.getValue()));} // Add the reagent stat to the item stat
                    }
                }
            }

            ItemInformationProvider.improveEquipStats(eqp, stats);

            // Apply different effects based on randOption value (1-3)
            for (Short sh : randOption)
            {
                if (sh == 1) {eqp = ii.basicBlackCrystal(eqp);}
                else if (sh == 2) {eqp = ii.randomizeStats(eqp);}
                else if (sh == 3) {eqp = ii.randomizeChaosStats(eqp);}
            }
        }

        // AdventureMS Custom - Check for a passed Stimulator
        if (stimulantid != -1)
        {
            eqp = ii.randomizeStatsWithStimulant(eqp);
        }

        InventoryManipulator.addFromDrop(c, item, false, -1);
        return true;
    }

    // AdventureMS Custom - Divine Forge method
    private static boolean divineForge(Client c, int itemid)
    {
        // Create a basic item by ID
        Item item = ii.getEquipById(itemid);
        if (item == null) {
            return false;
        }

        // Cast the item to an equip
        Equip eqp = (Equip) item;

        // Manipulate it with randomizeStatsWithStimulant
        eqp = ii.randomizeStatsWithStimulant(eqp);

        // Add the item to the player's inventory
        InventoryManipulator.addFromDrop(c, item, false, -1);
        return true;
    }
}
