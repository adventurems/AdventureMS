// AdventureMS Nuris

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        cm.sendOk("Well, what do you know. Another adventurer, thinking they are so smart and capable. They don't call me a scientist for nothing, ya know?\r\n\r\n" +
        "I will admit, however, there are some that come through, quick thinking little whipper snappers. Is that you by chance? I guess we'll see.\r\n\r\nI'll help you out, just a bit. There are some some different colored snakes in that #rcave#k on the other side of the room.");
        cm.dispose();
    }

    // After pressing yes/next
    else if (status === 1)
    {

    }

    // After Advancing one further
    else if (status === 2)
    {

    }
}