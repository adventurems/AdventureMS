// Author: Pepa

// AdventureMS - Ayan Stoneweaver

function start()
{
    // They've completed the blanket quest
	if (cm.getQuestStatus(28270) == 2)
	{
	    cm.sendOk("Zara proving she is ready to be out on her own and Thorne tucked away nicely in his new blanket. A good day for my children..." +
	    "\r\n\r\n(Ayan begins telling Thorne a story...)" +
	    "\r\n\r\nFive adventurers embarked on a quest to destroy the monster that plagued their world. " +
        "They faced daunting trials and overcame formidable foes, their unity and bravery guiding them through the darkness. When they finally reached the heart of the ruins," +
        "they discovered that the only way to enter was to relinquish their weapons and power, embracing vulnerability. Reluctantly, they laid down their arms and in a flash of" +
        " light...(Little Thorne dozes off)...");
	    cm.dispose();
	}
    // They've only completed Zara's quest
	else if (cm.getQuestStatus(28269) == 2)
	{
	    cm.sendOk("Little Zara brought back those resources faster than I thought she could... Maybe she is ready to go out vault hunting on her own.");
        cm.dispose();
	}
    // Neither quest is done
	else
	{
	    cm.sendOk("Little Zara is still out there, I had a feeling she wasn't ready to be on her own yet, she's still a bit young...");
        cm.dispose();
	}
}