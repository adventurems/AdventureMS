// AdventureMS Collector

// Category Completion Configuration
// Set to true to enable a category for completion counting
var categoryCompletionConfig = {
    "Zone 1": true,
    "Zone 2": true,
    "Zone 3": true,
    "Zone 4": false,
    "Maker Resources": false,
    "Overworld": false,
    "Pet Equipment": false,
    "Pets": false,
    "Potions": false,
    "Stars / Bullets / Arrows": false,
    "Character Effects": false,
};

// Import Java classes
const InventoryType = Java.type('client.inventory.InventoryType');

// Global Variables
var turnIn = false; // Used for the first option which is to turn in items
var seeCollection = false; // Used for the second option which is to see the collection
var newCollector = false; // Used to track collector status
var collectableItems = []; // Creates an array of itemids that we have and can be turned in
var selectionSlot = -1;
var selectedCategory = ""; // Used to store the selected category for collection view
var categoryList = []; // Used to store the list of categories for selection

// Helper function to check if player has any collecting ring (in inventory or equipped)
function hasAnyCollectingRing() {
    // Array of all collecting ring IDs
    var ringIds = [1112930, 1112932, 1112933, 1112934, 1112935, 1112936,
                  1112937, 1112938, 1112939, 1112940, 1112941];

    // Check if player has any of the rings in inventory
    for (var i = 0; i < ringIds.length; i++) {
        if (cm.haveItem(ringIds[i])) {
            return true;
        }
    }

    // Check if player has any of the rings equipped in slots -12, -13, -15, -16
    var ringSlots = [-12, -13, -15, -16];
    for (var j = 0; j < ringSlots.length; j++) {
        var item = cm.getPlayer().getInventory(InventoryType.EQUIPPED).getItem(ringSlots[j]);
        if (item != null) {
            var itemId = item.getItemId();
            // Check if this equipped item is one of the collecting rings
            for (var k = 0; k < ringIds.length; k++) {
                if (itemId == ringIds[k]) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check the status of the quest, have they chatted with the collector before?
        if(cm.getQuestStatus(1006) < 2)
        {
            // Check if they can hold the base collecting ring
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
                    // Check if they have any collecting ring, and grant them the base ring if they don't
                    if (!hasAnyCollectingRing())
                    {
                        cm.gainItem(1112930, 1);
                        cm.sendOk("Hmmmm, you seem familiar...\r\n\r\nAh, yes, I see now. We've interacted before on one of your other alias'. That's gotta be it.\r\n\r\nI suppose you want a ring on this character as well then? I can do that for ya...");
                        cm.dispose();
                    }

                    // First time chatting, and they have a collecting ring already? Cheating probably
                    else
                    {
                        cm.sendOk("Hold on, you seem familiar...\r\n\r\nYes, we've interacted on another character of yours. Yet this is the first time we've chatted on this character, and you somehow have a collecting ring already.\r\n\r\nHow might I ask?");
                        cm.dispose();
                    }
                }
            }

            // They don't have room for the base collecting ring.
            else
            {
                cm.sendOk("I'd like to give you the base collecting ring, but you don't have any room in your EQP tab. Please make room!");
                cm.dispose();
            }
        }

        else if (cm.getQuestStatus(1006) === 2 && !hasAnyCollectingRing())
        {
            cm.sendOk("Hmmmm, lost your ring? Seems a bit noobish...JK, here ya go! Have fun out there!");
            cm.gainItem(1112930, 1);
            cm.dispose();
        }

        else
        {
            // Send selection message
            cm.sendSimple("#e#rREMINDER:#k#n Your collection is account wide!\r\n\r\nWhat would you like to do?\r\n\r\n #L0# Trade in items #l \r\n #L1# See my collection(s) #l \r\n #L2# Upgrade my ring #l");
        }

        // If we get here, set it to false
        turnIn = false;
    }

    // They've chosen a selection
    else if (status === 1)
    {
        // Check if this is a brand new account interacting with the collector
        if (newCollector)
        {
            // Send Message
            cm.sendOk("You've been registered as a collector!\r\n\r\nJust sign here, little blood oughta do. What? I mean ink, yeah, just ink...\r\n\r\nHere's your #rCollecting Ring#k!  Get out there and collect #rthings#k!!!");

            // Check if they have any collecting ring, and grant them the base ring if they don't
            if (!hasAnyCollectingRing())
            {
                cm.gainItem(1112930, 1);
            }

            cm.dispose();
        }

        // They want to trade items
        if (selection === 0 || turnIn === true)
        {
            // Initialize arrays
            var missingItems = cm.getPlayer().getCollectorMissing();

            // Store the default string
            var defaultString = "1. #r#eItems are taken from your inventory in order from top left to bottom right (it will not take equipped items).#n#k\r\n2. #e#rThe first copy of an item it finds, in that order, is the one that will be taken.#k#n\r\n3. #r#eThere are no refunds.#n#k\r\n\r\n#eWhat would you like to turn in?#n\r\n";

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
        if (selection === 1)
        {
            // Import the CollectorItemsProvider
            const CollectorItemsProvider = Java.type('server.CollectorItemsProvider');

            // Get all categories and their items from CollectorItemsProvider
            var categoryItems = CollectorItemsProvider.getInstance().getAllCategorizedItems();

            // Create a list of selections based on available categories
            var message = "Which collection would you like to view?\r\n\r\n";
            var selectionIndex = 0;

            // Clear the category list
            categoryList = [];

            // Iterate through categoryCompletionConfig to maintain order
            for (var category in categoryCompletionConfig) {
                // Check if this category exists in the categoryItems
                if (categoryItems.containsKey(category)) {
                    message += "#L" + selectionIndex + "# " + category + " #l\r\n";
                    categoryList.push(category); // Store the category in our list
                    selectionIndex++;
                }
            }

            // Set the seeCollection flag to true
            seeCollection = true;

            // Send the message with category selections
            cm.sendSimple(message);
        }

        // They want to upgrade their ring
        if (selection == 2)
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

            // Track completed categories
            var totalCategories = 0;
            var completedCategories = 0;
            var completedCategoryNames = [];

            // Iterate through each category
            var categories = categoryItems.keySet().toArray();
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                var items = categoryItems.get(category);

                totalCategories++;

                // Check if all items in this category are collected
                var categoryComplete = true;
                for (var j = 0; j < items.size(); j++) {
                    var itemId = items.get(j);
                    if (missingMap[itemId]) {
                        categoryComplete = false;
                        break;
                    }
                }

                // If category is complete, increment counter and add to list
                if (categoryComplete) {
                    // Check if this category is enabled for completion counting
                    if (categoryCompletionConfig[category]) {
                        completedCategories++;
                    }
                    completedCategoryNames.push(category);
                }
            }

            // Nothing Completed Yet
            if (completedCategories === 0)
            {
                // Build the message
                var message = "#e#bRing Upgrade Status#k#n\r\n\r\n";
                message += "You have completed " + completedCategories + " out of " + totalCategories + " collection categories.\r\n\r\nUpgrades are only available for Zone 1, Zone 2 and Zone 3 right now. Get out there and start collecting!";

                // Send the message
                cm.sendOk(message);
                cm.dispose();
            }

            // They've completed at least one category
            else
            {
                // Build the message
                var message = "#e#bRing Upgrade Status#k#n\r\n\r\n";
                message += "You have completed " + completedCategories + " out of " + totalCategories + " collection categories. Upgrades are only available for Zone 1, Zone 2 and Zone 3 right now.\r\n\r\n";

                // Store which ring they have
                var curRing = 0;

                // Array of ring IDs to check
                var ringIds = [1112930, 1112932, 1112933, 1112934, 1112935, 1112936,
                    1112937, 1112938, 1112939, 1112940, 1112941];

                // Checks to see if ring is in inventory
                for (var i = 0; i < ringIds.length; i++)
                {
                    if (cm.haveItemWithId(ringIds[i], false))
                    {
                        curRing = ringIds[i];
                        break;
                    }
                }

                // They don't currently have a ring in their inventory
                if (curRing === 0)
                {
                    cm.sendOk("You don't have a ring in your inventory! #eYour current collecting ring must be un-equipped and in your inventory!#n");
                    cm.dispose();
                }

                // They have a ring in their inventory
                else
                {
                    var maxTier = completedCategories;
                    var targetRing = 1112932 + maxTier - 1;

                    // They have never upgraded before
                    if (curRing === 1112930)
                    {
                        // Manipulate inventory
                        cm.gainItem(curRing, -1); // Take the original ring
                        cm.gainItem(targetRing, 1); // Give the new ring

                        // Update the message
                        message += "#e#rYou have successfully upgraded your ring!#n#k\r\n\r\nGained: #v" + targetRing + "# #t" + targetRing + "#\r\nRemoved: #v" + curRing + "# #t" + curRing + "#";
                        cm.sendOk(message);
                        cm.dispose();
                    }

                    // They have upgraded before
                    else
                    {
                        var canUpgrade = false;

                        // Check if the player can upgrade
                        if (curRing < targetRing) {canUpgrade = true;}

                        // Make the upgrade
                        if (canUpgrade)
                        {
                            // Manipulate inventory
                            cm.gainItem(curRing, -1); // Take the original ring
                            cm.gainItem(targetRing, 1); // Give the new ring

                            // Update the message
                            message += "#e#rYou have successfully upgraded your ring!#n#k\r\n\r\nGained: #v" + targetRing + "# #t" + targetRing + "#\r\nRemoved: #v" + curRing + "# #t" + curRing + "#";
                            cm.sendOk(message);
                            cm.dispose();
                        }

                        // They cannot make an upgrade
                        else
                        {
                            cm.sendOk("You already have the highest possible ring based on your completion status!\r\n\r\nYou can upgrade your ring once you complete more categories!");
                            cm.dispose();
                        }
                    }
                }
            }
        }
    }

     else if (status == 2)
     {
         // They selected a category to view
         if (seeCollection)
         {
             // Store the selected category
             selectedCategory = categoryList[selection];
         }

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

         if (seeCollection)
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

            // Create a string for the selected category
            var categoryString = "";
            var categoryCompletionStatus = false;

            // Get the items for the selected category
            var items = categoryItems.get(selectedCategory);

            if (items) {
                // Initialize the category string with the category name
                categoryString = "\r\n\r\n#e" + selectedCategory + "#n";

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
                    categoryString += "\r\n\t#v" + itemId + "# #t" + itemId + "#: " + (isComplete ? "#bCOMPLETE#k" : "#rINCOMPLETE#k");
                }

                // Check if the category is complete
                categoryCompletionStatus = (categoryComplete === categoryTotal);

                // Add completion status to the category header if complete
                if (categoryCompletionStatus) {
                    var headerEnd = categoryString.indexOf("\r\n\t");
                    if (headerEnd !== -1) {
                        categoryString = "\r\n\r\n#e" + selectedCategory + " #b(COMPLETE)#k#n" + categoryString.substring(headerEnd);
                    }
                }

                // Calculate category progress
                var categoryProgress = Math.round((categoryComplete / categoryTotal) * 100);

                // Build the final string
                var finalString = "#e#b" + selectedCategory + " Collection Progress#k\r\n#B" + categoryProgress + "# (" + categoryProgress + "%)#n\r\n\r\nBelow you will find the status of all items in the " + selectedCategory + " collection:\r\n";
                finalString += categoryString;

                // Send the finalized message
                cm.sendOk(finalString);
                cm.dispose();
            } else {
                // Category not found
                cm.sendOk("Sorry, I couldn't find any information about the " + selectedCategory + " collection.");
                cm.dispose();
            }
         }
    }
}
