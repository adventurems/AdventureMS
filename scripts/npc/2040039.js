// AdventureMS - Lime Balloon

function start()
{
    // Default text
    cm.sendOk("Not too shabby...");

    // Give item
    if (!cm.haveItem(3996013)) {cm.gainItem(3996013, 1);}
    cm.dispose();
}