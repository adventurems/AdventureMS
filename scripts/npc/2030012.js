// AdventureMS Huckle

var status;

// Open the shop
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Ask if they want to see the shop or
    else if (status == 0)
    {
        cm.sendSimple("What would you like to do?\r\n\r\n #L0# See the shop! #l \r\n #L1# Learn about Huckle! #l");
    }

    // They've chosen a selection
    else if (status == 1)
    {
        // See the Shop
        if (selection == 0)
        {
            // Get Zone Progress
            switch (cm.getZoneProgress())
            {
                case 0: // No Zone Progress
                {
                    cm.openShopNPC(100);
                    cm.dispose();
                    break;
                }

                case 1: // Zone 1 Complete
                {
                    cm.openShopNPC(101);
                    cm.dispose();
                    break;
                }

                case 2: // Zone 2 Complete
                {
                    cm.openShopNPC(102);
                    cm.dispose();
                    break;
                }

                case 3: // Zone 3 Complete
                {
                    cm.openShopNPC(103);
                    cm.dispose();
                    break;
                }

                case 4: // Zone 4 Complete
                {
                    cm.openShopNPC(104);
                    cm.dispose();
                    break;
                }
                // Zone Progress bugged(?)
                default: cm.dispose(); break;
            }
        }

        // Learn About Huckle
        else
        {
            cm.sendOk("Name's Huckle!\r\n\r\nI've been traveling these lands for longer than I care to admit. I've learned a thing or two about adventurers, both young and old.\r\n\r\nI tell you what, you keep on getting stronger and I'll keep finding better items to sell ya? How about that?\r\n\r\n#r#e* Huckle's shop evolves over time. As you clear zones, Huckle's items will improve to match your power! *#k#k");
            cm.dispose();
        }
    }
}