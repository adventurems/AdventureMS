// AdventureMS - Cash Gachapon

var cashTicket = 5220000;
var petTicket = 5220020;
var status;

// Open the shop
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Conversation Start
    if (status == 0)
    {
        // Get NPC
        var NPC = cm.npc;

        cm.sendOk("You don't have any #rcash gachapon#k tickets...");
        cm.dispose();

        /*
        // Check for Cash Gachapon NPC
        if (NPC == 9100100)
        {
            // Check for Cash Ticket
            if (cm.haveItem(cashTicket))
            {
                cm.sendYesNo("You have #rcash gachapon#k tickets. Would you like to try your luck?");
            }

            // No tickets in Inventory
            else
            {
                cm.sendOk("You don't have any #rcash gachapon#k tickets...");
                cm.dispose();
            }
        }*/

        // Check for Pet Gachapon NPC
        else if (NPC == 9100101)
        {
            // Check for Pet Ticket
            if (cm.haveItem(petTicket))
            {
                cm.sendYesNo("You have #rpet gachapon#k tickets. Would you like to try your luck?");
            }

            // No tickets in Inventory
            else
            {
                cm.sendOk("You don't have any #rpet gachapon#k tickets...");
                cm.dispose();
            }
        }
    }

    // They want to use a ticket
    else if(status == 1)
    {
        // Get NPC
        var NPC = cm.npc;

        // Check if it is Cash Gachapon NPC
        if (NPC == 9100100)
        {
            // Make sure they have a slot available in equip inventory
            if(cm.canHold(1300007))
            {
                cm.gainItem(cashTicket, -1);
                cm.doCashGachapon();
            }

            // They don't have any space
            else
            {
                cm.sendOk("Please have at least one slot in your #rEQUIP#k inventory free.");
            }
        }

        // Check if it is Pet Gachapon NPC
        else if (NPC == 9100101)
        {
            // Make sure they have a slot available in cash inventory
            if(cm.canHold(5010000))
            {
                cm.gainItem(petTicket, -1);
                cm.doPetGachapon();
            }
        }

        // Dispose no matter what
        cm.dispose();
    }
}