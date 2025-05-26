// AdventureMS Joko - Speed Demon

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        // Check if they already have the medal
        if (cm.getQuestStatus(1029) === 2)
        {
            // Already earned the medal
            cm.sendOk("I bet you barely saw that, huh?  I still think I'm faster than you...\r\n\r\nKeep that #rmedal#k, it's one of rare medals to be traded in...");
            cm.dispose();
        }

        // First time talking to him
        else if (cm.getQuestStatus(1029) === 0)
        {
            // Start Quest to avoid starting prompt everytime
            cm.startQuest(1029);

            // Intro
            cm.sendNext("(whoosh)...\r\n\r\n(what was that?)\r\n\r\nHI! Hahahaha, you barely saw me enter, huh? I might not look it, but I'm the fastest person in this world.\r\n\r\n" +
                "(this guy can't be serious)\r\n\r\nI know what you are thinking 'this guy can't be serious', blah blah blah... It's true, I really am faster than you and everyone else. " +
            "Here, I'll show you!\r\n\r\n(he proceeds to run as fast as he can around the room, in what looks like slow motion)\r\n\r\nYeah, did you see that? Lightning fast!" +
            " Anyway, since you think you're sooooo fast. Why don't you show me your gear? There's no way it's better than mine!");
        }

        else
        {
            // Reintro w/ gear check
            cm.sendNext("Idk, you looked pretty slow comin through that door. Let's see if you've improved your gear...");
        }
    }

    // After pressing yes/next
    else if (status === 1)
    {
        // Store vars for use
        var equipStats = cm.getPlayer().getEquipStats(); // Returns all stats for equipment
        var goalSpeed = 250; // This is the goal speed to have on gear
        var speeddif = goalSpeed - equipStats[2]; // Calculate the difference

        if (equipStats[2] >= goalSpeed)
        {
            cm.sendAcceptDecline("Oh wait...you are fast. This can't be right, with this gear, you should be faster than me...\r\n\r\n" +
            "I guess you are deserving of this then...I'm not a sore loser! I'll give you a medal for your hard work!");
        }

        // They've not got enough speed on their gear yet
        else
        {
            // Store the default text
            var defaultString = "Yeaaahhhh, you ain't fast enough yet.\r\n\r\n";

            if (speeddif <= 50) {cm.sendOk(defaultString + "#rYou are very close... " + speeddif + " Speed left to go...#k");}
            else if (speeddif <= 100) {cm.sendOk(defaultString + "#rMoving on to the final stretch...#k");}
            else if (speeddif <= 150) {cm.sendOk(defaultString + "#rYou are just about half way...keep it up...#k");}
            else if (speeddif <= 200) {cm.sendOk(defaultString + "#rYou have a long way to go still...about a fifth of the way...#k");}
            else {cm.sendOk(defaultString + "#rYou are not close at all...#k");}

            // Kill the convo
            cm.dispose();
        }
    }

    // After Advancing one further
    else if (status === 2)
    {
        // Check if they can hold it
        if (cm.canHold(1142206))
        {
            cm.sendOk("Not many people with one of these out there...\r\n\r\nYou've earned it though, a real speed demon, deserving of the title...\r\n\r\n#i1142206# #t1142206#");
            cm.gainItem(1142206, 1);
            cm.completeQuest(1029);
            cm.dispose();
        }

        // They don't have room
        else
        {
            cm.sendOk("Make some room in your #rEQUIP#k tab there! I've got a real nice medal for ya!");
            cm.dispose();
        }
    }
}