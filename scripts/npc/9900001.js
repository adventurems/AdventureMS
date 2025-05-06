// AdventureMS Lime Balloon Guide

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        cm.sendNext("Very well done... On to the next step!");
    }

    // After pressing yes/next
    else if (status == 1)
    {
        cm.sendGetText("Have you found the password?");
    }

    // After Advancing one further
    else if (status == 2)
    {
        // Test the text they sent
        if (cm.getText() === "Alakazam")
        {
            cm.sendOk("Great job!");
            cm.dispose();
        }

        else
        {
            cm.sendOk("Not quite, try again...");
            cm.dispose();
        }
    }
}