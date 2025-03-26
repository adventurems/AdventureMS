// Author: Pepa

// AdventureMS The Collector

// Global Variables
var turnIn = false; // Used for the first option which is to turn in items
var newCollector = false; // Used to track collector status
var collectableItems = []; // Creates an array of itemids that we have and can be turned in
var selectionSlot = -1;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check the status of the quest, have they chatted with the collector before?
        if(cm.getQuestStatus(1006) < 2)
        {
            // Update quest status
            cm.completeQuest(1006);

            // Add to Collector DB if they don't exist
            newCollector = cm.getPlayer().addCollectorStatus();

            // Check if they are a new collector or not
            if (newCollector)
            {
                // Send introduction message
                cm.sendNext("Well, well, well... What do we have here? An eager adventurer looking to get a little stronger. I can #eprobably#n help with that.\r\n\r\nHere's the game. I collect things, but not just some things. I collect #eEVERYTHING#n (almost)!\r\n\r\nI need em. Well not me, my clients do. That's where you come in.");
            }

            // They are not new, but this is the first time they've chatted with the collector on this character
            else
            {
                // Check if they have a ring somehow, and grant them one if they don't
                if (!cm.haveItem(1112930))
                {
                    cm.gainItem(1112930, 1);
                    cm.sendOk("Hmmmm, you seem familiar...\r\n\r\nAh, yes, I see now. We've interacted before on one of your other alias'. That's gotta be it.\r\n\r\nI suppose you want a ring on this character as well then? I can do that for ya...");
                    cm.dispose();
                }

                // First time chatting, and they have a ring already? Cheating probably
                else
                {
                    cm.sendOk("Hold on, you seem familiar...\r\n\r\nYes, we've interacted on another character of yours. Yet this is the first time we've chatted on this character, and you somehow have a ring already.\r\n\r\nHow might I ask?");
                    cm.dispose();
                }
            }
        }

        else
        {
            // Send selection message
            cm.sendSimple("What would you like to do?\r\n\r\n #L0# Trade in items #l \r\n #L1# See my collection(s) #l \r\n #L2# Upgrade my ring #l");
        }
    }

    // They've chosen a selection
    else if (status == 1)
    {
        // Check if this is a brand new account interacting with the collector
        if (newCollector)
        {
            // Send Message
            cm.sendOk("You've been registered as a collector!\r\n\r\nJust sign here, little blood oughta do. What? I mean ink, yeah, just ink...\r\n\r\nHere's your #rCollecting Ring#k!  Get out there and collect #rthings#k!!!");

            // Check if they have a ring somehow, and grant them one if they don't
            if (!cm.haveItem(1112930))
            {
                cm.gainItem(1112930, 1);
            }

            cm.dispose();
        }

        // They want to trade items
        if (selection == 0)
        {
            // Initialize arrays
            var missingItems = cm.getPlayer().getCollectorMissing();

            // Store the default string
            var defaultString = "1. #r#eItems are taken from your inventory in order from top left to bottom right (it will not take equipped items).#n#k\r\n\r\n2. #e#rThe first copy of an item it finds, in that order, is the one that will be taken.#k#n\r\n\r\n3. #r#eThere are no refunds.#n#k\r\n\r\n#eBelow are the items available for collection. Which one would you like to turn in?#n\r\n";

            // Iterate through each missing item
            for (var i = 0; i < missingItems.length; i++)
            {
                // Set the current itemId to the missingItem id
                var itemId = missingItems[i];

                // Check if the player has the item in their inventory
                if (cm.haveItem(parseInt(itemId)))
                {
                    collectableItems.push(itemId); // Add item to the new array if it's in the inventory
                    selectionSlot++;
                    defaultString += "\r\n" + "#L" + selectionSlot + "##v" + missingItems[i] + "# #t" + missingItems[i] + "##l";
                }
            }

            // If they have collectableItems then keep them moving
            if(collectableItems.length > 0)
            {
                // Set turnIn to true since they selected "Trade in items"
                turnIn = true;

                // Send Compiled Message
                cm.sendSimple(defaultString);
            }

            // If they don't have any collectable items right now
            else
            {
                cm.sendOk("Doesn't look like you have anything to turn in right now!\r\n\r\nTake a look at your collection and get back out there!");
                cm.dispose();
            }
        }

        // They want to see their collection
        if (selection == 1)
        {
            // Initialize allItems
            var allItems = cm.getPlayer().getCollectorAll();

            // Set variableString
            var capString = "#eCaps#n\r\n";
            var earringsString = "\r\n\r\n#eEarrings#n\r\n";
            var topString = "\r\n\r\n#eTops#n\r\n";
            var overallString = "\r\n\r\n#eOveralls#n\r\n";
            var bottomString = "\r\n\r\n#eBottoms#n\r\n";
            var shoesString = "\r\n\r\n#eShoes#n\r\n";
            var glovesString = "\r\n\r\n#eGloves#n\r\n";
            var shieldString = "\r\n\r\n#eShields#n\r\n";
            var capeString = "\r\n\r\n#eCapes#n\r\n";
            var ringString = "\r\n\r\n#eRings#n\r\n";
            var pendantString = "\r\n\r\n#ePendants#n\r\n";
            var medalString = "\r\n\r\n#eMedals#n\r\n";
            var weaponString = "\r\n\r\n#eWeapons#n\r\n";
            var etcString = "\r\n\r\n#eEtc#n\r\n";
            var consumeString = "\r\n\r\n#eConsumables#n\r\n";
            var scrollString = "\r\n\r\n#eScrolls#n\r\n";
            var throwableString = "\r\n\r\n#eThrowables#n\r\n";
            var cashString = "\r\n\r\n#eCash#n\r\n";

            // Store counts
            var totalEntries = 0;
            var completeEntries = 0;

            // Get an iterator for the HashMap entries
            var iterator = allItems.entrySet().iterator();

            // Iterate through each entry in the HashMap
            while (iterator.hasNext())
            {
                var entry = iterator.next();
                var itemId = entry.getKey(); // Get the key (itemId)
                var itemValue = entry.getValue(); // Get the value associated with the itemId

                // Increment totalEntries
                totalEntries++;

                // Count entries with a value of 1 (complete)
                if (itemValue === 1)
                {
                    completeEntries++;
                }

                // Get the prefix from itemId (first 3 characters)
                var itemPrefix = itemId.substring(0, 3);

                // Use a switch statement based on itemPrefix
                switch (itemPrefix) {
                    case "100":
                        capString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "103":
                        earringsString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "104":
                        topString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "105":
                        overallString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "106":
                        bottomString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "107":
                        shoesString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "108":
                        glovesString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "109":
                        shieldString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "110":
                        capeString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "111":
                        ringString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "112":
                        pendantString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "114":
                        medalString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "130":
                    case "132":
                    case "133":
                    case "137":
                    case "138":
                    case "140":
                    case "142":
                    case "143":
                    case "144":
                    case "145":
                    case "146":
                    case "147":
                    case "148":
                    case "149":
                        weaponString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "181":
                    case "500":
                    case "522":
                        cashString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "400":
                        etcString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "200":
                    case "202":
                        consumeString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "203":
                        scrollString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    case "206":
                    case "207":
                    case "233":
                        throwableString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (itemValue === 1 ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                        break;

                    default:
                        // Optionally handle an unknown prefix or do nothing.
                        break;
                }
            }

            // Calculate progress
            var collectorProgress = Math.round((completeEntries / totalEntries) * 100);

            // Calculate Strings
            var defaultString = "#e#bTotal Progress#k\r\n#B" + collectorProgress + "# (" + collectorProgress + "%)#n\r\n\r\nBelow you will find the status on all the collectable items in the game!\r\n\r\n";
            var finalString = defaultString += capString + earringsString + topString + overallString + bottomString + shoesString + glovesString + shieldString + capeString + ringString + pendantString + medalString + etcString + consumeString + scrollString + throwableString + cashString + weaponString;

            // Send the finalized message
            cm.sendOk(finalString);
            cm.dispose();
        }

        // They want to upgrade their ring
        if (selection == 2)
        {
            cm.sendOk("Ring upgrades aren't available yet.");
            cm.dispose();
        }
    }

     else if (status == 2)
     {
         // They chose to add items to their collection
         if (turnIn)
         {
             // Store new defaultString
             var defaultString = "The following item has been removed from your inventory and added to your collection!\r\n";

             // Use the selection to get the correct item from collectableItems
             var selectedItemId = collectableItems[selection]; // Get the selected item using the index

             // Append a picture and text for the selected item
             defaultString += "\r\n#v" + selectedItemId + "# #t" + selectedItemId + "#";

             // Check if it is bullets or stars
             if ([233, 207].includes(Math.floor(parseInt(selectedItemId) / 10000)))
             {
                 // Access the Inventory and Item Classes
                 var Item = Java.type('client.inventory.Item');
                 var InventoryType = Java.type('client.inventory.InventoryType');
                 var Inventory = Java.type('client.inventory.Inventory');

                 // Create an instance of Inventory
                 var inventory = new Inventory(cm.getPlayer(), InventoryType.USE, 96);

                 // Find the item by ID
                 var inventoryItem = inventory.findById(parseInt(selectedItemId));

                 var position = inventoryItem.getPosition(inventoryItem);
                 pi.removeUseFromSlot(position);
             }

             else
             {
                 // Remove the item from the player’s inventory
                 cm.gainItem(parseInt(selectedItemId), -1);
             }

             // Update the DB (this line may need to be adjusted based on your specific DB interaction)
             cm.getPlayer().updateCollector(selectedItemId);

             // Send the final text
             cm.sendOk(defaultString);
             cm.dispose();
         }
    }
}