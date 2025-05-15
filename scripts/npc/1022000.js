// AdventureMS Job Advance - Dances with Balrog

function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    else if (status === 0)
    {
        // Variables
        actionx = {"1stJob" : false, "2ndJob" : false, "2ndJobT" : false, "3thJobI" : false, "3thJobC" : false};
        Job = cm.getJobId();

        // They are beginners
        if (Job === 0)
        {
            // Set Action to 1st Job
            actionx["1stJob"] = true;

            // Start the Prompt
            cm.sendNext("You look like a good candidate for a #rwarrior#k! Let's see if you've met the requirements.");   // thanks Vcoc for noticing a need to state and check requirements on first job adv starting message
        }

        // They are ready for 2nd job
        else if (cm.getLevel() >= 30 && Job == 100)
        {
            // Set Action to 2nd Job
            actionx["2ndJob"] = true;

            if (cm.getZoneProgress() === 3)
            {
                // Start the prompt
                cm.sendSimple("Ah #h #, you've done it!\r\n\r\nYou are looking great, congratulations on reaching level 30 and clearing #bZone 3#k!" +
                "\r\n\r\n#r#eThis decision is FINAL! Which class would you like to be#k#n?\r\n\r\n#L0#I'd like to be a #rFighter#k!#l\r\n#L1#I'd like to be a #rPage#k!#l\r\n#L2#I'd like to be a #rSpearman#k!#l");
            }

            else
            {
                cm.sendOk("You are level 30, but you have not cleared #bZone 3#k! Clear #bThe Vault#k!");
                cm.dispose();
            }
        }

        // Not ready for a job advancement
        else
        {
            switch (Job)
            {
                // Warriors
                case 100:
                case 110:
                case 111:
                case 112:
                case 120:
                case 121:
                case 122:
                case 130:
                case 131:
                case 132:
                {
                    cm.sendOk("You are not ready for the next advancement...\r\n\r\nSee me at levels #r10#k, #r30#k, #r70#k and #r120#k!");
                    cm.dispose();
                    break;
                }

                // Any other job
                default:
                {
                    cm.sendOk("Looks like you have chosen another path...");
                    cm.dispose();
                    break;
                }
            }
        }
    }

    else if (status === 1)
    {
        if (actionx["1stJob"])
        {
            if (cm.getLevel() >= 10 && cm.haveItem(4032120))
            {
                cm.sendYesNo("You are the correct #blevel#k and have the #bProof of Qualification#k. This decision is #rfinal#k. Would you like to become a #rwarrior#k?");
            }

            else if (cm.getLevel() <= 9)
            {
                cm.sendOk("Looks like you aren't level 10 yet! Come back after you've done some more training.");
                cm.dispose();
            }

            else
            {
                cm.sendOk("You've not proven your worth. You don't have the #bProof of Qualification#k! Defeat #bBob#k and return with proof.")
                cm.dispose();
            }
        }

        else if (actionx["2ndJob"])
        {
            // Confirmed their job selection
            if (selection === 0) {newJob = 110; newJobName = "Fighter";} else if (selection === 1) {newJob = 120; newJobName = "Page";} else if (selection === 2) {newJob = 130; newJobName = "Spearman";}

            // Send Message
            cm.sendOk("Congratulations on your success! You've proven to be a great adventurer and have achieved a new level of power! You are now a #r" + newJobName + "#k!\r\n\r\n" +
            "As part of your transformation, you've gained 4 slots in each category!\r\n\r\nIf your exp was locked, it is now UNLOCKED." +
            "\r\n\r\nGood luck on your journey, come back to me once you've reached level 70!");

            // Change Job
            cm.changeJobById(newJob);

            // Add Slots
            cm.getPlayer().gainSlots(1, 4, true);
            cm.getPlayer().gainSlots(2, 4, true);
            cm.getPlayer().gainSlots(3, 4, true);
            cm.getPlayer().gainSlots(4, 4, true);

            // Turn off EXP Block
            cm.getPlayer().stopExpOff();

            // Take Proof
            if (cm.haveItem(4031012))
            {
                cm.gainItem(4031012, -1);
            }

            cm.dispose();
        }
    }

    else if (status == 2)
    {
        if (actionx["1stJob"])
        {
            // Required Variables
            var jobid = 100;
            var weapon1 = 1302077;
            var skill1 = 1100000;
            var skill2 = 1200001;
            var skill3 = 1300000;

            // Optional Variables
            var weapon2;
            var throwable;
            var throwableAmount;

            // Required Variables
            var randy = Math.floor(Math.random() * 101);
            var pet; if (randy < 45) {pet = 5000000;} else if (randy < 90) {pet = 5000001;} else {pet = 5000005;} // Brown Kitty / Brown Puppy / White Bunny

            // Check for room
            if (cm.canHoldAll([weapon1, weapon1, 1142085, pet, 5140000, 2000000, 2000003, 2000003]))
            {
                // Variable
                cm.changeJobById(jobid); // Change Job
                cm.gainItem(weapon1, 1); // Gain weapon1
                if (weapon2) {cm.gainItem(weapon2, 1);} // Gain weapon2
                if (throwable) {cm.gainItem(throwable, throwableAmount)}; // Gain Throwable
                cm.teachSkill(skill1, 10, 30, -1, true); // Teach Sword Mastery
                cm.teachSkill(skill2, 10, 30, -1, true); // Teach Blunt Mastery
                cm.teachSkill(skill3, 10, 30, -1, true); // Teach Spear Mastery

                // The Same for All Jobs
                if (cm.haveItem(3991000)) {cm.gainItem(3991000, -1);} // Remove Key if they have it
                cm.gainItem(4032120, -1); // Take Proof
                cm.gainItem(1142085, 1); // Medal
                cm.gainItem(pet, 1, false, true, 7700000000); // Gain a Random Pet
                cm.gainItem(5140000, 1); // Gain Shop Permit
                cm.gainItem(2000000, 50); // Red Pots
                cm.gainItem(2000003, 25); // Blue Pots
                cm.resetStats(); // Reset Player Stats for job advancement
                cm.getPlayer().gainSlots(1, 12, true); // Gain Slots
                cm.getPlayer().gainSlots(2, 4, true); // Gain Slots
                cm.getPlayer().gainSlots(3, 4, true); // Gain Slots
                cm.getPlayer().gainSlots(4, 4, true); // Gain Slots
                cm.getPlayer().stopExpOff(); // Turn off EXP Block
                cm.getPlayer().updateZoneProgress(); // Update Zone Progress

                // Send Message
                var defaultString = "Congratulations on becoming a(n) #b#e" + cm.getPlayer().getJob() +  "#k#n!\r\n\r\n#r#eThe following changes have occurred:#n#k\r\n\r\n- Your exp has been unlocked\r\n- You've gained 4 slots in each tab\r\n- Huckles shop has been updated\r\n\r\n#r#eYou've gained the following items as well:#n#k\r\n\r\n#v1142085# #t1142085#\r\n#v" + pet + "# #t" + pet + "#\r\n#v5140000# #t5140000#\r\n#v" + weapon1 + "# #t" + weapon1 + "#";
                if (weapon2) {defaultString += "\r\n#v" + weapon2 + "# #t" + weapon2 + "#";}
                if (throwable) {defaultString += "\r\n#v" + throwable + "# #t" + throwable + "# " + throwableAmount;}
                defaultString += "\r\n#v2000000# #t2000000# 50\r\n#v2000003# #t2000003# 25";

                // Send Compiled Message
                cm.sendNext(defaultString);
            }

            // They can't hold stuff
            else
            {
                cm.sendNext("I'd like to give you some gifts! You need the following room:\r\n\r\n- 3 slots in EQUIP\r\n- 3 slots in USE\r\n- 2 slots in CASH");
                cm.dispose();
            }
        }
    }

    // Further Status
    else if (status == 3)
    {
        if (actionx["1stJob"])
        {
            cm.sendNextPrev("You've gotten much stronger now. You've earned some \r\n#bSkill Points#k. Use skill points in the skill book!");
        }
    }

    // Further Status
    else if (status == 4)
    {
        if (actionx["1stJob"])
        {
            cm.sendOk("Make sure to put your ability points into STR. You can go #rDEXless#k without worry! This is all I can teach you for now. Visit me again at Lvl 30. Good luck on your journey, young warrior!");
            cm.dispose();
        }
    }

    // Status gets out of whack? Dispose?
    else
    {
        cm.dispose();
    }
}