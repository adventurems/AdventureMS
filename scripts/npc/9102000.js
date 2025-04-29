// AdventureMS Scon

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

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check if they have completed the quest
        if (cm.getQuestStatus(1019) < 2)
        {
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
        
        // They have completed the quest
        else 
        {
            cm.sendOk("Thank you...\r\n\r\nOddly enough, I get weaker when I equip bad gear here. Huh, who knew? I'll need to head back home to experience the power...");
            cm.dispose();
        }
    }
    // After pressing yes/next
    else if (status == 1)
    {
        // Send message
        cm.sendOk("#eYES! ULTIMATE POWER!#n\r\n\r\n... ...\r\n\r\nWait a minute, I don't feel any stronger, I need to head back home to experience the power...\r\n\r\n" +
            "Well, a deals a deal. Take this #rMaple Leaf#k!");
        
        // Gain Maple Leaf
        cm.gainItem(4001126, 1);

        // Give Exp
        cm.gainExp(75000);
        
        // Remove the items from the inventory
        var equip = cm.getPlayer().getInventory(1);
        for (var i = 0; i < zeroStatItems.size(); i++)
        {
            var item = zeroStatItems.get(i);
            equip.removeItem(item.get("slot"), 1);
        }
        
        // Kill Convo
        cm.dispose();
    }
}