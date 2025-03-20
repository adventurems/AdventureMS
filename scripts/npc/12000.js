// AdventureMS Lucas
function start()
{
    // Check if player has King Slime Miniature
    if (cm.getPlayer().haveItem(3996020) && cm.getQuestStatus(2217) == 2)
    {
        // Update Zone Progress
        cm.getPlayer().updateZoneProgress();
        cm.getPlayer().stopExpOff();

        // Gain Slots
        cm.getPlayer().gainSlots(1, 4, true);
        cm.getPlayer().gainSlots(2, 4, true);
        cm.getPlayer().gainSlots(3, 4, true);
        cm.getPlayer().gainSlots(4, 4, true);

        // Remove King Slime Miniature
        cm.gainItem(3996020, -1);

        // Remove Key if they have it
        if (cm.haveItem(3997000)) {cm.gainItem(3997000, -1);}

        // Send Message
        cm.sendOk("Hey #e#h ##n!\r\n\r\nIs that the #rKing Slime Miniature#k?!?!? That's amazing, congratulations on clearing Zone 2!\r\n\r\nYou have now unlocked #bZone 3#k!\r\nIf your EXP was locked, it is now unlocked!");
        cm.dispose();
    }

    // They are trying to turn into Lucas prior to talking with JM first
    else if (cm.getQuestStatus(2217) == 1 && cm.haveItem(3996020))
    {
        cm.sendOk("Looks like you've defeated #rKing Slime#k but have not let JM (the Kerning mayor) know about your triumph. Please chat with him first!")
        cm.dispose();
    }

    // Normal Messaging
    else
    {
        cm.sendOk("Hey #e#h ##n! Welcome to #r#eAdventureMS!#k#n\r\n\r\nThis isn't your traditional Maplestory experience!\r\n\r\nIt's a new adventure within Maple world. Take your time and explore everywhere. There are lots of secrets to be found and people to meet.\r\n\r\nThe entire experience is hand crafted with new #rmechanics#k, #rgear#k, #rquests#k, and more!\r\n\r\nPay attention to your #rchat#k and use your #rquest log#k, they are important to progressing!\r\n\r\n#eWhen solving riddles, finding locations or just about any time you get stuck, read the quest log and listen to what people are saying! As you complete quests, the things people say will change, this can lead to new clues!#n\r\n\r\nYou can start by entering #bZone 1#k with the #dhay bales#k over at #bKora Tower#k to the East! You can quickly return back here at any time by using the #bHome#k button!");
        cm.dispose();
    }
}
