// Author: Pepa

// AdventureMS Mr Moneybags

// Declare Global Variables
selectionSlot = 0;

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
            defaultString = "Sold something on accident did ya? Rookie mistake... What would you like to buy back?\r\n\r\n";

            // Iterate through each item in the list
            for (var i = 0; i < buybackItems.length; i++)
            {
                // Get the Item
                var equip = buybackItems.get(i);

                // Set the current itemId to the missingItem id
                var itemId = equip.getItemId();

                // Add to the text string
                defaultString += "\r\n" + "#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";

                // Increment the selection #
                selectionSlot++;
            }

            // Send the full string w/ selections
            cm.sendSimple(defaultString);

            // Kill the convo
            cm.dispose();
        }

        // They've never sold anything
        else
        {
            cm.sendOk("You've never sold a single item, you must be broke!");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status == 1)
    {

    }

    // After Advancing one further
    else if (status == 2)
    {

    }
}