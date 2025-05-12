
// Doofus - Pet Merchant

var status;

// Open the shop
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;}

    // Store Selected Pet / Equip
    var foundPets = [];
    var petEquips = [];

    if (status === -1) {cm.dispose();}

    // Ask if they want to see the shop or Make a sacrifice
    else if (status === 0)
    {
        cm.sendSimple("What would you like to do?\r\n\r\n #L0#See the shop!#l"); // Sacrifice currently blocked  \r\n #L1#Make a #r#eSacrifice#k#n!#l"
    }

    // They've chosen a selection
    else if (status === 1)
    {
        // See the Shop
        if (selection === 0)
        {
            cm.openShopNPC(4000);
            cm.dispose();
        }

        // Make a Sacrifice was selected
        else if (selection === 1)
        {
            // Create an array of available pets to trade
            var pets =
            [
                5000002, 5000003, 5000004, 5000006, 5000007, 5000008, 5000009, 5000010, 5000011, 5000013,
                5000014, 5000017, 5000022, 5000023, 5000024, 5000025, 5000026, 5000029, 5000030, 5000031,
                5000032, 5000033, 5000034, 5000036, 5000037, 5000039, 5000041, 5000044, 5000045, 5000048,
                5000049, 5000050, 5000051, 5000052, 5000053, 5000055, 5000058, 5000060, 5000066, 5000100,
                5000101, 5000102
            ]

            // Loop through and count each pet
            for (i = 0; i < pets.length; i++)
            {
                // Store the count of pets in currentCount
                if (cm.getPlayer().countItem(pets[i]) > 0)
                {
                    // Insert the pet ID in the array
                    foundPets.push(pets[i]);
                }
            }

            // Check if there were any pets found that match the pets array
            if (foundPets.length > 0)
            {
                var defaultString = "Welll, it's not really a sacrifice, but I had to get your attention some how... #e#rI'll trade you matching pet equipment for the pet you want to trade in!#n#k\r\n\r\nBelow is the list of pets you have, would you like to trade any for their equipment?\r\n\r\n";
                var newString;

                // Loop through stored pets, create a new string for each, and then add that string to the existing text
                for (i = 0; i < foundPets.length; i++)
                {
                    newString = "#L" + i + "##v" + foundPets[i] + "# #t" + foundPets[i] + "##l\r\n";
                    defaultString += newString;
                }

                // Send the completed string for selection
                cm.sendSimple(defaultString);
            }

            else
            {
                cm.sendOk("You do not have any pets to trade equipment for at the moment.");
                cm.dispose();
            }
        }
    }

    // They've made a selection to sacrifice a pet
    else if (status === 2)
    {
        // Make sure they can hold an equip
        if (cm.canHold(1802000))
        {
            // Store Number of Pet(s)
            var pets =
            [
                5000002, 5000003, 5000004, 5000006, 5000007, 5000008, 5000009, 5000010, 5000011, 5000013,
                5000014, 5000017, 5000022, 5000023, 5000024, 5000025, 5000026, 5000029, 5000030, 5000031,
                5000032, 5000033, 5000034, 5000036, 5000037, 5000039, 5000041, 5000044, 5000045, 5000048,
                5000049, 5000050, 5000051, 5000052, 5000053, 5000055, 5000058, 5000060, 5000066, 5000100,
                5000101, 5000102
            ]

            // Store Pet Equips
            var equips =
            [
                1802064, 1802014, 1802002, 1802016, 1802010, 1802012, 1802065, 1802015, 1802022, 1802021,
                1802019, 1802000, 1802042, 1802030, 1802033, 1802036, 1802038, 1802006, 1802066, 1802067,
                1802068, 1802048, 1802013, 1802051, 1802027, 1802047, 1802053, 1802003, 1802055, 1802001,
                1802069, 1802004, 1802070, 1802071, 1802072, 1802060, 1802061, 1802062, 1802063, 1802054,
                1802024, 1802026
            ]

            // Loop through and count each pet
            for (i = 0; i < pets.length; i++)
            {
                // Store the count of pets in currentCount
                if (cm.getPlayer().countItem(pets[i]) > 0)
                {
                    // Insert the pet ID in the array
                    foundPets.push(pets[i]);

                    // Insert the Equip ID in the array
                    petEquips.push(equips[i]);
                }
            }

            // Remove the Pet
            cm.gainItem(foundPets[selection], -1);

            // Add the Equip
            cm.gainItem(petEquips[selection], 1);

            // Send Message
            cm.sendOk("You've successfully sacri...errrr... put your pet up for adoption!\r\n\r\nIn return you've gained:\r\n\r\n" +
            "#v" + petEquips[selection] + "# #t" + petEquips[selection] + "#");

            cm.dispose();
        }

        else
        {
            cm.sendOk("You don't have room in your #requip#k inventory to receive the equipment!");
            cm.dispose();
        }
    }
}