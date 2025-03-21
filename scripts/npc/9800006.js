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

            // Get Disease enum
            var Disease = Java.type('client.Disease');

            // Clear any existing debuffs on the player
            pi.getPlayer().dispelDebuffs();

            // Define the available skills array
            var skills = ['SEAL', 'POISON', 'CONFUSE', 'SLOW', 'CURSE'];

            // Function to get a random element from the skills array
            function getRandomSkills(skills, count) {
                var selectedSkills = [];
                var skillsCopy = skills.slice(); // Copy the array to avoid mutation
                while (selectedSkills.length < count && skillsCopy.length > 0) {
                    var randomIndex = Math.floor(Math.random() * skillsCopy.length);
                    var skill = skillsCopy.splice(randomIndex, 1)[0]; // Remove the selected skill
                    selectedSkills.push(skill);
                }
                return selectedSkills;
            }

            // Randomly select 3 skills
            var selectedSkills = getRandomSkills(skills, 3);

            // Apply debuffs for the randomly selected skills
            selectedSkills.forEach(function(skill) {
                // Get the disease for the selected skill using the Disease enum
                var disease = Disease.getBySkill(Disease[skill].getMobSkillType());

                // If a valid disease exists for the selected skill
                if (disease != null) {
                    // Get the corresponding MobSkill for the skill at level 1 using the new method
                    var mobSkill = pi.getMobSkillByType(disease.getMobSkillType(), 1);

                    // Apply the debuff to the player
                    pi.getPlayer().giveDebuff(disease, mobSkill); // Pass Disease (not MobSkillType) to giveDebuff
                }
            });
        }
	}
}