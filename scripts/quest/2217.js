// Standard Status Code
var status = -1;
function start() {status = -1; action(1,0,0);}
function end(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {qm.dispose();}

    // Start
    else if (status === 0)
    {
        qm.sendNext("You did it. I can't believe it, you really did it.\r\n\r\n#e#h ##n, the city is eternally grateful.\r\n\r\nSince we stopped #rGold Richie#k, the air has already lightened up... and now, with #rKing Slime#k gone, the citizens can rest easy.");
    }

    // After pressing yes/next
    else if (status === 1)
    {
        if (qm.canHoldAll([1142086, 1051017]))
        {
            // Update Zone Progress
            qm.getPlayer().updateZoneProgress();
            qm.getPlayer().stopExpOff();

            // Gain Slots
            qm.getPlayer().gainSlots(1, 4, true);
            qm.getPlayer().gainSlots(2, 4, true);
            qm.getPlayer().gainSlots(3, 4, true);
            qm.getPlayer().gainSlots(4, 4, true);

            // Item Removal
            qm.gainItem(3996020, -1); // Miniature
            if (qm.haveItem(3997000)) {qm.gainItem(3997000, -1);} // Key

            // Item Gain
            qm.gainItem(1142086, 1); // Medal
            var overall = 0;
            if (Math.random() < 0.5) {overall = 1051017;} else {overall = 1050018} // Overall
            qm.gainItem(overall, 1); // Overall

            // Complete Quest
            qm.completeQuest(2217);

            qm.sendOk("Here is your reward for saving the city!\r\n\r\n#bHuckle's shop has been updated!#k\r\n\r\n" +
            "#v1142086# #t1142086#\r\n#v" + overall + "# #t" + overall + "#");
            qm.dispose();
        }

        // They can't hold anything
        else
        {
            qm.sendOk("Make some room in your #rEQUIP#k inventory. You need two slots!");
            qm.dispose();
        }
    }
}
