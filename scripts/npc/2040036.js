// AdventureMS - Red Balloon

function start()
{
	// Default text
	cm.sendOk("Oh wow, you found me! I'm the easiest to find!");

	// Give item
	if (!cm.haveItem(3996010)) {cm.gainItem(3996010, 1);}
	cm.dispose();
}