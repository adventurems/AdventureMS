// AdventureMS Dungeon Guide

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

	// Initial Click
	else if (status == 0)
	{
		cm.sendYesNo("Would you like to leave the dungeon? #eYou cannot get back in!#n");
	}

	// They want to leave the dungeon
	else if (status == 1)
	{
		// Get the event instance & exit the player
		var eventInstance = cm.getPlayer().getEventInstance();
		eventInstance.removePlayer(cm.getPlayer());
		cm.dispose();
	}
}