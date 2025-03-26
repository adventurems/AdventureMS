// Author: Pepa

// AdventureMS The Collector

// Global Variables
var turnIn = false; // Used for the first option which is to turn in items
var newCollector = false; // Used to track collector status
var collectableItems = []; // Creates an array of itemids that we have and can be turned in
var itemIndexes = []; // To map the displayed index to the actual item in collectableItems

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check the status of the quest, have they chatted with the collector before?
        if(cm.getQuestStatus(1006) < 2)
        {
            cm.completeQuest(1006);
            newCollector = cm.getPlayer().addCollectorStatus();

            if (newCollector)
            {
                cm.sendNext("Well, well, well... What do we have here? An eager adventurer looking to get a little stronger. I can #eprobably#n help with that.");
            }
            else
            {
                cm.sendOk("Hold on, you seem familiar...\r\n\r\nYes, we've interacted on another character of yours. Yet this is the first time we've chatted on this character, and you somehow have a ring already.\r\n\r\nHow might I ask?");
                cm.dispose();
            }
        }
        else
        {
            cm.sendSimple("What would you like to do?\r\n\r\n #L0# Trade in items #l \r\n #L1# See my collection(s) #l \r\n #L2# Upgrade my ring #l");
        }
    }

    // They've chosen a selection
    else if (status == 1)
    {
        if (selection == 0) // Trade in items
        {
            var missingItems = cm.getPlayer().getCollectorMissing();
            var defaultString = "1. #r#eItems are taken from your inventory in order from top left to bottom right (it will not take equipped items).#n#k\r\n\r\n2. #e#rThe first copy of an item it finds, in that order, is the one that will be taken.#k#n\r\n\r\n3. #r#eThere are no refunds.#n#k\r\n\r\n#eBelow are the items available for collection. Which one would you like to turn in?#n\r\n";
            collectableItems = [];
            itemIndexes = []; // Clear itemIndexes to reset mapping

            // Iterate through each missing item
            for (var i = 0; i < missingItems.length; i++)
            {
                var itemId = missingItems[i];
                if (cm.haveItem(parseInt(itemId)))
                {
                    collectableItems.push(itemId);
                    itemIndexes.push(i); // Store the original index for each item
                    defaultString += "\r\n" + "#L" + i + "##v" + itemId + "# #t" + itemId + "##l";
                }
            }

            if (collectableItems.length > 0)
            {
                turnIn = true;
                cm.sendSimple(defaultString);
            }
            else
            {
                cm.sendOk("Doesn't look like you have anything to turn in right now!");
                cm.dispose();
            }
        }
        else if (selection == 1) // See collection
        {
            // Handle collection display (same as your existing code)
        }
        else if (selection == 2) // Upgrade ring
        {
            cm.sendOk("Ring upgrades aren't available yet.");
            cm.dispose();
        }
    }
    else if (status == 2)
    {
        if (turnIn)
        {
            var defaultString = "The following item has been removed from your inventory and added to your collection!\r\n";

            // Get the actual itemId from the collectableItems array
            var selectedItemId = collectableItems[selection];

            // Check if selectedItemId is a valid number
            if (isNaN(selectedItemId) || selectedItemId <= 0) {
                cm.sendOk("Selected Item Index: " + selection + "\r\n\r\nCollectable Items: " + collectableItems.join(", ") + "\r\n\r\nItem ID: " + selectedItemId);
                cm.dispose();
                return;
            }

            defaultString += "\r\n#v" + selectedItemId + "# #t" + selectedItemId + "#";

            // Remove the item from the player’s inventory
            cm.gainItem(parseInt(selectedItemId), -1);

            // Update the DB (adjust according to your DB)
            cm.getPlayer().updateCollector(selectedItemId);

            cm.sendOk(defaultString);
            cm.dispose();
        }
    }
}
