// AdventureMS Utah's Pet Tests
var em = null;

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    if (status == 0)
    {
        if (cm.getQuestStatus(1021) === 1)
        {
            // Set the Event
            em = cm.getEventManager("TheFarmEvent");

            // Error Checking
            if (em == null)
            {
                cm.sendOk("The Farm has encountered an error. Please report this in the bugs section of #bDiscord#k!");
                cm.dispose();
                return;
            }

            // Send first message
            cm.sendSimple("Hey #h #!\r\n\r\n My grandma and I think you are ready to get your first pet skill! I can teach your pet to be super fast my like hedgehog, Sonic." +
                "\r\n\r\nAll you gotta do is bonk those chickens as fast as you can and get the #rgolden egg#k before time runs out. You think you can do that?\r\n\r\n" +
                "#L0#I'm ready to give it a go!#l\r\n#L1#Hmmm, not quite yet, I'll be back!#l");
        }

        // No active quests right now
        else
        {
            cm.sendOk("Doesn't seem like there is anything I can teach you right now! Get back out there and start training!");
            cm.dispose();
        }
    }

    // They made a choice
    else if (status == 1)
    {
        // They chose to start the test
        if (selection == 0)
        {
            if (cm.getParty() == null)
            {
                /*
                // Cancel Buffs
                cm.getPlayer().cancelAllBuffs(false);

                // Get Disease enum
                var Disease = Java.type('client.Disease');

                // Clear any existing debuffs on the player
                cm.getPlayer().dispelDebuffs();

                // Get the disease for SEAL using the Disease enum
                var sealDisease = Disease.getBySkill(Disease.SEAL.getMobSkillType());  // Correctly accessing the MobSkillType from Disease

                // If a valid disease exists for SEAL
                if (sealDisease != null) {
                    // Get the corresponding MobSkill for SEAL at level 1 using the new method
                    var sealMobSkill = cm.getMobSkillByType(sealDisease.getMobSkillType(), 1);

                    // Apply the SEAL debuff to the player using Disease (not MobSkillType)
                    cm.getPlayer().giveDebuff(sealDisease, sealMobSkill); // Pass Disease (not MobSkillType) to giveDebuff
                }*/

                if (!em.startInstance(cm.getPlayer()))
                {
                    cm.sendOk("Someone else is already attempting the test on this channel, just a moment!");
                    cm.dispose();
                }
            }

            // They are in a party
            else
            {
                cm.sendOk("You must take on the test alone, please leave your party.!");
                cm.dispose();
            }
        }

        // They chose not to attempt it
        else if (selection == 1)
        {
            cm.dispose();
        }
    }
}