// Author: Pepa

// AdventureMS - Shining Statue

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
            if (!cm.haveItem(3996009) && !cm.haveItem(3997002))
            {
                cm.sendAcceptDecline("(you cautiously approach the statue...the ominous statue has a fierce aura about it and it makes you feel anxious...)\r\n\r\n(through the light you can barely see the key shaft floating in it's hand...)\r\n\r\nShould you attempt to grab it?");
            }

            // They already have the key shaft
            else
            {
                cm.sendOk("(the statue has acknowledged your vulnerability once again, #r#ebut you already possess the key shaft#k#n...)");
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
	    // Check to see if they have their weapon unequiped
	    if (cm.getPlayer().isWeaponEquipped() === false)
	    {
	        // Check to see if they already have the key shaft
	        if (!cm.haveItem(3996009) && !cm.haveItem(3997002))
	        {
                cm.sendOk("(the statue recognizes that you have embraced vulnerability by laying down your weapon...#r#eallowing you to approach and take the key shaft#k#n)!");
                cm.gainItem(3996009, 1); // Gain Vault Key shaft
                cm.dispose();
            }
            // They do have the key shaft already
            else
            {
                cm.sendOk("(the statue recognizes that you have embraced vulnerability by laying down your weapon...but you #e#ralready have the shaft to the key#k#n...");
                cm.dispose();
            }
        }
        // You have a weapon equipped
        else
        {
            // Send Message
            cm.warp(101040002, 0); // Send to Stoneweaver Village
            cm.sendOk("(you reach out to grab the key...and in a flash of light...)\r\n\r\n#r#e(the statue rejects your presence and sends you back to the nearby village...)\r\n\r\n#e#rWhy would it send me back here?#k#n");
            cm.dispose();
        }
	}
}