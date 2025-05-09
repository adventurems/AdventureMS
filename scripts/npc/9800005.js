// AdventureMS - Bleeding Statue

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check if they've cleared the zone
        if (cm.getZoneProgress() < 3)
        {
            // Check if they already have the vault key
            if (!cm.haveItem(3997001) && !cm.haveItem(3997002))
            {
                cm.sendAcceptDecline("(you cautiously approach the statue...it looks as though it's about to die, there appears to be...blood???...oozing out of it)\r\n\r\n(the statue is holding a bowl filled with blood, you can only assume the key tip is in it...)\r\n\r\nDo you reach in for it?");
            }

            // They already have the key tip
            else
            {
                cm.sendOk("(you've already quenched the statues thirst for blood and #r#eretrieved the key tip#k#n...)");
                cm.dispose();
            }
        }
        // End it because they've already cleared the zone
        else
        {
            cm.sendOk("You've already cleared #bZone 3#k!");
            cm.dispose();
        }
	}
	// Status 1
	else if (status == 1)
	{
	    // Check to see if they have any red potions
	    if (cm.haveItem(2000000))
	    {
	        // Check to see if they have enough red potions
	        if (cm.itemQuantity(2000000) === 500)
	        {
                cm.sendOk("(the statue opens his mouth and begins vacuuming all of your red potions...)\r\n\r\n(the statues bleeding recedes and the statue appears to heal revealing the key tip, #r#eallowing you to grab it#k#n!");
                cm.gainItem(3997001, 1); // Gain Vault Key tip
                cm.gainItem(2000000, -500); // Remove Red Potions
                cm.dispose();
            }

            // They have red potions but not enough
            else if (cm.itemQuantity(2000000) < 500)
            {
                cm.getPlayer().updateHpMp(0); // Kill the player
                cm.sendOk("(you reach your hand into the bowl and the statue clamps down!)\r\n\r\n#r(the statue bellows out)... MORE!!!#k");
                cm.dispose();
            }

            // They have too many red potions
            else
            {
                cm.getPlayer().updateHpMp(0); // Kill the player
                cm.sendOk("(you reach your hand into the bowl and the statue clamps down!)\r\n\r\n#r(the statue bellows out)... LESS!!!#k");
                cm.dispose();
            }
        }
        // They do not have any red potions
        else
        {
            // Send Message
            cm.getPlayer().updateHpMp(0); // Kill the player
            cm.sendOk("(you reach your hand into the bowl and the statue clamps down!)\r\n\r\n#r(the statue bellows out)... DIE!!!#k");
            cm.dispose();
        }
	}
}