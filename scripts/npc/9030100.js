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
var cashSlots = 0;
var curMeso = 0;
var fee = 25000;

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

            cm.sendSimple("Per Transaction Fee: #e" + fee + "#n\r\n\r\n#L0##e#bStore Items#n#k | Slots Available: " + stringAdd + "#l\r\n#L1##r#eRetrieve Items#n#k#l");
            break;
        }
    }

    // We are strictly in Cash Operations Now
    else if (status == 2)
    {
        // Only use selection here, if they weren't already performing operations
        if (!storeItems && !removeItems)
        {
            // Store slots in real time
            cashSlots = cm.getPlayer().getAvailableCashSlots();
            curMeso = cm.getPlayer().getMeso();

            switch (selection)
            {
                // They are storing items
                case 0:

                // They don't have space
                if (cashSlots == 0)
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

                // Check meso transaction
                if (curMeso >= fee)
                {
                    // Store the item
                    if (cm.getPlayer().storeCashItem(selectedItemId))
                    {
                        // If it was successful, remove it
                        cm.gainItem(selectedItemId, -1);

                        // Reduce mesos
                        cm.gainMeso(-fee);
                        curMeso -= fee;

                        // Reduce visual slots
                        cashSlots--;
                    }

                    // They don't have any space to store
                    else
                    {
                        cm.sendOk("You have no more space in your #d#eCash Storage#k#n!\r\nVisit #b#eThe Expander#k#n to earn more!");
                        cm.dispose();
                        return;
                    }
                }

                // They can't afford the fee
                else
                {
                    cm.sendOk("You can't afford the fee...yikes...");
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
                defaultString = "#b#eITEM STORAGE#n#k | Available Slots: " + cashSlots + " | Mesos: " + Intl.NumberFormat().format(curMeso) + "\r\n\r\n#L0#Move to item #e#rRETRIEVAL#n#k#l\r\n\r\n";

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

                // Check meso transaction
                if (curMeso >= fee)
                {
                    // Make sure they have room
                    if (cm.getPlayer().canHold(selectedItemId))
                    {
                        if (cm.getPlayer().getMeso)
                        // Gain the Item
                        cm.gainItem(selectedItemId, 1);

                        // Delete from DB
                        cm.getPlayer().removeCashItem(selectedItemId);

                        // Reduce mesos
                        cm.gainMeso(-fee);
                        curMeso -= fee;

                        // Update visual slots
                        cashSlots++;
                    }

                    else
                    {
                        cm.sendOk("You don't have any more room in your inventory!");
                        cm.dispose();
                        return;
                    }
                }

                // They can't afford the fee
                else
                {
                    cm.sendOk("You can't afford the fee...yikes...");
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
                defaultString = "#r#eITEM RETRIEVAL#n#k | Available Slots: " + cashSlots + " | Mesos: " + Intl.NumberFormat().format(curMeso) + "\r\n\r\n#L0#Move to item #e#bSTORAGE#n#k#l\r\n\r\n";

                // Get the list of available cash items to remove
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
                    // Set variableString
                    var capString = "\r\n#eCaps#n";
                    var accString = "\r\n\r\n\r\n#eAccessories#n"
                    var earringsString = "\r\n\r\n#eEarrings#n";
                    var topString = "\r\n\r\n#eTops#n";
                    var overallString = "\r\n\r\n#eOveralls#n";
                    var bottomString = "\r\n\r\n#eBottoms#n";
                    var shoesString = "\r\n\r\n#eShoes#n";
                    var glovesString = "\r\n\r\n#eGloves#n";
                    var shieldString = "\r\n\r\n#eShields#n";
                    var capeString = "\r\n\r\n#eCapes#n";
                    var ringString = "\r\n\r\n#eRings#n";
                    var pendantString = "\r\n\r\n#ePendants#n";
                    var weaponString = "\r\n\r\n#eWeapons#n";
                    var throwableString = "\r\n\r\n#eThrowables#n";

                    // Set Counters
                    var cap = 0;
                    var acc = 0;
                    var earring = 0;
                    var top = 0;
                    var overall = 0;
                    var bottom = 0;
                    var shoes = 0;
                    var gloves = 0;
                    var shield = 0;
                    var cape = 0;
                    var ring = 0;
                    var pendant = 0;
                    var weapon = 0;
                    var throwable = 0;


                    // Iterate through cashStorage
                    for (var i = 0; i < storageItems.length; i++)
                    {
                        selectionSlot++;

                        // Get values out of map
                        var itemId = storageItems[i].getKey();  // The item ID is stored as the key
                        var quantity = storageItems[i].getValue();  // The quantity is stored as the value

                        // Store Key / Map appropriately
                        removableItems.push({itemId: itemId, quantity: quantity});

                        // Get the prefix from itemId (first 3 characters)
                        var itemPrefix = String(itemId).substring(0, 3);

                        // Append the item display string for the item
                        if (quantity > 1)
                        {
                            // Use a switch statement based on itemPrefix
                            switch (itemPrefix)
                            {
                                case "100":
                                    capString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    cap++;  // Increment the cap counter
                                    break;

                                case "101":
                                case "102":
                                    accString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    acc++;  // Increment the acc counter
                                    break;

                                case "103":
                                    earringsString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    earring++;  // Increment the earring counter
                                    break;

                                case "104":
                                    topString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    top++;  // Increment the top counter
                                    break;

                                case "105":
                                    overallString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    overall++;  // Increment the overall counter
                                    break;

                                case "106":
                                    bottomString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    bottom++;  // Increment the bottom counter
                                    break;

                                case "107":
                                    shoesString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    shoes++;  // Increment the shoes counter
                                    break;

                                case "108":
                                    glovesString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    gloves++;  // Increment the gloves counter
                                    break;

                                case "109":
                                    shieldString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    shield++;  // Increment the shield counter
                                    break;

                                case "110":
                                    capeString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    cape++;  // Increment the cape counter
                                    break;

                                case "111":
                                    ringString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    ring++;  // Increment the ring counter
                                    break;

                                case "112":
                                    pendantString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    pendant++;  // Increment the pendant counter
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
                                case "170":
                                    weaponString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l";
                                    weapon++;  // Increment the weapon counter
                                    break;
                                default:
                                    weaponString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "# x " + quantity + "#l (Other)";
                                    weapon++;  // Increment the weapon counter
                                    break;
                            }
                        }

                        else
                        {
                            // Use a switch statement based on itemPrefix
                            switch (itemPrefix)
                            {
                                case "100":
                                    capString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    cap++;  // Increment the cap counter
                                    break;

                                case "101":
                                case "102":
                                    accString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    acc++;  // Increment the acc counter
                                    break;

                                case "103":
                                    earringsString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    earring++;  // Increment the earring counter
                                    break;

                                case "104":
                                    topString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    top++;  // Increment the top counter
                                    break;

                                case "105":
                                    overallString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    overall++;  // Increment the overall counter
                                    break;

                                case "106":
                                    bottomString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    bottom++;  // Increment the bottom counter
                                    break;

                                case "107":
                                    shoesString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    shoes++;  // Increment the shoes counter
                                    break;

                                case "108":
                                    glovesString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    gloves++;  // Increment the gloves counter
                                    break;

                                case "109":
                                    shieldString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    shield++;  // Increment the shield counter
                                    break;

                                case "110":
                                    capeString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    cape++;  // Increment the cape counter
                                    break;

                                case "111":
                                    ringString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    ring++;  // Increment the ring counter
                                    break;

                                case "112":
                                    pendantString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    pendant++;  // Increment the pendant counter
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
                                case "170":
                                    weaponString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l";
                                    weapon++;  // Increment the weapon counter
                                    break;
                                default:
                                    weaponString += "\r\n\t#L" + selectionSlot + "##v" + itemId + "# #t" + itemId + "##l (Other)";
                                    weapon++;  // Increment the weapon counter
                                    break;
                            }
                        }
                    }

                    // Build full string with condition checking the counter for each category
                    var finalString = defaultString;
                    if (cap > 0) finalString += capString;
                    if (acc > 0) finalString += accString;
                    if (earring > 0) finalString += earringsString;
                    if (top > 0) finalString += topString;
                    if (overall > 0) finalString += overallString;
                    if (bottom > 0) finalString += bottomString;
                    if (shoes > 0) finalString += shoesString;
                    if (gloves > 0) finalString += glovesString;
                    if (shield > 0) finalString += shieldString;
                    if (cape > 0) finalString += capeString;
                    if (ring > 0) finalString += ringString;
                    if (pendant > 0) finalString += pendantString;
                    if (weapon > 0) finalString += weaponString;

                    // Send the finalized string
                    cm.sendSimple("#w" + finalString);

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
