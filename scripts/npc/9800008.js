// Author: Pepa

// AdventureMS - White Lady

function start()
{
    status = -1;
    action(1,0,0);
}

function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Intro and Quest Status Check
    else if (status == 0)
    {
        // Check if they already have the medal
        if (cm.getQuestStatus(1000) == 2)
        {
            // Already earned the medal
            cm.sendOk("Would you really have saved me? You would have been risking your own life...\r\n\r\nKeep that #rmedal#k, it's one of five very rare medals to be traded in...");
            cm.dispose();
        } else if (cm.getQuestStatus(1000) == 0)
        {
            // Start Quest to avoid starting prompt everytime
            cm.startQuest(1000);
            // Intro
            cm.sendNext("(at first she barely notices you, she slowly turns around and stares intently at you)\r\n\r\nI've not seen you before...are you the one that killed me?...");
        }
        else
        {
            // Reintro w/ gear check
            cm.sendNext("You've come back...let's see if you've improved your gear...");
        }
    }
    // Equipment HP Check and response
    else if (status == 1)
    {
        // Store vars for use
        var equipStats = cm.getPlayer().getEquipStats(); // Returns all stats for equipment
        var goalHP = 2000; // This is the goal HP to have on gear
        var hpdif = goalHP - equipStats[0]; // Calculate the difference

        // Checks if we have passed expected max/max (based on lvl 120) 60% for DEF scrolls on all slots
        if (equipStats[0] >= goalHP)
        {
            cm.sendAcceptDecline("O.o? ...You've done it... You would have survived the attack.\r\n\r\n...but...would you have protected me?");
        } else
        {
            if (hpdif > 6000) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rYou are not close at all...");}
            else if (hpdif > 4500) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rYou have a long way to go still...");}
            else if (hpdif > 3000) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rKeep going, your gear is getting better...");}
            else if (hpdif > 1500) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rYou are getting much closer, but still have a ways to go...");}
            else if (hpdif > 750) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rYou are pretty close now, just not quite there...");}
            else if (hpdif > 0) {cm.sendOk("...no...you don't look like the one that killed me, they were much stronger...\r\n\r\nYou would not have survived either. If your #e#requipment had more HP#n#k you may have been able to.\r\n\r\n#rYou are very close... #r" + hpdif + " HP#k left to go...");}
            cm.dispose();
        }

    // They've pressed "yes" that they would have protected her
    } else if (status >= 2)
    {
        cm.sendOk("...I'm not sure I trust you, as there aren't many I do trust anymore...\r\n\r\nHowever, you've earned this, a real tank, deserving of the title...\r\n\r\n#i1142200# #t1142200#");
        cm.gainItem(1142200, 1);
        cm.completeQuest(1000);
        cm.dispose();
    }
}