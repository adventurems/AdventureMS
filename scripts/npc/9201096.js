// AdventureMS Jack

function start()
{
    // Check heart of the forge quest
    if (cm.getQuestStatus(1034) === 2)
    {
        // Check Jack quest
        if (cm.getQuestStatus(1027) < 2)
        {
            // Check if the player has a piece of ice already, if not, grant it
            if (!cm.haveItem(4003002)) {cm.gainItem(4003002, 1);}

            // Complete the jack quest so they get different text next time
            cm.completeQuest(1027);

            // Send Message
            cm.sendOk("Interesting, you found your way past the golem. Great job...\r\n\r\n" +
                "When you restored the forge, I saw a monster drop this #rpiece of ice#k, I'm not sure what what to do with it though.\r\n\r\n" +
                "You figured out the golem, maybe you can figure out what to do with this ice.");

            // Kill convo
            cm.dispose();
        }

        // They've gotten a piece of ice already
        else
        {
            // Check if they have the ice already
            if (cm.haveItem(4003002))
            {
                // Send Message
                cm.sendOk("Well, I'm not sure how to help ya out with this. I've been stuck trying to understand what the ice means as well...");

                // Kill Convo
                cm.dispose()
            }

            // They don't have the ice yet, give them it'
            else
            {
                // Give them the ice
                cm.gainItem(4003002, 1);

                // Send Message
                cm.sendOk("Lost your ice? It just so happens that I have another! Here ya go...");

                // Kill Convo
                cm.dispose()
            }
        }
    }

    // They haven't cleared the forge yet
    else if (cm.getQuestStatus(1023) === 2)
    {
        cm.sendOk("After I finished that quest, #bVicious#k noted that one of the pillars at the ruins moved. Now I notice the boss room has changed, that's odd.\r\n\r\nSeems like it was important that we finished that quest.\r\n\r\nI've been trying to figure out how to beat these golems now. Seems like I've got plenty of time, but I can't hit them, what gives?");
        cm.dispose();
    }

    else
    {
        cm.sendOk("Oh baby, this boss is so tanky. Seems unreasonable to brute force your way through, maybe there is another way? We got to get to thinkin!");
        cm.dispose();
    }
}