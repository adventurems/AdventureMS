// AdventureMS Shuang

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode === 1) {status++;} else {status--;} if (status === -1) {cm.dispose();}

    // Initial Click
    else if (status === 0)
    {
        if (cm.getQuestStatus(1034) < 2)
        {
            cm.sendOk("Hello, I'm Shuang. I lead the expedition here at the #bManaforge#k. I work closely with #bMoki#k the forge master.\r\n\r\n" +
                "The forge is not well these days. The heart has turned black and the the automatons run rampant across the land. Hopefully you are the one we need. So many others have come and fall before you.");
            cm.dispose();
        }

        // They cleared the forge already
        else
        {
            cm.sendOk("You did it, you saved the #bManaforge#k and saved these lands!\r\n\r\nMake sure you take your time to solve all the mysteries!");
            cm.dispose();
        }
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