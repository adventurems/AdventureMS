// AdventureMS Corine

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
                cm.sendYesNo("Well, well, well... You look quite delicious. Even more appetizing if you share that gear with me!\r\n\r\n#eWould you like to side with Corine and give her the gear?#n");
            }

            // They don't have the items
            else
            {
                cm.sendOk("No gear yet? Surely a capable adventurer such as yourself is going to deliver! Is #bRobin#k trying to make you feel all good inside? Don't pay any attention... I'm not convinced she isn't a witch!");
                cm.dispose();
            }
        }

        // The original quest is completed, see who they chose
        else if (cm.getQuestStatus(1017) == 2) // Robin was chosen
        {
            cm.sendOk("I can't believe it. Do NOT talk to me again.");
            cm.dispose();
        }

        // They chose Corine to give gear to
        else if (cm.getQuestStatus(1018) == 2) // Corine was chosen
        {
            cm.sendOk("I know I look great for you, thanks again beautiful...");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status == 1)
    {
        // They do have the items and chose to turn them in
        cm.sendOk("I expected nothing less from you.\r\n\r\nHave this as a token of my appreciation!\r\n#v1142204# #t1142204#");

        // Give/take items
        cm.gainItem(1041061, -1); // Remove top
        cm.gainItem(1061057, -1); // Remove bottom
        cm.gainItem(1142204, 1); // Corine Medal
        cm.gainExp(75000); // Give exp
        cm.gainFame(1); // Give fame

        // Complete the quest
        cm.completeQuest(1014); // Dual quest
        cm.completeQuest(1018); // Corine Specific Quest

        // Kill convo
        cm.dispose();
    }
}