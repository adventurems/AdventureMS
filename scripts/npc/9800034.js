// AdventureMS Shawn

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        if (cm.getQuestStatus(1034) < 2)
        {
            cm.sendOk("Wow, we've been at this for some time. We help explorer after explorer try to tackle the ruins. Not many make it though...\r\n\r\n" +
                "You look like you have a good shot. Keep your head up and get to training!\r\n\r\n#eI hear Adventure is thinking about an exchange quest for this zone. What do you think?#n");
            cm.dispose();
        }

        else
        {
            cm.sendOk("The saviour of the #bManaforge#k, but have you have conquered Mushmom? Or have you found the rare dungeon yet?");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status === 1)
    {

    }

    // After Advancing one further
    else if (status === 2)
    {

    }
}