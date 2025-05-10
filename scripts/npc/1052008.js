// AdventureMS Lost Treasure #1 (Hill)

function start()
{
    // Check that we have started Hill's quest
    if (cm.getQuestStatus(1016) === 1)
    {
        // Check that we can hold the Moon Rock
        if (cm.canHold(4011007, 1))
        {
            // Gain Items
            cm.gainItem(4011007, 1); // Moon Rock
            cm.gainItem(3997006, -1) // Take the Map
            cm.gainMeso(1000000); // Mesos
            cm.gainExp(75000); // Exp

            // Complete Quest
            cm.completeQuest(1016);

            // Send Message
            cm.sendOk("You found the chest! You eagerly break it open to find:\r\n#v5200002# 1,000,000 Mesos\r\n#v4011007# #t4011007#!");
            cm.warp(100000203, "west00");

            // Kill convo
            cm.dispose();
        }

        // Their ETC inventory is full
        else
        {
            cm.sendOk("You don't have room in your #rETC#k inventory to receive the item!");
            cm.dispose();
        }
    }

    // They've already looted the chest
    else
    {
        cm.sendOk("You've already looted the chest!");
        cm.dispose();
    }
}