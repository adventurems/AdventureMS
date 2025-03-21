// Author: Pepa

// AdventureMS - Diseased Statue

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
            if (!cm.haveItem(3996008) && !cm.haveItem(3997002))
            {
                cm.sendAcceptDecline("(you cautiously approach the statue...it looks 'sick'...)\r\n\r\nShould you attempt to purify it?");
            }

            // They already have the key handle
            else
            {
                cm.sendOk("(the statue appears to have been purified and the compartment is empty, #r#eyou've already retrieved the key handle#k#n...)");
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
	    // You do have the holy water
	    if (cm.haveItem(4007012))
	    {
	        // Check to see if they already have the key handle
	        if (!cm.haveItem(3996008))
	        {
                cm.sendOk("(you apply the #rpurifying water#k gathered from the hidden oasis...)\r\n\r\n(the statue begins to heal and a small compartment opens, revealing the handle to the vault key!");
                cm.gainItem(3996008, 1); // Gain Vault Key Handle
                cm.gainItem(4007012, -1); // Remove Holy Water
                cm.gainExp(10000);
                cm.dispose();
            }
            // They do have the key handle already
            else
            {
                cm.sendOk("(the statue is purified, but you already have the handle to the key...the compartment is empty...");
                cm.dispose();
            }
        }
        // You do not have the holy water
        else
        {
            // Send Message
            cm.sendOk("(you reach out to touch the statue...)\r\n\r\n#r#e(the statue infects you with several diseases...)");
            cm.dispose();

            // Define Variables
            var Disease = Java.type('client.Disease');

            // Create an array of pairs, where each pair contains a disease and its corresponding skill
            var debuffs = [
                { disease: Disease.getBySkill(Disease.SEAL.getMobSkillType()), skill: cm.getMobSkill(120, 1) },
                { disease: Disease.getBySkill(Disease.POISON.getMobSkillType()), skill: cm.getMobSkill(125, 1) },
                { disease: Disease.getBySkill(Disease.CONFUSE.getMobSkillType()), skill: cm.getMobSkill(132, 1) },
                { disease: Disease.getBySkill(Disease.SLOW.getMobSkillType()), skill: cm.getMobSkill(126, 1) },
                { disease: Disease.getBySkill(Disease.CURSE.getMobSkillType()), skill: cm.getMobSkill(124, 1) }
            ];

            // Function to get a random integer between min (inclusive) and max (exclusive)
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            // Set how many curses you want to apply (up to 3)
            var curseCount = 3; // You can change this value as needed

            // Loop to apply random curses up to 'curseCount' times (e.g., 3 times)
            var appliedCurses = new Set(); // To avoid applying the same curse more than once

            for (var i = 0; i < curseCount; i++) {
                var randomIndex = getRandomInt(0, debuffs.length); // Get a random index
                var debuff = debuffs[randomIndex]; // Select a random debuff

                // Ensure we don't apply the same curse multiple times
                if (!appliedCurses.has(debuff.disease)) {
                    cm.getPlayer().giveDebuff(debuff.disease, debuff.skill); // Apply the debuff
                    appliedCurses.add(debuff.disease); // Mark this curse as applied
                } else {
                    // If the curse was already applied, retry the loop to get a different one
                    i--;
                }
            }
        }
	}
}