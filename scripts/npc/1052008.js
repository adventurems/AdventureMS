// AdventureMS Lost Treasure #1 (Hill)

function start()
{

}

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        // Check that we have started Hill's quest
        if (cm.haveItem(3997006, 1))
        {
            // Check that we can hold the Moon Rock
            if (cm.canHold(4011007, 1))
            {
                // Send Message
                cm.sendNext("You found the chest! You eagerly break it open to find:\r\n#v5200002# 1,000,000 Mesos\r\n#v4011007# #t4011007#");
            }

            // Their ETC inventory is full
            else
            {
                cm.sendOk("You don't have room in your #rETC#k inventory to receive the item!");
                cm.dispose();
            }
        }

        // They've already looted the chest
        else if (cm.getQuestStatus(1016) === 2)
        {
            cm.sendOk("You've already looted the chest!");
            cm.dispose();
        }

        else
        {
            cm.sendOk("You don't have the map from #rHill#k!");
            cm.dispose();
        }
    }

    // After pressing yes/next
    else if (status === 1)
    {
        // Gain Items
        cm.gainItem(4011007, 1); // Moon Rock
        cm.gainItem(3997006, -1) // Take the Map
        cm.gainMeso(1000000); // Mesos
        cm.gainExp(75000); // Exp

        // Warp back to Kora
        cm.warp(100000203, "west00");

        // Kill convo
        cm.dispose();
    }
}