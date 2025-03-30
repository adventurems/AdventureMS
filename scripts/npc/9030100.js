// AdventureMS Storage System

// Global Variables
var inCash = false;
var storeItems = false;
var removeItems = false;
var defaultString;
var selectionSlot = 0;
var selectedItemId = 0;
var storableItems = [];

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        cm.sendSimple("#L0#Normal Storage#l\r\n#L1##d#eCash Storage#n#k#l");
    }

    else if (status == 1)
    {
        switch (selection)
        {
            // They chose normal storage
            case 0:
            cm.getPlayer().getStorage().sendStorage(cm.getClient(), 9030100);
            cm.dispose();
            break;

            // They chose cash storage
            case 1:
            cm.sendSimple("#L0##e#bStore Items#n#k#l\r\n#L1##r#eRemove Items#n#k#l");
            break;
        }
    }

    // We are strictly in Cash Operations Now
    else if (status == 2)
    {
        // Only use selection here, if they weren't already performing operations
        if (!storeItems && !removeItems)
        {
            switch (selection)
            {
                // They are removing items
                case 0:
                storeItems = true;
                selection = -1;
                break;

                // They are storing items
                case 1:
                removeItems = true;
                selection = -1;
                break;
            }
        }

        // We are actively storing items
        if (storeItems)
        {
            // Check if we did something beforehand
            if (selection > -1)
            {
                if (selection == 0)
                {
                    storeItems = false;
                    removeItems = true;
                    return;
                }

                // They chose an item to store
                else
                {
                    // Get the selected itemId
                    selectedItemId = storableItems[selection - 1];

                    // Store the item
                    if (cm.getPlayer().storeCashItem(selectedItemId))
                    {
                        // If it was successful, remove it
                        cm.gainItem(selectedItemId, -1);
                    }

                    // They don't have any space to store
                    else
                    {
                        cm.sendOk("You have no more space in your #p#eCash Storage#k#n! Visit #b#eThe Expander#k#n to earn more!");
                        cm.dispose();
                        return;
                    }
                }
            }

            // Reset variables
            selection = 0;
            storableItems = [];
            selectionSlot = 0;

            // Default text at the top of the screen
            defaultString = "#L0#Swap to #e#rREMOVING#n#k items#l\r\n\r\n\r\nBelow are the items available to #e#bSTORE#n#k:\r\n";

            // Get the list of available cash items to store
            var cashItems = cm.getCashItems();

            // Iterate through equip inventory
            for (var i = 0; i < cashItems.length; i++)
            {
                    selectionSlot++;
                    storableItems.push(cashItems[i]);
                    defaultString += "\r\n" + "#L" + selectionSlot + "##v" + cashItems[i] + "# #t" + cashItems[i] + "##l";
            }

            // Send the finalized string
            cm.sendSimple(defaultString);

            // Move us back one status so when we click, we come back here
            status = 1;
        }

        // We are actively removing items
        if (removeItems)
        {
            // Default text at the top of the screen
            defaultString = "You are currently #r#eREMOVING#k#n items\r\n\r\n#L0#Swap to #e#gSTORING#n#k items\r\n\r\nBelow are the items available to #e#rREMOVE#n#k:";
        }
    }
}