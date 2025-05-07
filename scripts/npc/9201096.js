// AdventureMS Jack

function start()
{
    // Check heart of the forge quest
    if (cm.getQuestStatus(1026) === 2)
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
    else
    {
        cm.sendOk("I've been trying to figure out how to beat this golem for so long. I'm clearly not strong enough to beat it. Seems like I've got plenty of time, but I can't event hit it...");
        cm.dispose();
    }
}