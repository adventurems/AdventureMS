// Author: Pepa

// AdventureMS Mr Moneybags

// Declare Global Variables
var selectionSlot = 0;
var itemsToBuyBack = []; // For passing the buyback items to the next status

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Get the list of buyback items
        var buybackItems = cm.getPlayer().getBuyback();

        // Make sure it is not empty
        if (buybackItems.size() > 0)
        {
            // Create a default text string
            defaultString = "Welcome to the OFFICIAL #r#eBuyer Backer 2000#k#n system!\r\n\r\nSold something on accident? Finger slipped? No worries, all completely normal mistakes for a #erookie#n!\r\n\r\n What would you like to buy back?\r\n\r\n";

            // Iterate through each item in the list
            for (var i = 0; i < buybackItems.length; i++)
            {
                // Get the Item
                var equip = buybackItems.get(i);

                // Set the current itemId to the missingItem id
                var itemId = equip.getItemId();

                // Store the item object to pass to the next status
                itemsToBuyBack.push(equip);

                // Add to the text string
                defaultString += "\r\n" + "#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";

                // Increment the selection #
                selectionSlot++;
            }

            // Send the full string w/ selections
            cm.sendSimple(defaultString);
        }

        // They've never sold anything
        else
        {
            cm.sendOk("You've never sold a single item, you must be broke!");
            cm.dispose();
        }
    }

    // After selecting an item to buyback
    else if (status == 1)
    {
        // Store new defaultString
        var defaultString = "Beep, boop... beep... beep...ding!\r\n\r\n#eThe following item has been bought back:#n\r\n\r\n";

        // Use the selection to get the correct item from collectableItems
        var selectedItem = itemsToBuyBack[selection];
        var selectedItemId = selectedItem.getItemId();

        // Add visual and item text
        defaultString += "#v" + selectedItemId + "# #t" + selectedItemId + "#";

        // Add the item to the players inventory
        var buybackAttempt = cm.addItemFromBuyback(selectedItem);

        // Determine outcome of buybackAttempt
        switch (buybackAttempt)
        {
            // Something wrong with the item
            case 0:
            cm.sendOk("#eERROR:#n There is an issue with your item, report it to a GM.");
            break;

            // They can't afford it
            case 1:
            cm.sendOk("#eERROR:#n Does not compute... You can't afford it...");
            break;

            // They don't have any room
            case 2:
            cm.sendOk("#eERROR:#n ... ... ... testing ... ... ... no slots available...");
            break;

            // They successfully bought back the item
            case 3:

            // Delete the item from the buyback table
            cm.getPlayer().deleteBuybackItem(selection);

            // Send finalized string
            cm.sendOk(defaultString);
            break;
        }

        // Kill convo
        cm.dispose();
    }
}