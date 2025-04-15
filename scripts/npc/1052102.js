// AdventureMS Shumi

function start()
{
    // Check Fame Level & Quest Status
    if (cm.getQuestStatus(1010) == 0)
    {
        // Check if they have the fame yet
        if (cm.getPlayer().getFame() > 0)
        {
            // Gain the item
            cm.gainItem(4007014, 1);

            // Complete the quest
            cm.completeQuest(1010);

            // Instruct them to go see Andre in the barbershop
            cm.sendOk("Hmph, seems like you are getting more popular...\r\n\r\nHere have this:\r\n\r\n" +
            "#v4007014# #t4007014#\r\n\r\nTake that over to the #bKerning Barbershop#k and see #rDon Giovanni#k, he'll take care of you...");

            // Kill Convo
            cm.dispose();
        }

        // They have completed the zone boss
        else if (cm.getQuestStatus(2217) == 2)
        {
            cm.sendOk("Well, you killed the king... So thanks for that.\r\n\r\n#eYou still aren't popular though...#n");
            cm.dispose();
        }

        // They've not completed the zone boss
        else
        {
            cm.sendOk("Earthquakes, smog, my money is in the sewer... Ugh...\r\n\r\nWho are you...? My agent says I should only hang around other popular people...\r\n\r\nMy stylists backed him up and said to send other popular people their way...\r\n\r\n#eCome back when you are more popular...#n");
            cm.dispose();
        }
    }

    // They have completed the zone boss
	else if (cm.getQuestStatus(2217) == 2)
	{
	    cm.sendOk("Well, you killed the king... and you got a free makeover. Whether your like it or not, seems like a win! Come watch one of my concerts some day, okay?");
	    cm.dispose();
	}

	// They've not completed the zone boss
	else
	{
        cm.sendOk("Earthquakes, smog, my money is in the sewer... Ugh...\r\n\r\nWell, at least you got a free makeover, your day is a little better than mine.");
        cm.dispose();
	}
}