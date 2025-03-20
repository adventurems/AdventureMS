// Author: Pepa

// AdventureMS - Oasis Fountain

function start() {
	if (!cm.haveItem(4007012))
	{
	    cm.sendOk("(you reach out a flask and collect some of the holy water from the spring...)")
	    cm.gainItem(4007012, 1);
	    cm.dispose();
	} else
	{
	    cm.dispose();
	}
}