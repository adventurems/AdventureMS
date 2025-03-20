// Author: Pepa

// AdventureMS - Christopher

function start()
{
	if (cm.getQuestStatus(1003) == 2)
	{
	    cm.sendOk("Ah, yeah about what I said before, #r500#k days ain't so bad. I was just a bit overtired, ya know? Thanks for getting me some water, I'm feeling much better now...\r\n\r\nNow I just gotta apologize to my brother...he's a bit pushy.");
	    cm.dispose();
	} else
	{
        cm.sendOk("#r500#k days, #r500#k...\r\n\r\nThat's how long we've been hunting for this vault. Sure, we've spent some down time, here and there, but we've been going basically nonstop for #r500#k days..." +
        "\r\n\r\nHeck, I heard a kid even found something interesting, possibly even a clue to vault. We've got one ourselves, but it's just not worth it. Too long, I'm ready to pack it up..." +
        "\r\n\r\nCall me a noob, a loser, I don't care. TIME TO GO!");
        cm.dispose();
	}
}