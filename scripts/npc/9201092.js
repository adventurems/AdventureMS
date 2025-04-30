// AdventureMS Collector

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
            // Check if they can hold a ring
            if (cm.canHold(1112930))
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

            // They don't have room for a ring.
            else
            {
                cm.sendOk("I'd like to give you something nice, but you don't have any room in your EQP tab. Please make room!");
                cm.dispose();
            }
        }

        else
        {
            // Send selection message
            cm.sendSimple("What would you like to do?\r\n\r\n #L0# Trade in items #l \r\n #L1# See my collection(s) #l \r\n #L2# Upgrade my ring #l");
        }

        // If we get here, set it to false
        turnIn = false;
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
        if (selection == 0 || turnIn == true)
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
                if (cm.haveItem(itemId))
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
            // Import the CollectorItemsProvider
            const CollectorItemsProvider = Java.type('server.CollectorItemsProvider');

            // Get all missing items
            var missingItems = cm.getPlayer().getCollectorMissing();

            // Convert missing items to a Map for efficient lookup
            var missingMap = {};
            for (var i = 0; i < missingItems.length; i++) {
                missingMap[missingItems[i]] = true;
            }

            // Get all categories and their items from CollectorItemsProvider
            var categoryItems = CollectorItemsProvider.getInstance().getAllCategorizedItems();

            // Store counts
            var totalEntries = 0;
            var completeEntries = 0;

            // Create a string for each category
            var categoryStrings = {};
            var categoryCompletionStatus = {};

            // Iterate through each category
            var categories = categoryItems.keySet().toArray();
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                var items = categoryItems.get(category);

                // Initialize the category string with the category name
                categoryStrings[category] = "\r\n\r\n#e" + category + "#n";

                // Track completion status for this category
                var categoryTotal = 0;
                var categoryComplete = 0;

                // Iterate through each item in the category
                for (var j = 0; j < items.size(); j++) {
                    var itemId = items.get(j);
                    totalEntries++;
                    categoryTotal++;

                    // Check if the item is missing
                    var isComplete = !missingMap[itemId];
                    if (isComplete) {
                        completeEntries++;
                        categoryComplete++;
                    }

                    // Add the item to the category string
                    categoryStrings[category] += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (isComplete ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                }

                // Check if the category is complete
                categoryCompletionStatus[category] = (categoryComplete === categoryTotal);

                // Add completion status to the category header if complete
                if (categoryCompletionStatus[category]) {
                    var headerEnd = categoryStrings[category].indexOf("\r\n\t");
                    if (headerEnd !== -1) {
                        categoryStrings[category] = "\r\n\r\n#e" + category + " #b(COMPLETE)#k#n" + categoryStrings[category].substring(headerEnd);
                    }
                }
            }

            // Calculate progress
            var collectorProgress = Math.round((completeEntries / totalEntries) * 100);

            // Build the final string
            var defaultString = "#e#bTotal Progress#k\r\n#B" + collectorProgress + "# (" + collectorProgress + "%)#n\r\n\r\nBelow you will find the status on all the collectable items in the game!\r\n";
            var finalString = defaultString;

            // Add each category string to the final string
            for (var i = 0; i < categories.length; i++) {
                finalString += categoryStrings[categories[i]];
            }

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
                cm.removeItemFromSlot(parseInt(selectedItemId));
             }

             // It's not a bullet or star
             else
             {
                 // Remove the item from the player’s inventory
                 cm.gainItem(parseInt(selectedItemId), -1);
             }

             // Update the DB (this line may need to be adjusted based on your specific DB interaction)
             cm.getPlayer().updateCollector(selectedItemId);

             // Reset variables for the next trade
             collectableItems = [];
             turnIn = true;
             selectionSlot = -1;
             status = 0;

             // Send the final text with a Next button instead of OK
             cm.sendNext(defaultString);
         }
    }
}
