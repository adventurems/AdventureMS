// AdventureMS Lime Balloon Guide

// Standard Status Code
function start() {status = -1; action(1,0,0);}
function action(mode, type, selection) { if (mode == 1) {status++;} else {status--;} if (status == -1) {cm.dispose();}

    // Initial Click
    else if (status == 0)
    {
        cm.sendNext("You are pretty smart, huh?");
    }

    // After pressing yes/next
    else if (status == 1)
    {
        cm.sendGetText("Have you found the password though?");
    }

    // After Advancing one further
    else if (status == 2)
    {
        // Test the text they sent
        if (cm.getText() === "Alakazam")
        {
            // Send them to the jump map
            cm.warp(106010119, "out00");
            cm.dispose();
        }

        else
        {
            cm.sendOk("Not quite, try again...");
            cm.dispose();
        }
    }
}