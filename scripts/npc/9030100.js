// AdventureMS Storage System

// Global Variables
var inCash = false;
var storeItems = false;
var removeItems = false;
var defaultString;
var selectionSlot = 0;
var selectedItemId = 0;
var storableItems = [];
var removableItems = [];

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

            // Calc stringAdd
            var stringAdd = cm.getPlayer().getAvailableCashSlots();
            if (stringAdd == 0) {stringAdd = "#r#eFULL#k#n";}

            cm.sendSimple("#L0##e#bStore Items#n#k | Slots Available: " + stringAdd + "#l\r\n#L1##r#eRetrieve Items#n#k#l");
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
                // They are storing items
                case 0:

                // They don't have space
                if (cm.getPlayer().getAvailableCashSlots() == 0)
                {
                    cm.sendNext("You must #r#eretrieve#k#n items first, or visit #b#eThe Expander#k#n to earn more slots!");
                    status = 1;
                    removeItems = true;
                    selection = -1;
                    return;
                }

                // They have space
                else
                {
                    storeItems = true;
                    selection = -1;
                }

                break;

                // They are removing items
                case 1:
                removeItems = true;
                selection = -1;
                break;
            }
        }

        // We are actively storing items
        if (storeItems)
        {
            // They chose to swap actions
            if (selection == 0)
            {
                storeItems = false;
                removeItems = true;
                selection = -1;
            }

            // Check if we did something beforehand
            else if (selection > 0)
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
                    cm.sendOk("You have no more space in your #d#eCash Storage#k#n!\r\nVisit #b#eThe Expander#k#n to earn more!");
                    cm.dispose();
                    return;
                }
            }

            if (storeItems)
            {
                // Reset variables
                selection = 0;
                storableItems = [];
                selectionSlot = 0;

                // Default text at the top of the screen
                defaultString = "#b#eITEM STORAGE#n#k\r\nBelow are the items available to #e#bSTORE#n#k:\r\n\r\n#L0#Move to item #e#rRETRIEVAL#n#k#l\r\n";

                // Get the list of available cash items to store
                var cashItems = cm.getCashItems();

                // Make sure there are items left
                if (cashItems.size() === 0)
                {
                    cm.sendOk("You have no more cash items to store!");
                    cm.dispose();
                    return;
                }

                else
                {
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
            }

            // Send prompt moving them to remove items
            else
            {
                cm.sendNext("Moving to item retrieval...");
                status = 1;
                return;
            }
        }

        // We are actively removing items
        if (removeItems)
        {
            // They chose to swap actions
            if (selection == 0)
            {
                storeItems = true;
                removeItems = false;
                selection = -1;
            }

            // They chose to remove an item
            else if (selection > 0)
            {
                // Get the selected itemId and quantity from removableItems
                var selectedItem = removableItems[selection - 1]; // Get the object from the list
                selectedItemId = selectedItem.itemId;  // Access the itemId from the object

                // Make sure they have room
                if (cm.getPlayer().canHold(selectedItemId))
                {
                    // Gain the Item
                    cm.gainItem(selectedItemId, 1);

                    // Delete from DB
                    cm.getPlayer().removeCashItem(selectedItemId);
                }

                else
                {
                    cm.sendOk("You don't have any more room in your inventory!");
                    cm.dispose();
                    return;
                }
            }

            if (removeItems)
            {
                // Reset variables
                selection = 0;
                removableItems = [];
                selectionSlot = 0;

                // Default text at the top of the screen
                defaultString = "#r#eITEM RETRIEVAL#n#k\r\nBelow are the items available to #e#rRETRIEVE#n#k:\r\n\r\n#L0#Move to item #e#bSTORAGE#n#k#l\r\n";

                // Get the list of available cash items to store
                var storageItems = cm.getPlayer().getCashStorageItems();

                // Check if it's empty
                if (storageItems.size() === 0)
                {
                    cm.sendOk("There are no items in your #e#dCash Storage#n#k!");
                    cm.dispose();
                    return;
                }

                else
                {
                    // Iterate through cashStorage
                    for (var i = 0; i < storageItems.length; i++)
                    {
                        selectionSlot++;

                        // Get values out of map
                        var itemId = storageItems[i].getKey();  // The item ID is stored as the key
                        var quantity = storageItems[i].getValue();  // The quantity is stored as the value

                        // Store Key / Map appropriately
                        removableItems.push({itemId: itemId, quantity: quantity});

                        // Append the item display string for the item
                        if (quantity > 1)
                        {
                            defaultString += "\r\n" + "#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                        }

                        else
                        {
                            defaultString += "\r\n" + "#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                        }
                    }

                    // Send the finalized string
                    cm.sendSimple(defaultString);

                    // Move us back one status so when we click, we come back here
                    status = 1;
                }
            }

            // Send prompt moving them to store items
            else
            {
                cm.sendNext("Moving to item storage...");
                status = 1;
                return;
            }
        }
    }
}