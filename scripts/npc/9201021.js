// AdventureMS Robin the Huntress

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        // Check if the quest is completed
        if (cm.getQuestStatus(1014) < 2)
        {
            // Check if they have the items
            if (cm.haveItem(1041061) && cm.haveItem(1061057))
            {
                cm.sendYesNo("Oh! Hey cutie! Are those for me?\r\n\r\n#eWould you like to side with Robin and give her the gear?#n");
            }

            // They don't have the items
            else
            {
                cm.sendOk("Hey Cutie! Any luck with that gear? I'm really excited for you to see me in it ;)! Remember, don't give it to #bCorine#k, she seems cute and cuddly, but she is EVIL!");
                cm.dispose();
            }
        }

        // The original quest is completed, see who they chose
        else if (cm.getQuestStatus(1017) == 2) // Robin was chosen
        {
            cm.sendOk("How do I look? Are you happy with your choice, hun?");
            cm.dispose();
        }

        // They chose Corine to give gear to
        else if (cm.getQuestStatus(1018) == 2)
        {
            cm.sendOk("I can't believe it. Do NOT talk to me again.");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status == 1)
    {
        // They do have the items and chose to turn them in
        cm.sendOk("Amazing, I'm going to look great in these for you!\r\n\r\nHave this as a token of my appreciation!\r\n#v1142203# #t1142203#");

        // Give/take items
        cm.gainItem(1041061, -1); // Remove top
        cm.gainItem(1061057, -1); // Remove bottom
        cm.gainItem(1142203, 1); // Robin Medal
        cm.gainExp(75000); // Give exp
        cm.gainFame(1); // Give fame

        // Complete the quest
        cm.completeQuest(1014); // Dual quest
        cm.completeQuest(1017); // Robin Specific Quest

        // Kill convo
        cm.dispose();
    }
}