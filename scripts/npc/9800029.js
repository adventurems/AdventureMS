// AdventureMS Scon

var questStart = false;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        // Check if they have completed the quest
        if (cm.getQuestStatus(1019) === 1)
        {
            // Get the items from the inventory
            var zeroStatItems = cm.getPlayer().checkItemsWithZeroStats();

            // Prepare the items for access
            for (var i = 0; i < zeroStatItems.size(); i++)
            {
                var item = zeroStatItems.get(i);
                var itemId = item.get("id");
                var slot = item.get("slot");
                var str = item.get("str");
                var dex = item.get("dex");
                var int = item.get("int");
                var luk = item.get("luk");
            }

            // Check if the list is not empty before proceeding
            if (zeroStatItems != null && zeroStatItems.size() > 0)
            {
                // Check to make sure they can hold the maple leaf
                if (cm.canHold(4001126, 1))
                {
                    cm.sendYesNo("Interesting... These are perfect...\r\n\r\nCould I have them? I've got a powerful crafting ingredient, the #rMaple Leaf#k, to give in return!");
                }
                
                // They don't have room in their inventory'
                else
                {
                    cm.sendOk("Looks like you have the right items, but you don't have room in your #binventory#k to hold the #rMaple Leaf#k. Please make room and try again.");
                    cm.dispose();
                }
            }

            // They don't have the right equipment
            else
            {
                cm.sendOk("Hmmm, doesn't look like you've got the right gear for me yet. Get out there and find the WORST gear you can!");
                cm.dispose();
            }
        }

        else if (cm.getQuestStatus(1019) === 0)
        {
            cm.startQuest(1019);
            questStart = true;
            cm.sendNext("Hello friend.\r\n\r\nI am Scon.\r\n\r\nI am your friend.\r\n\r\n(why is he talking like this? \"Hey Scon, I'm #h #\")\r\n\r\nOh? You speak the same language as me? Haha, that's great! I wasn't sure since I'm not from around here. This will make negotiations easy then.");
        }
        
        // They have completed the quest
        else 
        {
            cm.sendOk("Thank you...\r\n\r\nOddly enough, I get weaker when I equip bad gear here. Huh, who knew? I'll need to head back home to experience the power...\r\n\r\nBefore I go though, I did find this recipe: 4 STR Crystal Ore, 4 DEX Crystal Ore, 4 INT Crystal Ore, 4 LUK Crystal Ore and 1 Maple Leaf. Not sure what it makes though!");
            cm.dispose();
        }
    }
    // After pressing yes/next
    else if (status === 1)
    {
        // First time chatting
        if (questStart)
        {
            cm.sendNext("You see, where I'm from. You get stronger by having bad gear, and I mean really bad. Doesn't make sense, right?\r\n\r\nIt used to be the same as here, but everyone got so strong, the Maple gods, flipped the tables on us and started rewarding casual players. Who knew?\r\n\r\nSo now, I've come here. To an earlier time where the gear ain't so great, ya know?\r\n\r\n(that one stings a little, but okay)\r\n\r\nCould you find me some of the worst possible gear? I mean #rterrible#k gear. These items should roll with #r0 main stats#k on them... I need #eone#n of the following items:\r\n\r\n#e1.#n #rBronze Ring#k\r\n#e2.#n #rWhite Gomushin#k\r\n#e3.#n #rWork Gloves#k\r\n\r\nCould you find one for me? I've got some goodies to trade for in-return.");
        }

        // Normal interaction
        else
        {
            // Import Java Class
            const InventoryType = Java.type('client.inventory.InventoryType');

            // Get the items from the inventory
            var zeroStatItems = cm.getPlayer().checkItemsWithZeroStats();

            // Remove the items
            for (var i = 0; i < zeroStatItems.size(); i++) {
                var itemMap = zeroStatItems.get(i);
                var slot = itemMap.get("slot");

                // Get the actual Item object from the inventory using the slot
                var item = cm.getPlayer().getInventory(InventoryType.EQUIP).getItem(slot);

                // Now pass the Item object to removeEquipFromInventory
                cm.removeEquipFromInventory(item);
            }

            // Send message
            cm.sendOk("#eYES! ULTIMATE POWER!#n\r\n\r\n... ...\r\n\r\nWait a minute, I don't feel any stronger, I need to head back home to experience the power...\r\n\r\n" +
                "Well, a deals a deal. Take this #rMaple Leaf#k!");

            cm.gainItem(4001126, 1);  // Gain Maple Leaf
            cm.gainExp(90000); // Give Exp
            cm.gainFame(3); // Give Fame
            cm.gainItem(5220010, 2); // Two chair gachapon tickets
            cm.completeQuest(1019); // Complete Quest

            // Kill Convo
            cm.dispose();
        }
    }

    // Quest Start
    else if (status == 2)
    {
        cm.sendOk("Alright, come chat when you have the \"bads\". Ha, see what I did there?");
        cm.dispose();
    }
}